<script>
  import { onMount, onDestroy } from "svelte";
  import {
    generateLayout,
    generateLayoutOptimized,
  } from "./crosswordLayout.js";

  // Props (attributes)
  export let puzzleId = "";
  export let theme = "light";
  export let apiUrl = "";
  export let layoutSeed = 1; // Seed for layout generation
  export let token = "";

  // State
  let puzzle = null;
  let grid = [];
  let gridSize = 10; // Computed grid size from auto-layout
  let currentSeed = layoutSeed; // Current active seed
  let useOptimized = true; // Use auto-optimization by default
  let cellInputs = {};
  let selectedCell = null;
  let selectedDirection = "across";
  let isPreviewMode = false;
  let loading = true;
  let error = null;
  let feedback = null;
  let mainWordComplete = false;

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
  function handleClueClick(clue) {
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
    // Check if in preview mode
    const urlParams = new URLSearchParams(window.location.search);
    isPreviewMode = urlParams.get("preview") === "true";

    // Listen for Directus preview messages
    if (isPreviewMode) {
      window.addEventListener("message", handlePreviewMessage);
    }

    // Fetch puzzle data
    if (puzzleId) {
      fetchPuzzle();
    }

    // Start the timer
    startTimer();

    return () => {
      window.removeEventListener("message", handlePreviewMessage);
      stopTimer();
    };
  });

  function handlePreviewMessage(event) {
    // Handle Directus live preview updates
    // Directus sends different message formats
    const data = event.data;

    // Debug logging
    console.log("Preview message received:", data);

    if (!data) return;

    // Handle various Directus preview message formats
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
      const response = await fetch(`${apiUrl}/items/crosswords/${puzzleId}`, {
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch puzzle");
      const data = await response.json();
      puzzle = data.data;
      // Use layout_seed from puzzle data if available
      if (puzzle.layout_seed !== undefined && puzzle.layout_seed !== null) {
        currentSeed = puzzle.layout_seed;
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function buildGrid() {
    const words = puzzle.words || [];

    // Use auto-layout algorithm if words don't have positions
    let layoutWords = words;
    let size = puzzle.grid_size || 15;

    // Check if words have manual positions (x, y defined)
    const hasManualPositions = words.some(
      (w) => w.x !== undefined && w.y !== undefined,
    );

    if (!hasManualPositions && words.length > 0) {
      // Use optimized layout that tries multiple seeds for best density
      const layout = useOptimized
        ? generateLayoutOptimized(words, currentSeed, 1000)
        : generateLayout(words, currentSeed);
      layoutWords = layout.placedWords;
      size = layout.gridSize;
      currentSeed = layout.seed; // Update to the best seed found

      // Propagate main_word_index from original words to layout words
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

      console.log("Auto-layout generated:", layout);
    }

    // Store computed grid size
    gridSize = size;

    // Initialize empty grid
    grid = Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => ({
            letter: "",
            isBlocked: true,
            number: null,
            wordIds: [],
          })),
      );

    // Place words on grid
    let wordNumber = 1;
    const numberedCells = new Set();

    // Sort words by position for consistent numbering
    const sortedWords = [...layoutWords].sort((a, b) => {
      const posA = a.y * size + a.x;
      const posB = b.y * size + b.x;
      return posA - posB;
    });

    sortedWords.forEach((word, wordIndex) => {
      const { word: answer, x, y, direction } = word;
      if (x === undefined || y === undefined) return;

      const cellKey = `${x},${y}`;

      // Assign number to starting cell if not already numbered
      if (!numberedCells.has(cellKey)) {
        numberedCells.add(cellKey);
        if (grid[y] && grid[y][x]) {
          grid[y][x].number = wordNumber++;
        }
      }

      // Place each letter
      for (let i = 0; i < answer.length; i++) {
        const cellX = direction === "across" ? x + i : x;
        const cellY = direction === "down" ? y + i : y;

        if (cellY < size && cellX < size && grid[cellY] && grid[cellY][cellX]) {
          grid[cellY][cellX].letter = answer[i].toUpperCase();
          grid[cellY][cellX].isBlocked = false;
          grid[cellY][cellX].wordIds.push(wordIndex);
        }
      }
    });

    // Trim empty rows from bottom and right
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

    // Resize grid to only include used rows/columns (+1 for 0-indexing)
    const trimmedRows = maxUsedRow + 1;
    const trimmedCols = maxUsedCol + 1;

    grid = grid.slice(0, trimmedRows).map((row) => row.slice(0, trimmedCols));
    gridSize = Math.max(trimmedRows, trimmedCols);

    // Store layout words for clue display
    puzzle._layoutWords = sortedWords;
  }

  function handleCellClick(rowIndex, colIndex) {
    const cell = grid[rowIndex][colIndex];
    if (cell.isBlocked) return;

    const words = puzzle?._layoutWords || puzzle?.words || [];

    // Find which directions are available at this cell
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

    // Toggle direction if clicking same cell and both directions available
    if (selectedCell?.row === rowIndex && selectedCell?.col === colIndex) {
      if (hasAcross && hasDown) {
        selectedDirection = selectedDirection === "across" ? "down" : "across";
      }
    } else {
      // New cell clicked - auto-detect direction
      if (hasAcross && !hasDown) {
        selectedDirection = "across";
      } else if (hasDown && !hasAcross) {
        selectedDirection = "down";
      }
      // If both directions available, keep current direction
    }

    selectedCell = { row: rowIndex, col: colIndex };
  }

  function handleCellInput(event, rowIndex, colIndex) {
    // Input event is now secondary - keydown handles letter input
    const value = event.target.value.toUpperCase().slice(-1);
    const key = `${rowIndex},${colIndex}`;

    // Only update if different (keydown may have already set it)
    if (cellInputs[key] !== value) {
      cellInputs[key] = value;
      cellInputs = cellInputs;
    }
  }

  function handleKeyDown(event, rowIndex, colIndex) {
    const key = event.key;

    // Handle letter input directly - replace any existing value
    if (key.length === 1 && key.match(/[a-zA-Z\u0100-\u017F]/)) {
      event.preventDefault(); // Prevent default input behavior

      const cellKey = `${rowIndex},${colIndex}`;
      const newValue = key.toUpperCase();

      // Set the new value directly
      cellInputs[cellKey] = newValue;
      cellInputs = cellInputs; // Trigger reactivity

      // Move to next cell
      moveToNextCell(rowIndex, colIndex);
    } else if (key === "Backspace") {
      const cellKey = `${rowIndex},${colIndex}`;
      if (cellInputs[cellKey]) {
        // Clear current cell
        event.preventDefault();
        cellInputs[cellKey] = "";
        cellInputs = cellInputs;
      } else {
        // Move to previous cell
        event.preventDefault();
        moveToPrevCell(rowIndex, colIndex);
      }
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      selectedDirection = "across";
      moveToNextCell(rowIndex, colIndex);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectedDirection = "across";
      moveToPrevCell(rowIndex, colIndex);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      selectedDirection = "down";
      moveToNextCell(rowIndex, colIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      selectedDirection = "down";
      moveToPrevCell(rowIndex, colIndex);
    }
  }

  function moveToNextCell(row, col) {
    let nextRow = row;
    let nextCol = col;

    if (selectedDirection === "across") {
      nextCol = col + 1;
    } else {
      nextRow = row + 1;
    }

    // Check bounds against actual grid dimensions (not gridSize which may be larger)
    if (nextRow >= grid.length || nextCol >= (grid[0]?.length || 0)) return;
    if (!grid[nextRow] || !grid[nextRow][nextCol]) return;

    if (!grid[nextRow][nextCol].isBlocked) {
      selectedCell = { row: nextRow, col: nextCol };
      focusCell(nextRow, nextCol);
    }
  }

  function moveToPrevCell(row, col) {
    let prevRow = row;
    let prevCol = col;

    if (selectedDirection === "across") {
      prevCol = col - 1;
      if (prevCol < 0) return;
    } else {
      prevRow = row - 1;
      if (prevRow < 0) return;
    }

    if (!grid[prevRow][prevCol].isBlocked) {
      selectedCell = { row: prevRow, col: prevCol };
      focusCell(prevRow, prevCol);
    }
  }

  function focusCell(row, col) {
    setTimeout(() => {
      const input = document.querySelector(`[data-cell="${row},${col}"]`);
      if (input) input.focus();
    }, 0);
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
    // Use layout words if available (from auto-layout)
    const words = puzzle?._layoutWords || puzzle?.words || [];
    return words
      .map((word, index) => {
        const cell = grid[word.y]?.[word.x];
        return {
          number: cell?.number || "?",
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

  function tryDifferentLayout() {
    currentSeed = currentSeed + 1;
    cellInputs = {}; // Clear inputs
    buildGrid();
  }

  // Get the currently selected clue based on selected cell and direction
  function getSelectedClue() {
    if (!selectedCell || !puzzle?._layoutWords) return null;

    const words = puzzle._layoutWords || puzzle.words || [];
    const { row, col } = selectedCell;

    // Find word that matches current direction and contains this cell
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.direction !== selectedDirection) continue;

      const wordLength = word.word.length;
      const dx = word.direction === "across" ? 1 : 0;
      const dy = word.direction === "down" ? 1 : 0;

      // Check if cell is within this word
      for (let j = 0; j < wordLength; j++) {
        const cellX = word.x + j * dx;
        const cellY = word.y + j * dy;
        if (cellX === col && cellY === row) {
          const cellAtStart = grid[word.y]?.[word.x];
          return {
            number: cellAtStart?.number || "?",
            clue: word.clue,
            direction: word.direction,
            arrow: word.direction === "across" ? "→" : "↓",
            wordIndex: i,
          };
        }
      }
    }

    // Fallback: find any word in any direction that contains this cell
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const wordLength = word.word.length;
      const dx = word.direction === "across" ? 1 : 0;
      const dy = word.direction === "down" ? 1 : 0;

      for (let j = 0; j < wordLength; j++) {
        const cellX = word.x + j * dx;
        const cellY = word.y + j * dy;
        if (cellX === col && cellY === row) {
          const cellAtStart = grid[word.y]?.[word.x];
          return {
            number: cellAtStart?.number || "?",
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

  // Get all cells that belong to the currently selected word
  function getSelectedWordCells(selCell, selDir) {
    if (!selCell || !puzzle?._layoutWords) return new Set();

    const words = puzzle._layoutWords || puzzle.words || [];
    const { row, col } = selCell;
    const cells = new Set();

    // Find word that matches current direction and contains this cell
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.direction !== selDir) continue;

      const wordLength = word.word.length;
      const dx = word.direction === "across" ? 1 : 0;
      const dy = word.direction === "down" ? 1 : 0;

      // Check if cell is within this word
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
        // Add all cells of this word
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
  // Make reactive statement properly depend on selectedCell and selectedDirection
  $: currentClue = selectedCell && selectedDirection ? getSelectedClue() : null;
  $: selectedWordCells = getSelectedWordCells(selectedCell, selectedDirection);

  // Main word feature
  // Compute main word cells from puzzle data
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
        number: grid[word.y]?.[word.x]?.number,
      });
    }

    // Sort to match main_word letter order (G-A-L-I, not grid position)
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

  function computeMainWordProgress(data, inputs) {
    return data.map((d) => {
      const key = `${d.row},${d.col}`;
      const typed = inputs[key] || "";
      return {
        ...d,
        filled: typed.toUpperCase() === d.expectedLetter,
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
</script>

<div class="crossword-container {themeClass}">
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading puzzle...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>⚠️ {error}</p>
    </div>
  {:else if puzzle}
    <!-- Header -->
    <div class="puzzle-header">
      <div class="header-left">
        <div class="header-meta">
          {#if puzzle.difficulty}
            <span class="difficulty-badge">{puzzle.difficulty}</span>
          {/if}
          {#if puzzle.scheduled_date}
            <span class="puzzle-date"
              >{new Date(puzzle.scheduled_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}</span
            >
          {/if}
        </div>
        <h1>{puzzle.title || "Crossword"}</h1>
      </div>
      <div class="header-right">
        <div class="timer-display">
          <span class="material-symbols-outlined timer-icon">timer</span>
          <span class="timer-value"
            >{String(Math.floor(elapsedTime / 60)).padStart(2, "0")}:{String(
              elapsedTime % 60,
            ).padStart(2, "0")}</span
          >
          <div class="timer-divider"></div>
          <button
            class="icon-btn"
            on:click={toggleTimer}
            title={timerRunning ? "Pause" : "Resume"}
          >
            <span class="material-symbols-outlined"
              >{timerRunning ? "pause_circle" : "play_circle"}</span
            >
          </button>
        </div>
      </div>
    </div>

    <div class="game-layout">
      <!-- Left: Grid + Actions -->
      <div class="grid-section">
        <div class="grid-wrapper">
          <div
            class="crossword-grid"
            style="--grid-cols: {grid[0]?.length ||
              1}; --grid-rows: {grid.length || 1}"
          >
            {#each grid as row, rowIndex}
              {#each row as cell, colIndex}
                <div
                  class="cell"
                  class:blocked={cell.isBlocked}
                  class:selected={selectedCell?.row === rowIndex &&
                    selectedCell?.col === colIndex}
                  class:word-highlighted={selectedWordCells.has(
                    `${rowIndex},${colIndex}`,
                  )}
                  class:main-word-cell={mainWordCellSet.has(
                    `${rowIndex},${colIndex}`,
                  )}
                  role="button"
                  tabindex={cell.isBlocked ? -1 : 0}
                  on:click={() => handleCellClick(rowIndex, colIndex)}
                  on:keydown={(e) =>
                    e.key === "Enter" && handleCellClick(rowIndex, colIndex)}
                >
                  {#if cell.number}
                    <span class="cell-number">{cell.number}</span>
                  {/if}
                  {#if mainWordCellSet.has(`${rowIndex},${colIndex}`)}
                    <span class="main-word-dot"></span>
                  {/if}
                  {#if !cell.isBlocked}
                    <input
                      type="text"
                      maxlength="1"
                      data-cell="{rowIndex},{colIndex}"
                      value={cellInputs[`${rowIndex},${colIndex}`] || ""}
                      on:input={(e) => handleCellInput(e, rowIndex, colIndex)}
                      on:keydown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      autocomplete="off"
                      autocapitalize="characters"
                    />
                  {/if}
                </div>
              {/each}
            {/each}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-row">
          <div class="action-group">
            <button class="action-btn" on:click={checkAnswers}>
              <span class="material-symbols-outlined">check</span>
              Check
            </button>
          </div>
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

        <!-- Main Word Progress -->
        {#if puzzle.main_word && mainWordData.length > 0}
          <div class="main-word-section">
            <div class="main-word-label">
              <span class="material-symbols-outlined">star</span>
              Main Word
            </div>
            <div class="main-word-slots">
              {#each mainWordProgress as slot, i}
                <div
                  class="main-word-slot"
                  class:filled={slot.filled}
                  class:has-letter={slot.typedLetter}
                >
                  <span class="slot-letter"
                    >{slot.filled
                      ? slot.expectedLetter
                      : slot.typedLetter
                        ? "·"
                        : ""}</span
                  >
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Main Word Celebration -->
        {#if mainWordComplete}
          <div class="celebration">
            <div class="celebration-content">
              <span class="celebration-icon">🎉</span>
              <h2>You found the word!</h2>
              <p class="celebration-word">{puzzle.main_word}</p>
              <p class="celebration-time">
                Solved in {String(Math.floor(elapsedTime / 60)).padStart(
                  2,
                  "0",
                )}:{String(elapsedTime % 60).padStart(2, "0")}
              </p>
            </div>
          </div>
        {/if}
      </div>

      <!-- Right: Clues Panel -->
      <div class="clues-panel">
        <div class="clues-header">
          <h3>Clues</h3>
        </div>

        <div class="clues-body">
          <!-- Across -->
          <div class="clue-section">
            <h4>Across</h4>
            <ul>
              {#each allClues.filter((c) => c.direction === "across") as clue}
                <li
                  class="clue-item"
                  class:active={currentClue &&
                    currentClue.number === clue.number &&
                    currentClue.direction === clue.direction}
                  on:click={() => handleClueClick(clue)}
                  role="button"
                  tabindex="0"
                  on:keydown={(e) => e.key === "Enter" && handleClueClick(clue)}
                >
                  <span class="clue-num">{clue.number}</span>
                  <span class="clue-text">{clue.clue}</span>
                </li>
              {/each}
            </ul>
          </div>

          <!-- Down -->
          <div class="clue-section">
            <h4>Down</h4>
            <ul>
              {#each allClues.filter((c) => c.direction === "down") as clue}
                <li
                  class="clue-item"
                  class:active={currentClue &&
                    currentClue.number === clue.number &&
                    currentClue.direction === clue.direction}
                  on:click={() => handleClueClick(clue)}
                  role="button"
                  tabindex="0"
                  on:keydown={(e) => e.key === "Enter" && handleClueClick(clue)}
                >
                  <span class="clue-num">{clue.number}</span>
                  <span class="clue-text">{clue.clue}</span>
                </li>
              {/each}
            </ul>
          </div>
        </div>

        <!-- Current Clue Footer -->
        <div class="clue-footer">
          {#if currentClue}
            <div class="clue-footer-content">
              <span class="clue-footer-label">Current Clue</span>
              <span class="clue-footer-text"
                >{currentClue.number}
                {currentClue.direction === "across" ? "Across" : "Down"}: {currentClue.clue}</span
              >
            </div>
            <button class="icon-btn-light" title="Next clue">
              <span class="material-symbols-outlined">keyboard_tab</span>
            </button>
          {:else}
            <div class="clue-footer-content">
              <span class="clue-footer-label">Current Clue</span>
              <span class="clue-footer-text">Select a cell to begin</span>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <div class="no-puzzle">
      <p>No puzzle loaded. Set the <code>puzzle-id</code> attribute.</p>
    </div>
  {/if}
</div>

<style>
  * {
    box-sizing: border-box;
  }

  .crossword-container {
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      sans-serif;
    padding: 0;
    margin: 0 auto;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--bg-secondary);
  }

  /* Theme Colors - Rustycogs Design System */
  .light-theme {
    --bg-primary: #ffffff;
    --bg-secondary: #f9fafb;
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
  }

  .crossword-container {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  /* Loading & Error States */
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
    border-top-color: var(--accent);
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

  /* ============================================
     HEADER
     ============================================ */
  .puzzle-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 24px 32px;
    gap: 24px;
    flex-wrap: wrap;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .header-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 2px;
  }

  .difficulty-badge {
    background: var(--accent);
    color: white;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 2px 8px;
    border-radius: 2px;
    line-height: 1.6;
  }

  .puzzle-date {
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .puzzle-header h1 {
    margin: 0;
    font-family: "Playfair Display", serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.2;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .timer-display {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    padding: 8px 16px;
    border-radius: 999px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .timer-icon {
    color: var(--accent);
    font-size: 20px;
  }

  .timer-value {
    font-family: monospace;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--text-primary);
  }

  .timer-divider {
    width: 1px;
    height: 16px;
    background: var(--border-color);
  }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease;
  }

  .icon-btn:hover {
    color: var(--accent);
  }

  .settings-btn {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    padding: 8px;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .settings-btn:hover {
    color: var(--accent);
  }

  /* ============================================
     GAME LAYOUT
     ============================================ */
  .game-layout {
    display: flex;
    gap: 24px;
    padding: 0 32px 32px;
    align-items: flex-start;
    max-height: calc(100vh - 120px);
  }

  @media (max-width: 1024px) {
    .game-layout {
      flex-direction: column;
      padding: 0 16px 16px;
      max-height: none;
    }
  }

  @media (max-width: 768px) {
    .puzzle-header {
      padding: 16px;
    }

    .puzzle-header h1 {
      font-size: 1.5rem;
    }
  }

  /* ============================================
     GRID SECTION
     ============================================ */
  .grid-section {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
    max-height: calc(100vh - 160px);
  }

  @media (max-width: 1024px) {
    .grid-section {
      max-height: none;
    }
  }

  .grid-wrapper {
    background: var(--bg-primary);
    padding: 8px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-height: 100%;
    overflow: auto;
  }

  .crossword-grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-cols), 1fr);
    grid-template-rows: repeat(var(--grid-rows), 1fr);
    gap: 1px;
    background: #1a1a1a;
    border: 1px solid #1a1a1a;
    max-width: 100%;
    max-height: calc(100vh - 200px);
    aspect-ratio: var(--grid-cols) / var(--grid-rows);
  }

  .cell {
    position: relative;
    background: var(--cell-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    aspect-ratio: 1;
    transition: background-color 0.1s ease;
  }

  .cell.blocked {
    background: #1a1a1a;
    cursor: default;
  }

  .cell.word-highlighted {
    background: var(--cell-highlighted);
  }

  .cell.selected {
    background: var(--cell-selected-bg);
    box-shadow: inset 0 0 0 2px var(--cell-selected-ring);
  }

  .cell.selected input {
    color: var(--text-primary);
    font-weight: 600;
  }

  .cell.word-highlighted input {
    color: var(--text-primary);
  }

  .cell-number {
    position: absolute;
    top: 2px;
    left: 3px;
    font-size: 0.65rem;
    font-weight: 600;
    line-height: 1;
    color: var(--text-primary);
    pointer-events: none;
  }

  .cell input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    text-align: center;
    font-family: "Inter", sans-serif;
    font-size: 1.3rem;
    font-weight: 500;
    text-transform: uppercase;
    color: var(--text-primary);
    outline: none;
    caret-color: var(--accent);
    padding: 0;
  }

  .cell input:focus {
    outline: none;
  }

  /* ============================================
     ACTION BUTTONS
     ============================================ */
  .action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
  }

  .action-group {
    display: flex;
    gap: 12px;
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

  .action-btn .material-symbols-outlined {
    font-size: 18px;
    color: var(--text-secondary);
    transition: color 0.15s ease;
  }

  .action-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .action-btn:hover .material-symbols-outlined {
    color: var(--accent);
  }

  .action-btn.ghost {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    color: var(--text-secondary);
  }

  .action-btn.ghost:hover {
    background: var(--bg-primary);
    color: var(--text-primary);
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

  /* ============================================
     FEEDBACK
     ============================================ */
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

  /* ============================================
     CLUES PANEL
     ============================================ */
  .clues-panel {
    flex: 0 0 auto;
    width: 340px;
    max-width: 400px;
    min-width: 280px;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 160px);
    background: var(--bg-primary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    position: sticky;
    top: 16px;
  }

  @media (max-width: 1024px) {
    .clues-panel {
      width: 100%;
      max-width: 100%;
      max-height: 400px;
      position: static;
    }
  }

  .clues-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
  }

  .clues-header h3 {
    margin: 0;
    font-family: "Playfair Display", serif;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .clues-tools {
    display: flex;
    gap: 4px;
  }

  .icon-btn-sm {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.15s ease;
  }

  .icon-btn-sm:hover {
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .icon-btn-sm .material-symbols-outlined {
    font-size: 18px;
  }

  .clues-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .clues-body::-webkit-scrollbar {
    width: 6px;
  }

  .clues-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .clues-body::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 3px;
  }

  .clues-body::-webkit-scrollbar-thumb:hover {
    background-color: #cbd5e1;
  }

  .clue-section {
    margin-bottom: 32px;
  }

  .clue-section:last-child {
    margin-bottom: 0;
  }

  .clue-section h4 {
    font-family: "Playfair Display", serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .clue-section ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .clue-item {
    display: flex;
    gap: 12px;
    padding: 10px 12px;
    margin: 0 -12px;
    border-radius: 8px;
    border-left: 4px solid transparent;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .clue-item:hover {
    background: var(--bg-secondary);
  }

  .clue-item.active {
    background: var(--accent-light);
    border-left-color: var(--accent);
  }

  .clue-num {
    font-weight: 700;
    color: var(--text-primary);
    font-size: 0.875rem;
    min-width: 20px;
    flex-shrink: 0;
  }

  .clue-item.active .clue-num {
    color: var(--accent);
  }

  .clue-text {
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--text-secondary);
    transition: color 0.15s ease;
  }

  .clue-item:hover .clue-text {
    color: var(--text-primary);
  }

  .clue-item.active .clue-text {
    color: var(--text-primary);
  }

  /* ============================================
     CLUE FOOTER
     ============================================ */
  .clue-footer {
    background: var(--accent);
    color: white;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  }

  .clue-footer-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .clue-footer-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.8;
  }

  .clue-footer-text {
    font-family: "Playfair Display", serif;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .icon-btn-light {
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease;
  }

  .icon-btn-light:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  code {
    background: var(--bg-secondary);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.85em;
  }

  /* ============================================
     MAIN WORD FEATURE
     ============================================ */
  .main-word-cell {
    box-shadow: inset 0 0 0 2px var(--accent) !important;
  }

  .main-word-dot {
    position: absolute;
    bottom: 3px;
    right: 3px;
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
    z-index: 3;
  }

  .main-word-section {
    background: var(--bg-primary);
    border: 2px solid var(--accent);
    border-radius: 12px;
    padding: 16px 20px;
    margin-top: 16px;
  }

  .main-word-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent);
    margin-bottom: 12px;
  }

  .main-word-label .material-symbols-outlined {
    font-size: 16px;
  }

  .main-word-slots {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .main-word-slot {
    width: 40px;
    height: 48px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    transition: all 0.3s ease;
    position: relative;
  }

  .main-word-slot::after {
    content: "";
    position: absolute;
    bottom: 6px;
    width: 16px;
    height: 2px;
    background: var(--text-secondary);
    border-radius: 1px;
    opacity: 0.4;
    transition: opacity 0.3s ease;
  }

  .main-word-slot.filled {
    border-color: var(--accent);
    background: var(--accent-light);
    transform: scale(1.05);
  }

  .main-word-slot.filled::after {
    opacity: 0;
  }

  .slot-letter {
    font-family: "Playfair Display", serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--accent);
  }

  .main-word-slot.has-letter:not(.filled) .slot-letter {
    color: var(--text-secondary);
  }

  /* Celebration */
  .celebration {
    margin-top: 16px;
    background: linear-gradient(135deg, var(--accent-light), var(--bg-primary));
    border: 2px solid var(--accent);
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    animation: celebrationPop 0.5s ease;
  }

  @keyframes celebrationPop {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .celebration-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 8px;
  }

  .celebration h2 {
    font-family: "Playfair Display", serif;
    font-size: 1.5rem;
    color: var(--text-primary);
    margin: 0 0 8px;
  }

  .celebration-word {
    font-family: "Playfair Display", serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.15em;
    margin: 0 0 8px;
  }

  .celebration-time {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin: 0;
  }
</style>
