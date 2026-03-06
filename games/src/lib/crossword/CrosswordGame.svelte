<script>
  import { onMount, tick } from "svelte";
  import {
    generateLayout,
    generateLayoutOptimized,
  } from "../crosswordLayout.js";
  import { applyBrandingFromData } from "../clientThemes.js";
  import { locale, t } from "../i18n.js";
  import CluesSidebar from "./CluesSidebar.svelte";
  import ClueBanner from "./ClueBanner.svelte";
  import CrosswordGrid from "./CrosswordGrid.svelte";
  import MainWordSection from "./MainWordSection.svelte";
  import CelebrationOverlay from "./CelebrationOverlay.svelte";

  // Props (attributes)
  export let puzzleId = "";
  export let userId = "";
  export let theme = "light";
  export let apiUrl = "";
  export let layoutSeed = 1;
  export let token = "";
  export let client = "";
  export let resultId = "";
  export let lang = "lt";

  $: locale.set(lang);

  let containerEl;

  // State
  let puzzle = null;
  let grid = [];
  let gridSize = 10;
  let currentSeed = layoutSeed;
  let useOptimized = true;
  let cellInputs = {};
  let selectedCell = null;
  let selectedDirection = "across";
  let isPreviewMode = false;

  // Latest/history mode
  let latestMode = !puzzleId && !!userId;
  let historyOffset = 0;
  let historyMeta = null; // { current, total, hasNewer, hasOlder }
  let loading = true;
  let error = null;
  let feedback = null;
  let mainWordComplete = false;

  // Result/share state
  let resultMode = false;
  let resultData = null;
  let shareUrl = "";

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  $: puzzleSolveUrl = (() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("result");
    return url.toString();
  })();

  // Timer state
  let elapsedTime = 0;
  let timerRunning = false;
  let timerInterval = null;

  function startTimer() {
    if (timerInterval) return;
    timerRunning = true;
    timerInterval = setInterval(() => {
      elapsedTime += 1;
    }, 1000);
  }

  function stopTimer() {
    timerRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function toggleTimer() {
    if (timerRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  }

  // Handle clicking a clue to navigate to its first cell
  function handleClueClick(event) {
    const clue = event.detail || event;
    const words = puzzle?._layoutWords || puzzle?.words || [];
    const word = words.find(
      (w) =>
        w.direction === clue.direction &&
        grid[w.y]?.[w.x]?.number === clue.number,
    );
    if (word) {
      selectedDirection = clue.direction;
      selectedCell = { row: word.y, col: word.x };
      focusCell(word.y, word.x);
    }
  }

  // Reactive: Build grid from puzzle data
  $: if (puzzle) {
    buildGrid();
  }

  // Reactive: Theme class
  $: themeClass = theme === "dark" ? "dark-theme" : "light-theme";

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    isPreviewMode = urlParams.get("preview") === "true";

    if (isPreviewMode) {
      window.addEventListener("message", handlePreviewMessage);
    }

    if (resultId) {
      resultMode = true;
      fetchPuzzle().then(async () => {
        await tick();
        try {
          const decoded = JSON.parse(atob(resultId));
          elapsedTime = decoded.t || 0;
          mainWordComplete = true;
          fillGridWithAnswers();
        } catch {
          console.error("Invalid result data");
          resultMode = false;
        }
      });
    } else if (latestMode) {
      fetchLatest();
      startTimer();
    } else if (puzzleId) {
      fetchPuzzle();
      startTimer();
    }

    return () => {
      window.removeEventListener("message", handlePreviewMessage);
      stopTimer();
    };
  });

  function handlePreviewMessage(event) {
    const data = event.data;
    console.log("Preview message received:", data);
    if (!data) return;

    if (data.collection === "crosswords" && data.item) {
      puzzle = data.item;
      loading = false;
    } else if (data.type === "preview" && data.data) {
      puzzle = data.data;
      loading = false;
    } else if (data.event === "update" && data.payload) {
      puzzle = data.payload;
      loading = false;
    }
  }

  async function fetchPuzzle() {
    try {
      loading = true;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(
        `${apiUrl}/api/public/games?type=crosswords&id=${puzzleId}`,
        { headers },
      );
      if (!response.ok) throw new Error("Failed to fetch puzzle");
      const data = await response.json();
      puzzle = data.data;

      if (puzzle.branding && containerEl) {
        applyBrandingFromData(containerEl, puzzle.branding);
      }

      if (puzzle.layout_seed !== undefined && puzzle.layout_seed !== null) {
        currentSeed = puzzle.layout_seed;
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function fetchLatest(offset = 0) {
    try {
      loading = true;
      error = null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(
        `${apiUrl}/api/public/games/latest?type=crosswords&user=${userId}&offset=${offset}`,
        { headers },
      );
      if (!response.ok) throw new Error("No published games found");
      const data = await response.json();
      puzzle = data.data;
      historyMeta = data.meta;
      historyOffset = offset;

      // Reset game state for new puzzle
      cellInputs = {};
      selectedCell = null;
      selectedDirection = "across";
      solvedClues = new Set();
      mainWordComplete = false;
      elapsedTime = 0;
      feedback = null;

      if (puzzle.branding && containerEl) {
        applyBrandingFromData(containerEl, puzzle.branding);
      }

      if (puzzle.layout_seed !== undefined && puzzle.layout_seed !== null) {
        currentSeed = puzzle.layout_seed;
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function navigateHistory(direction) {
    if (direction === "older" && historyMeta?.hasOlder) {
      stopTimer();
      fetchLatest(historyOffset + 1).then(() => startTimer());
    } else if (direction === "newer" && historyMeta?.hasNewer) {
      stopTimer();
      fetchLatest(historyOffset - 1).then(() => startTimer());
    }
  }

  function fillGridWithAnswers() {
    if (!grid.length) return;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (!cell.isBlocked && cell.letter) {
          cellInputs[`${r},${c}`] = cell.letter;
        }
      }
    }
    cellInputs = { ...cellInputs };
  }

  function shareResult() {
    const data = btoa(JSON.stringify({ t: elapsedTime }));
    const url = new URL(window.location.href);
    url.searchParams.delete("result");
    url.searchParams.set("result", data);
    shareUrl = url.toString();
  }

  function buildGrid() {
    const words = puzzle.words || [];

    let layoutWords = words;
    let cols = puzzle.grid_size || 15;
    let rows = puzzle.grid_size || 15;

    const hasManualPositions = words.some(
      (w) => w.x !== undefined && w.y !== undefined,
    );

    if (!hasManualPositions && words.length > 0) {
      const layout = useOptimized
        ? generateLayoutOptimized(words, currentSeed, 1000)
        : generateLayout(words, currentSeed);
      layoutWords = layout.placedWords;
      cols = layout.gridWidth || layout.gridSize;
      rows = layout.gridHeight || layout.gridSize;
      currentSeed = layout.seed;

      const wordIndexMap = {};
      for (const w of words) {
        if (w.main_word_index !== undefined && w.main_word_index !== null) {
          wordIndexMap[w.word.toUpperCase()] = w.main_word_index;
        }
      }
      for (const lw of layoutWords) {
        const key = lw.word.toUpperCase();
        if (wordIndexMap[key] !== undefined) {
          lw.main_word_index = wordIndexMap[key];
        }
      }
    }

    gridSize = Math.max(cols, rows);

    grid = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            letter: "",
            isBlocked: true,
            number: null,
            wordIds: [],
          })),
      );

    let wordNumber = 1;
    const numberedCells = new Map();

    const sortedWords = [...layoutWords].sort((a, b) => {
      const posA = a.y * cols + a.x;
      const posB = b.y * cols + b.x;
      return posA - posB;
    });

    sortedWords.forEach((word, wordIndex) => {
      const { word: answer, x, y, direction } = word;
      if (x === undefined || y === undefined) return;

      const cellKey = `${x},${y}`;

      if (!numberedCells.has(cellKey)) {
        const num = wordNumber++;
        numberedCells.set(cellKey, num);
        if (grid[y] && grid[y][x]) {
          grid[y][x].number = num;
        }
      }

      word._number = numberedCells.get(cellKey);

      for (let i = 0; i < answer.length; i++) {
        const cellX = direction === "across" ? x + i : x;
        const cellY = direction === "down" ? y + i : y;

        if (cellY < rows && cellX < cols && grid[cellY] && grid[cellY][cellX]) {
          grid[cellY][cellX].letter = answer[i].toUpperCase();
          grid[cellY][cellX].isBlocked = false;
          grid[cellY][cellX].wordIds.push(wordIndex);
        }
      }
    });

    let maxUsedRow = 0;
    let maxUsedCol = 0;

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (!grid[row][col].isBlocked) {
          maxUsedRow = Math.max(maxUsedRow, row);
          maxUsedCol = Math.max(maxUsedCol, col);
        }
      }
    }

    const trimmedRows = maxUsedRow + 1;
    const trimmedCols = maxUsedCol + 1;

    grid = grid.slice(0, trimmedRows).map((row) => row.slice(0, trimmedCols));
    gridSize = Math.max(trimmedRows, trimmedCols);

    puzzle._layoutWords = sortedWords;
  }

  function handleCellClick(event) {
    const { row: rowIndex, col: colIndex } = event.detail;
    const cell = grid[rowIndex][colIndex];
    if (cell.isBlocked) return;

    const words = puzzle?._layoutWords || puzzle?.words || [];

    let hasAcross = false;
    let hasDown = false;

    for (const word of words) {
      const wordLength = word.word.length;
      const dx = word.direction === "across" ? 1 : 0;
      const dy = word.direction === "down" ? 1 : 0;

      for (let j = 0; j < wordLength; j++) {
        const cellX = word.x + j * dx;
        const cellY = word.y + j * dy;
        if (cellX === colIndex && cellY === rowIndex) {
          if (word.direction === "across") hasAcross = true;
          if (word.direction === "down") hasDown = true;
          break;
        }
      }
    }

    if (selectedCell?.row === rowIndex && selectedCell?.col === colIndex) {
      if (hasAcross && hasDown) {
        selectedDirection = selectedDirection === "across" ? "down" : "across";
      }
    } else {
      if (hasAcross && !hasDown) {
        selectedDirection = "across";
      } else if (hasDown && !hasAcross) {
        selectedDirection = "down";
      }
    }

    selectedCell = { row: rowIndex, col: colIndex };
  }

  function handleCellInput(event) {
    const { event: inputEvent, row: rowIndex, col: colIndex } = event.detail;
    if (lockedCells.has(`${rowIndex},${colIndex}`)) return;
    const value = inputEvent.target.value.toUpperCase().slice(-1);
    const key = `${rowIndex},${colIndex}`;

    if (cellInputs[key] !== value) {
      cellInputs[key] = value;
      cellInputs = cellInputs;
    }
  }

  function handleKeyDown(event) {
    const { event: keyEvent, row: rowIndex, col: colIndex } = event.detail;
    const key = keyEvent.key;
    const cellLocked = lockedCells.has(`${rowIndex},${colIndex}`);

    if (key.length === 1 && key.match(/[a-zA-Z\u0100-\u017F]/)) {
      keyEvent.preventDefault();
      if (!cellLocked) {
        const cellKey = `${rowIndex},${colIndex}`;
        const newValue = key.toUpperCase();
        cellInputs[cellKey] = newValue;
        cellInputs = cellInputs;
      }
      moveToNextCell(rowIndex, colIndex);
    } else if (key === "Backspace") {
      keyEvent.preventDefault();
      if (!cellLocked) {
        const cellKey = `${rowIndex},${colIndex}`;
        if (cellInputs[cellKey]) {
          cellInputs[cellKey] = "";
          cellInputs = cellInputs;
        } else {
          moveToPrevCell(rowIndex, colIndex);
        }
      } else {
        moveToPrevCell(rowIndex, colIndex);
      }
    } else if (keyEvent.key === "ArrowRight") {
      keyEvent.preventDefault();
      selectedDirection = "across";
      moveToNextCell(rowIndex, colIndex);
    } else if (keyEvent.key === "ArrowLeft") {
      keyEvent.preventDefault();
      selectedDirection = "across";
      moveToPrevCell(rowIndex, colIndex);
    } else if (keyEvent.key === "ArrowDown") {
      keyEvent.preventDefault();
      selectedDirection = "down";
      moveToNextCell(rowIndex, colIndex);
    } else if (keyEvent.key === "ArrowUp") {
      keyEvent.preventDefault();
      selectedDirection = "down";
      moveToPrevCell(rowIndex, colIndex);
    }
  }

  function moveToNextCell(row, col) {
    let nextRow = row;
    let nextCol = col;

    while (true) {
      if (selectedDirection === "across") {
        nextCol += 1;
      } else {
        nextRow += 1;
      }

      if (nextRow >= grid.length || nextCol >= (grid[0]?.length || 0)) return;
      if (!grid[nextRow] || !grid[nextRow][nextCol]) return;
      if (grid[nextRow][nextCol].isBlocked) return;

      if (!lockedCells.has(`${nextRow},${nextCol}`)) {
        selectedCell = { row: nextRow, col: nextCol };
        focusCell(nextRow, nextCol);
        return;
      }
    }
  }

  function moveToPrevCell(row, col) {
    let prevRow = row;
    let prevCol = col;

    while (true) {
      if (selectedDirection === "across") {
        prevCol -= 1;
        if (prevCol < 0) return;
      } else {
        prevRow -= 1;
        if (prevRow < 0) return;
      }

      if (!grid[prevRow] || !grid[prevRow][prevCol]) return;
      if (grid[prevRow][prevCol].isBlocked) return;

      if (!lockedCells.has(`${prevRow},${prevCol}`)) {
        selectedCell = { row: prevRow, col: prevCol };
        focusCell(prevRow, prevCol);
        return;
      }
    }
  }

  async function focusCell(row, col) {
    await tick();
    const root = containerEl?.shadowRoot || containerEl || document;
    const input = root.querySelector(`[data-cell="${row},${col}"]`);
    if (input) input.focus();
  }

  function checkAnswers() {
    let correct = 0;
    let total = 0;

    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell.isBlocked) {
          total++;
          const userInput = cellInputs[`${rowIndex},${colIndex}`] || "";
          if (userInput === cell.letter) {
            correct++;
          }
        }
      });
    });

    if (correct === total) {
      feedback = { type: "success", message: "🎉 Perfect! All correct!" };
    } else if (correct >= total * 0.8) {
      feedback = {
        type: "good",
        message: `👍 Great job! ${correct}/${total} correct`,
      };
    } else {
      feedback = {
        type: "info",
        message: `${correct}/${total} correct - keep trying!`,
      };
    }

    setTimeout(() => (feedback = null), 4000);
  }

  function getAllClues() {
    const words = puzzle?._layoutWords || puzzle?.words || [];
    return words
      .map((word, index) => {
        return {
          number: word._number || "?",
          clue: word.clue,
          direction: word.direction,
          arrow: word.direction === "across" ? "→" : "↓",
          wordIndex: index,
          startX: word.x,
          startY: word.y,
          wordLength: word.word.length,
        };
      })
      .sort((a, b) => a.number - b.number);
  }

  function computeSolvedClues(_cellInputs) {
    const solved = new Set();
    const words = puzzle?._layoutWords || puzzle?.words || [];
    for (const word of words) {
      if (!word.word || word.x === undefined || word.y === undefined) continue;
      const dx = word.direction === "across" ? 1 : 0;
      const dy = word.direction === "down" ? 1 : 0;
      let allCorrect = true;
      for (let j = 0; j < word.word.length; j++) {
        const cx = word.x + j * dx;
        const cy = word.y + j * dy;
        const input = _cellInputs[`${cy},${cx}`] || "";
        if (input.toUpperCase() !== word.word[j].toUpperCase()) {
          allCorrect = false;
          break;
        }
      }
      if (allCorrect) {
        const num = word._number || "?";
        solved.add(`${num}-${word.direction}`);
      }
    }
    return solved;
  }

  function computeLockedCells(solved, puzzle) {
    const locked = new Set();
    if (!puzzle?._layoutWords) return locked;
    const words = puzzle._layoutWords;
    for (const word of words) {
      if (!word.word || word.x === undefined || word.y === undefined) continue;
      const num = word._number || "?";
      const key = `${num}-${word.direction}`;
      if (!solved.has(key)) continue;
      const dx = word.direction === "across" ? 1 : 0;
      const dy = word.direction === "down" ? 1 : 0;
      for (let j = 0; j < word.word.length; j++) {
        locked.add(`${word.y + j * dy},${word.x + j * dx}`);
      }
    }
    return locked;
  }

  function tryDifferentLayout() {
    currentSeed = currentSeed + 1;
    cellInputs = {};
    buildGrid();
  }

  function getSelectedClue() {
    if (!selectedCell || !puzzle?._layoutWords) return null;

    const words = puzzle._layoutWords || puzzle.words || [];
    const { row, col } = selectedCell;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.direction !== selectedDirection) continue;

      const wordLength = word.word.length;
      const dx = word.direction === "across" ? 1 : 0;
      const dy = word.direction === "down" ? 1 : 0;

      for (let j = 0; j < wordLength; j++) {
        const cellX = word.x + j * dx;
        const cellY = word.y + j * dy;
        if (cellX === col && cellY === row) {
          return {
            number: word._number || "?",
            clue: word.clue,
            direction: word.direction,
            arrow: word.direction === "across" ? "→" : "↓",
            wordIndex: i,
          };
        }
      }
    }

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const wordLength = word.word.length;
      const dx = word.direction === "across" ? 1 : 0;
      const dy = word.direction === "down" ? 1 : 0;

      for (let j = 0; j < wordLength; j++) {
        const cellX = word.x + j * dx;
        const cellY = word.y + j * dy;
        if (cellX === col && cellY === row) {
          return {
            number: word._number || "?",
            clue: word.clue,
            direction: word.direction,
            arrow: word.direction === "across" ? "→" : "↓",
            wordIndex: i,
          };
        }
      }
    }

    return null;
  }

  function getSelectedWordCells(selCell, selDir) {
    if (!selCell || !puzzle?._layoutWords) return new Set();

    const words = puzzle._layoutWords || puzzle.words || [];
    const { row, col } = selCell;
    const cells = new Set();

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.direction !== selDir) continue;

      const wordLength = word.word.length;
      const dx = word.direction === "across" ? 1 : 0;
      const dy = word.direction === "down" ? 1 : 0;

      let found = false;
      for (let j = 0; j < wordLength; j++) {
        const cellX = word.x + j * dx;
        const cellY = word.y + j * dy;
        if (cellX === col && cellY === row) {
          found = true;
          break;
        }
      }

      if (found) {
        for (let j = 0; j < wordLength; j++) {
          const cellX = word.x + j * dx;
          const cellY = word.y + j * dy;
          cells.add(`${cellY},${cellX}`);
        }
        return cells;
      }
    }

    return cells;
  }

  $: allClues = puzzle ? getAllClues() : [];
  $: currentClue = selectedCell && selectedDirection ? getSelectedClue() : null;
  $: selectedWordCells = getSelectedWordCells(selectedCell, selectedDirection);
  $: solvedClues = computeSolvedClues(cellInputs);
  $: lockedCells = computeLockedCells(solvedClues, puzzle);

  // Main word feature
  $: mainWordData = computeMainWordData(puzzle, grid);
  $: mainWordCellSet = new Set(mainWordData.map((d) => `${d.row},${d.col}`));
  $: mainWordProgress = computeMainWordProgress(mainWordData, cellInputs);

  function computeMainWordData(puzzle, grid) {
    if (!puzzle?.main_word || !puzzle?._layoutWords) return [];
    const words = puzzle._layoutWords;
    const collected = [];

    for (const word of words) {
      if (word.main_word_index === undefined || word.main_word_index === null)
        continue;
      const idx = word.main_word_index;
      if (idx < 0 || idx >= word.word.length) continue;
      const dx = word.direction === "across" ? 1 : 0;
      const dy = word.direction === "down" ? 1 : 0;
      const row = word.y + idx * dy;
      const col = word.x + idx * dx;
      collected.push({
        row,
        col,
        expectedLetter: word.word[idx].toUpperCase(),
        number: word._number,
        parentWord: word,
      });
    }

    const mainWord = puzzle.main_word.toUpperCase();
    const sorted = [];
    const used = new Array(collected.length).fill(false);

    for (let i = 0; i < mainWord.length; i++) {
      const target = mainWord[i];
      for (let j = 0; j < collected.length; j++) {
        if (!used[j] && collected[j].expectedLetter === target) {
          sorted.push(collected[j]);
          used[j] = true;
          break;
        }
      }
    }

    return sorted;
  }

  function isWordFullyCorrect(word, inputs) {
    const dx = word.direction === "across" ? 1 : 0;
    const dy = word.direction === "down" ? 1 : 0;
    for (let i = 0; i < word.word.length; i++) {
      const cx = word.x + i * dx;
      const cy = word.y + i * dy;
      const input = (inputs[`${cy},${cx}`] || "").toUpperCase();
      if (input !== word.word[i].toUpperCase()) return false;
    }
    return true;
  }

  function computeMainWordProgress(data, inputs) {
    return data.map((d) => {
      const key = `${d.row},${d.col}`;
      const typed = inputs[key] || "";
      const letterMatches = typed.toUpperCase() === d.expectedLetter;
      const wordCorrect = d.parentWord
        ? isWordFullyCorrect(d.parentWord, inputs)
        : letterMatches;
      return {
        ...d,
        filled: letterMatches && wordCorrect,
        typedLetter: typed.toUpperCase(),
      };
    });
  }

  // Check if main word is complete
  $: {
    if (
      mainWordProgress.length > 0 &&
      mainWordProgress.every((p) => p.filled)
    ) {
      if (!mainWordComplete) {
        mainWordComplete = true;
        stopTimer();
      }
    }
  }

  function navigateClue(event) {
    const offset = event.detail;
    if (!allClues || allClues.length === 0) return;
    let currentIndex = -1;
    if (currentClue) {
      currentIndex = allClues.findIndex(
        (c) =>
          c.number === currentClue.number &&
          c.direction === currentClue.direction,
      );
    }
    let nextIndex = currentIndex + offset;
    if (nextIndex < 0) nextIndex = allClues.length - 1;
    if (nextIndex >= allClues.length) nextIndex = 0;
    handleClueClick({ detail: allClues[nextIndex] });
  }
