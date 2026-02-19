<script>
  import { onMount, onDestroy } from "svelte";
  import { applyBrandingFromData } from "./clientThemes.js";

  // Props
  export let gameId = "";
  export let apiUrl = "";
  export let theme = "light";
  export let token = "";
  export let client = "";

  let containerEl;

  // State
  let game = null;
  let loading = true;
  let error = null;
  let board = []; // 9x9 grid of current values
  let initialBoard = []; // Original puzzle (non-zero = given)
  let solution = []; // Full solution
  let selectedCell = null; // { row, col }
  let gameState = "playing"; // 'playing' | 'won'
  let feedback = null;
  let notesMode = false;
  let notes = {}; // { "row,col": Set<number> }
  let history = []; // undo stack
  let conflicts = new Set(); // "row,col" keys with conflicts

  // Timer
  let elapsedTime = 0;
  let timerRunning = false;
  let timerInterval = null;

  $: themeClass = theme === "dark" ? "dark-theme" : "light-theme";
  $: difficulty = game?.difficulty || "Medium";
  $: completedCells = board.flat().filter((v) => v !== 0).length;
  $: totalCells = 81;
  $: progress = Math.round((completedCells / totalCells) * 100);

  onMount(() => {
    if (gameId) {
      fetchGame();
    }
    startTimer();
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      stopTimer();
    };
  });

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

  async function fetchGame() {
    try {
      loading = true;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(
        `${apiUrl}/api/public/games?type=sudoku&id=${gameId}`,
        {
          headers,
        },
      );
      if (!response.ok) throw new Error("Failed to fetch puzzle");
      const data = await response.json();
      game = data.data;

      // Apply branding if assigned
      if (game.branding && containerEl) {
        applyBrandingFromData(containerEl, game.branding);
      }

      // Parse puzzle and solution
      if (game.puzzle) {
        initialBoard =
          typeof game.puzzle === "string"
            ? JSON.parse(game.puzzle)
            : game.puzzle;
        board = initialBoard.map((row) => [...row]);
      }
      if (game.solution) {
        solution =
          typeof game.solution === "string"
            ? JSON.parse(game.solution)
            : game.solution;
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function isGiven(row, col) {
    return initialBoard[row]?.[col] !== 0;
  }

  function handleCellClick(row, col) {
    if (gameState !== "playing") return;
    if (selectedCell?.row === row && selectedCell?.col === col) {
      selectedCell = null;
    } else {
      selectedCell = { row, col };
    }
  }

  function handleKeydown(event) {
    if (gameState !== "playing" || !selectedCell) return;

    const key = event.key;
    const { row, col } = selectedCell;

    if (key >= "1" && key <= "9") {
      placeNumber(row, col, parseInt(key));
    } else if (key === "Backspace" || key === "Delete" || key === "0") {
      clearCell(row, col);
    } else if (key === "ArrowUp" && row > 0) {
      selectedCell = { row: row - 1, col };
    } else if (key === "ArrowDown" && row < 8) {
      selectedCell = { row: row + 1, col };
    } else if (key === "ArrowLeft" && col > 0) {
      selectedCell = { row, col: col - 1 };
    } else if (key === "ArrowRight" && col < 8) {
      selectedCell = { row, col: col + 1 };
    }
  }

  function placeNumber(row, col, num) {
    if (isGiven(row, col) || gameState !== "playing") return;

    if (notesMode) {
      const key = `${row},${col}`;
      if (!notes[key]) notes[key] = new Set();
      if (notes[key].has(num)) {
        notes[key].delete(num);
      } else {
        notes[key].add(num);
      }
      notes = notes;
      return;
    }

    // Save to history for undo
    history = [...history, { row, col, prev: board[row][col] }];

    board[row][col] = num;
    board = board;

    // Clear notes for this cell
    const key = `${row},${col}`;
    delete notes[key];
    notes = notes;

    // Check for conflicts
    validateBoard();

    // Check win
    checkWin();
  }

  function clearCell(row, col) {
    if (isGiven(row, col) || gameState !== "playing") return;

    history = [...history, { row, col, prev: board[row][col] }];
    board[row][col] = 0;
    board = board;

    const key = `${row},${col}`;
    delete notes[key];
    notes = notes;

    validateBoard();
  }

  function handleNumberPad(num) {
    if (!selectedCell || gameState !== "playing") return;
    placeNumber(selectedCell.row, selectedCell.col, num);
  }

  function handleErase() {
    if (!selectedCell || gameState !== "playing") return;
    clearCell(selectedCell.row, selectedCell.col);
  }

  function handleUndo() {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    history = history.slice(0, -1);
    board[last.row][last.col] = last.prev;
    board = board;
    validateBoard();
  }

  function handleHint() {
    if (!selectedCell || gameState !== "playing" || !solution.length) return;
    const { row, col } = selectedCell;
    if (isGiven(row, col)) return;

    const correctValue = solution[row][col];
    board[row][col] = correctValue;
    board = board;
    validateBoard();
    checkWin();
  }

  function validateBoard() {
    const newConflicts = new Set();

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = board[r][c];
        if (val === 0) continue;

        // Check row
        for (let cc = 0; cc < 9; cc++) {
          if (cc !== c && board[r][cc] === val) {
            newConflicts.add(`${r},${c}`);
            newConflicts.add(`${r},${cc}`);
          }
        }

        // Check column
        for (let rr = 0; rr < 9; rr++) {
          if (rr !== r && board[rr][c] === val) {
            newConflicts.add(`${r},${c}`);
            newConflicts.add(`${rr},${c}`);
          }
        }

        // Check 3x3 box
        const boxRow = Math.floor(r / 3) * 3;
        const boxCol = Math.floor(c / 3) * 3;
        for (let rr = boxRow; rr < boxRow + 3; rr++) {
          for (let cc = boxCol; cc < boxCol + 3; cc++) {
            if ((rr !== r || cc !== c) && board[rr][cc] === val) {
              newConflicts.add(`${r},${c}`);
              newConflicts.add(`${rr},${cc}`);
            }
          }
        }
      }
    }

    conflicts = newConflicts;
  }

  function checkWin() {
    // Check if all cells are filled without conflicts
    const allFilled = board.flat().every((v) => v !== 0);
    if (allFilled && conflicts.size === 0) {
      gameState = "won";
      stopTimer();
      showFeedback("🎉 Congratulations! Puzzle solved!", "success");
    }
  }

  function showFeedback(message, type) {
    feedback = { message, type };
    setTimeout(() => (feedback = null), 4000);
  }

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function getCellHighlight(row, col) {
    if (!selectedCell) return "";
    const { row: sr, col: sc } = selectedCell;

    // Same cell
    if (row === sr && col === sc) return "selected";

    // Same number highlight
    const selectedVal = board[sr][sc];
    if (selectedVal !== 0 && board[row][col] === selectedVal)
      return "same-number";

    // Same row/col/box
    if (row === sr || col === sc) return "related";

    const boxRow = Math.floor(sr / 3) * 3;
    const boxCol = Math.floor(sc / 3) * 3;
    if (row >= boxRow && row < boxRow + 3 && col >= boxCol && col < boxCol + 3)
      return "related";

    return "";
  }
</script>

<div class="sudoku-game {themeClass}" bind:this={containerEl}>
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading puzzle...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>⚠️ {error}</p>
    </div>
  {:else if game}
    <!-- Header -->
    <div class="game-header">
      <div class="header-left">
        <div class="header-meta">
          <span class="difficulty-badge">{difficulty}</span>
          {#if game.scheduled_date}
            <span class="puzzle-date"
              >{new Date(game.scheduled_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}</span
            >
          {/if}
        </div>
        <h1>{game.title || "Sudoku"}</h1>
      </div>
      <div class="header-right">
        <div class="timer-display">
          <span class="material-symbols-outlined timer-icon">timer</span>
          <span class="timer-value">{formatTime(elapsedTime)}</span>
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
      <!-- Sudoku Grid -->
      <div class="grid-section">
        <div class="grid-wrapper">
          <div class="sudoku-grid">
            {#each board as row, rowIndex}
              {#each row as cell, colIndex}
                <div
                  class="sudoku-cell {getCellHighlight(rowIndex, colIndex)}"
                  class:given={isGiven(rowIndex, colIndex)}
                  class:conflict={conflicts.has(`${rowIndex},${colIndex}`)}
                  class:box-right={colIndex === 2 || colIndex === 5}
                  class:box-bottom={rowIndex === 2 || rowIndex === 5}
                  role="button"
                  tabindex="0"
                  on:click={() => handleCellClick(rowIndex, colIndex)}
                  on:keydown={(e) =>
                    e.key === "Enter" && handleCellClick(rowIndex, colIndex)}
                >
                  {#if cell !== 0}
                    <span class="cell-value">{cell}</span>
                  {:else if notes[`${rowIndex},${colIndex}`]?.size > 0}
                    <div class="notes-grid">
                      {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n}
                        <span
                          class="note-num"
                          class:visible={notes[`${rowIndex},${colIndex}`].has(
                            n,
                          )}>{n}</span
                        >
                      {/each}
                    </div>
                  {/if}
                </div>
              {/each}
            {/each}
          </div>
        </div>

        <!-- Actions -->
        <div class="action-row">
          <button class="action-btn" on:click={handleUndo} title="Undo">
            <span class="material-symbols-outlined">undo</span>
            Undo
          </button>
          <button
            class="action-btn"
            class:active={notesMode}
            on:click={() => (notesMode = !notesMode)}
            title="Toggle notes"
          >
            <span class="material-symbols-outlined">edit_note</span>
            Notes {notesMode ? "ON" : ""}
          </button>
          <button class="action-btn" on:click={handleErase} title="Erase">
            <span class="material-symbols-outlined">backspace</span>
            Erase
          </button>
          <button class="action-btn" on:click={handleHint} title="Hint">
            <span class="material-symbols-outlined">lightbulb</span>
            Hint
          </button>
        </div>

        <!-- Number Pad -->
        <div class="number-pad">
          {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as num}
            <button class="num-btn" on:click={() => handleNumberPad(num)}>
              {num}
            </button>
          {/each}
        </div>

        <!-- Progress -->
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {progress}%"></div>
          </div>
          <span class="progress-text">{completedCells}/{totalCells} cells</span>
        </div>
      </div>

      <!-- Info Panel -->
      <div class="info-panel">
        <div class="info-header">
          <h3>How to Play</h3>
        </div>
        <div class="info-body">
          <ul class="rules-list">
            <li>
              Fill each row with numbers <strong>1–9</strong> without repeating.
            </li>
            <li>
              Fill each column with numbers <strong>1–9</strong> without repeating.
            </li>
            <li>
              Fill each <strong>3×3 box</strong> with numbers 1–9 without repeating.
            </li>
          </ul>

          <div class="legend">
            <div class="legend-row">
              <div class="legend-swatch given-swatch"></div>
              <span>Given numbers (cannot be changed)</span>
            </div>
            <div class="legend-row">
              <div class="legend-swatch selected-swatch"></div>
              <span>Selected cell</span>
            </div>
            <div class="legend-row">
              <div class="legend-swatch conflict-swatch"></div>
              <span>Conflict detected</span>
            </div>
          </div>
        </div>

        {#if feedback}
          <div class="info-feedback {feedback.type}">
            {feedback.message}
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="no-game">
      <p>No puzzle loaded. Set the <code>puzzle-id</code> attribute.</p>
    </div>
  {/if}
</div>

<style>
  * {
    box-sizing: border-box;
  }

  .sudoku-game {
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      sans-serif;
    margin: 0 auto;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--bg-secondary);
    color: var(--text-primary);
    padding: 0;
  }

  .light-theme {
    --bg-primary: #ffffff;
    --bg-secondary: #f9fafb;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
    --accent: #c25e40;
    --accent-hover: #a0492d;
    --accent-light: #fcece8;
    --cell-bg: #ffffff;
    --cell-given-bg: #f1f5f9;
    --cell-selected: #fcece8;
    --cell-related: #fef3f0;
    --cell-same-number: #fde8e1;
    --cell-conflict: #fef2f2;
    --conflict-text: #ef4444;
  }

  .dark-theme {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --border-color: #334155;
    --accent: #c25e40;
    --accent-hover: #a0492d;
    --accent-light: rgba(194, 94, 64, 0.15);
    --cell-bg: #1e293b;
    --cell-given-bg: #334155;
    --cell-selected: rgba(194, 94, 64, 0.2);
    --cell-related: rgba(194, 94, 64, 0.08);
    --cell-same-number: rgba(194, 94, 64, 0.15);
    --cell-conflict: rgba(239, 68, 68, 0.15);
    --conflict-text: #f87171;
  }

  /* Loading & Error */
  .loading,
  .error,
  .no-game {
    text-align: center;
    padding: 48px;
    color: var(--text-secondary);
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
  .game-header {
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

  .game-header h1 {
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

  /* ============================================
     GAME LAYOUT
     ============================================ */
  .game-layout {
    display: flex;
    gap: 32px;
    padding: 0 32px 32px;
    align-items: flex-start;
  }

  @media (max-width: 1024px) {
    .game-layout {
      flex-direction: column;
      padding: 0 16px 16px;
    }
  }

  @media (max-width: 768px) {
    .game-header {
      padding: 16px;
    }
    .game-header h1 {
      font-size: 1.5rem;
    }
  }

  /* ============================================
     GRID SECTION
     ============================================ */
  .grid-section {
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 520px;
    width: 100%;
  }

  @media (max-width: 1024px) {
    .grid-section {
      max-width: 100%;
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
  }

  .sudoku-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    border: 2px solid var(--text-primary);
  }

  .sudoku-cell {
    position: relative;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cell-bg);
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: background-color 0.1s ease;
    user-select: none;
  }

  .sudoku-cell.box-right {
    border-right: 2px solid var(--text-primary);
  }

  .sudoku-cell.box-bottom {
    border-bottom: 2px solid var(--text-primary);
  }

  .sudoku-cell.given {
    background: var(--cell-given-bg);
  }

  .sudoku-cell.related {
    background: var(--cell-related);
  }

  .sudoku-cell.same-number {
    background: var(--cell-same-number);
  }

  .sudoku-cell.selected {
    background: var(--cell-selected);
    box-shadow: inset 0 0 0 2px var(--accent);
  }

  .sudoku-cell.conflict {
    background: var(--cell-conflict);
  }

  .sudoku-cell.conflict .cell-value {
    color: var(--conflict-text);
  }

  .cell-value {
    font-family: "Inter", sans-serif;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1;
  }

  .sudoku-cell.given .cell-value {
    font-weight: 700;
    color: var(--text-primary);
  }

  /* Notes */
  .notes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    width: 100%;
    height: 100%;
    padding: 1px;
  }

  .note-num {
    font-size: 0.55rem;
    font-weight: 500;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
  }

  .note-num.visible {
    visibility: visible;
  }

  /* ============================================
     ACTIONS
     ============================================ */
  .action-row {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    background: var(--bg-primary);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    min-width: 60px;
  }

  .action-btn .material-symbols-outlined {
    font-size: 20px;
  }

  .action-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .action-btn.active {
    background: var(--accent-light);
    border-color: var(--accent);
    color: var(--accent);
  }

  /* ============================================
     NUMBER PAD
     ============================================ */
  .number-pad {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 6px;
  }

  .num-btn {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Inter", sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .num-btn:hover {
    background: var(--accent-light);
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-1px);
  }

  .num-btn:active {
    transform: translateY(0);
  }

  /* ============================================
     PROGRESS
     ============================================ */
  .progress-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .progress-bar {
    flex: 1;
    height: 6px;
    background: var(--border-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
    white-space: nowrap;
  }

  /* ============================================
     INFO PANEL
     ============================================ */
  .info-panel {
    flex: 1;
    min-width: 260px;
    background: var(--bg-primary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }

  .info-header {
    padding: 16px 24px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
  }

  .info-header h3 {
    margin: 0;
    font-family: "Playfair Display", serif;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .info-body {
    padding: 24px;
  }

  .rules-list {
    list-style: none;
    padding: 0;
    margin: 0 0 24px;
  }

  .rules-list li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .rules-list li::before {
    content: "•";
    color: var(--text-primary);
    font-weight: 700;
    flex-shrink: 0;
  }

  .rules-list li:last-child {
    margin-bottom: 0;
  }

  .legend {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .legend-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .legend-swatch {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  .given-swatch {
    background: var(--cell-given-bg);
  }

  .selected-swatch {
    background: var(--cell-selected);
    box-shadow: inset 0 0 0 2px var(--accent);
  }

  .conflict-swatch {
    background: var(--cell-conflict);
    border-color: var(--conflict-text);
  }

  .legend-row span {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .info-feedback {
    padding: 12px 16px;
    margin: 16px;
    border-radius: 8px;
    font-weight: 500;
    text-align: center;
    animation: slideIn 0.3s ease;
  }

  .info-feedback.success {
    background: #10b981;
    color: white;
  }

  .info-feedback.error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
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
</style>
