<script>
  import { createEventDispatcher } from "svelte";

  export let grid = [];
  export let selectedCell = null;
  export let selectedWordCells = new Set();
  export let cellInputs = {};
  export let mainWordCellSet = new Set();
  export let blurred = false;

  const dispatch = createEventDispatcher();

  function handleCellClick(rowIndex, colIndex) {
    if (blurred) return;
    dispatch("cellClick", { row: rowIndex, col: colIndex });
  }

  function handleCellInput(event, rowIndex, colIndex) {
    if (blurred) return;
    dispatch("cellInput", { event, row: rowIndex, col: colIndex });
  }

  function handleKeyDown(event, rowIndex, colIndex) {
    if (blurred) return;
    dispatch("keyDown", { event, row: rowIndex, col: colIndex });
  }
</script>

<div class="grid-wrapper" class:blurred>
  <div
    class="crossword-grid"
    style="--grid-cols: {grid[0]?.length || 1}; --grid-rows: {grid.length || 1}"
  >
    {#each grid as row, rowIndex}
      {#each row as cell, colIndex}
        <div
          class="cell"
          class:blocked={cell.isBlocked}
          class:selected={!blurred &&
            selectedCell?.row === rowIndex &&
            selectedCell?.col === colIndex}
          class:word-highlighted={!blurred &&
            selectedWordCells.has(`${rowIndex},${colIndex}`)}
          class:main-word-cell={mainWordCellSet.has(`${rowIndex},${colIndex}`)}
          role="button"
          tabindex={cell.isBlocked || blurred ? -1 : 0}
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
              disabled={blurred}
            />
          {/if}
        </div>
      {/each}
    {/each}
  </div>
</div>

<style>
  .grid-wrapper {
    background: var(--bg-primary);
    padding: 0;
    border-radius: 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .crossword-grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-cols), 1fr);
    grid-template-rows: repeat(var(--grid-rows), 1fr);
    gap: 1px;
    background: var(--grid-border, var(--border-color));
    border: 1px solid var(--grid-border, var(--border-color));
    aspect-ratio: var(--grid-cols) / var(--grid-rows);
    width: 100%;
    /* max-height: calc(100vh - 200px); */
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
    background: var(--cell-blocked);
    cursor: default;
    border: 1px solid var(--cell-blocked);
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
    top: 1px;
    left: 2px;
    font-size: 0.5rem;
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
    font-family: var(--font-sans);
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

  /* Main word indicators */
  .main-word-cell {
    box-shadow: inset 0 0 0 2px var(--accent) !important;
  }

  .main-word-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 6px;
    height: 6px;
    background: transparent;
    border: 1.5px solid var(--text-secondary);
    border-radius: 50%;
    z-index: 3;
  }

  /* Blurred result mode */
  .grid-wrapper.blurred {
    pointer-events: none;
  }

  .grid-wrapper.blurred .cell input {
    filter: blur(5px);
    user-select: none;
  }

  .grid-wrapper.blurred .cell {
    cursor: default;
  }
</style>