</script>

<div class="crossword-container {themeClass}" bind:this={containerEl}>
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>{$t("crossword.loading")}</p>
    </div>
  {:else if error}
    <div class="error">
      <p>⚠️ {error}</p>
    </div>
  {:else if puzzle}
    <div class="game-layout">
      <CluesSidebar
        {allClues}
        {currentClue}
        {solvedClues}
        on:clueClick={handleClueClick}
      />

      <div class="grid-section">
        <ClueBanner {currentClue} on:navigate={navigateClue} />

        <div class="grid-area">
          <div class:blurred-grid={resultMode}>
            <CrosswordGrid
              {grid}
              {selectedCell}
              {selectedWordCells}
              {cellInputs}
              {mainWordCellSet}
              {lockedCells}
              {currentClue}
              blurred={resultMode}
              on:cellClick={handleCellClick}
              on:cellInput={handleCellInput}
              on:keyDown={handleKeyDown}
            />
          </div>

          {#if resultMode}
            <div class="shared-overlay">
              <a class="shared-cta" href={puzzleSolveUrl}>
                {$t("crossword.startSolving")}
              </a>
            </div>
          {/if}
        </div>

        {#if isPreviewMode}
          <div class="action-row preview-actions">
            <button
              class="action-btn"
              on:click={tryDifferentLayout}
              title="Try a different layout"
            >
              ↻ Shuffle
            </button>
            <span class="seed-display">Seed: {currentSeed}</span>
          </div>
        {/if}

        {#if feedback}
          <div class="feedback {feedback.type}">
            {feedback.message}
          </div>
        {/if}

        {#if !resultMode}
          <MainWordSection
            {mainWordProgress}
            {elapsedTime}
            mainWord={puzzle.main_word}
          />
        {/if}

        {#if mainWordComplete}
          <CelebrationOverlay {elapsedTime} {shareUrl} on:share={shareResult} />
        {/if}

        {#if latestMode && historyMeta}
          <div class="history-nav">
            <button
              class="history-btn"
              disabled={!historyMeta.hasOlder}
              on:click={() => navigateHistory("older")}
            >
              ← {$t("crossword.older")}
            </button>
            <span class="history-count">
              {historyMeta.current + 1} / {historyMeta.total}
            </span>
            <button
              class="history-btn"
              disabled={!historyMeta.hasNewer}
              on:click={() => navigateHistory("newer")}
            >
              {$t("crossword.newer")} →
            </button>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="no-puzzle">
      <p>
        No puzzle loaded. Set the <code>puzzle-id</code> or <code>user</code> attribute.
      </p>
    </div>
  {/if}
</div>

<style>
  * {
    box-sizing: border-box;
  }

  .crossword-container {
    font-family: var(--font-sans);
    padding: 0;
    margin: 0 auto;
    max-width: 1440px;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  /* Theme Colors */
  .light-theme {
    --bg-primary: #ffffff;
    --bg-secondary: #f3f4f6;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
    --cell-bg: #ffffff;
    --cell-blocked: #1a1a1a;
    --cell-selected-bg: #fcece8;
    --cell-selected-ring: #c25e40;
    --cell-highlighted: #fcece8;
    --accent: #c25e40;
    --accent-hover: #a0492d;
    --accent-light: #fcece8;
    --correct: #007a3c;
    --correct-light: #e2f3ea;
  }

  .dark-theme {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --border-color: #334155;
    --cell-bg: #1e293b;
    --cell-blocked: #0f172a;
    --cell-selected-bg: rgba(194, 94, 64, 0.2);
    --cell-selected-ring: #c25e40;
    --cell-highlighted: rgba(194, 94, 64, 0.15);
    --accent: #c25e40;
    --accent-hover: #a0492d;
    --accent-light: rgba(194, 94, 64, 0.15);
    --correct: #10b981;
    --correct-light: rgba(16, 185, 129, 0.15);
  }

  /* Loading & Error */
  .loading,
  .error,
  .no-puzzle {
    text-align: center;
    padding: 48px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top-color: #64748b;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error {
    color: #ef4444;
  }

  /* Game Layout */
  .game-layout {
    display: flex;
    gap: 32px;
    padding: 20px 32px 32px;
    align-items: flex-start;
  }

  .grid-section {
    flex: 1 1 65%;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: visible;
  }

  @media (max-width: 1024px) {
    .game-layout {
      flex-direction: column;
      padding: 0 16px 16px;
      gap: 16px;
    }
    .grid-section {
      max-width: 100%;
      order: -1;
      flex: 1;
      flex-grow: 1;
      width: 100%;
    }
  }

  /* Action Buttons */
  .action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .action-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .preview-actions {
    justify-content: flex-start;
    gap: 8px;
  }

  .seed-display {
    font-size: 0.85rem;
    color: var(--text-secondary);
    background: var(--bg-primary);
    padding: 6px 12px;
    border-radius: 4px;
    font-family: monospace;
    border: 1px solid var(--border-color);
  }

  /* Feedback */
  .feedback {
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 500;
    text-align: center;
    animation: slideIn 0.3s ease;
  }

  .feedback.success {
    background: #10b981;
    color: white;
  }

  .feedback.good {
    background: #3b82f6;
    color: white;
  }

  .feedback.info {
    background: #f59e0b;
    color: white;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  code {
    background: var(--bg-secondary);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.85em;
  }

  /* Grid area container for overlay positioning */
  .grid-area {
    position: relative;
  }

  .blurred-grid {
    filter: blur(3px);
    pointer-events: none;
    user-select: none;
  }

  /* Shared result overlay */
  .shared-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    filter: none;
    pointer-events: auto;
  }

  .shared-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 28px;
    background: var(--accent, #c25e40);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-family: var(--font-sans);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s ease;
  }

  .shared-cta:hover {
    background: var(--accent-hover, #a14d34);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  /* History navigation */
  .history-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 12px 0;
    border-top: 1px solid var(--border-light, #e2e8f0);
    margin-top: 8px;
  }

  .history-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    background: var(--surface, #ffffff);
    border: 1px solid var(--border-light, #e2e8f0);
    border-radius: 6px;
    font-family: var(--font-sans);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-main, #0f172a);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .history-btn:hover:not(:disabled) {
    border-color: var(--accent, #c25e40);
    color: var(--accent, #c25e40);
  }

  .history-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .history-count {
    font-family: var(--font-sans);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-muted, #64748b);
  }
</style>
