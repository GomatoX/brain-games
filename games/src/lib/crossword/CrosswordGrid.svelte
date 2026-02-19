<script>
  import { createEventDispatcher } from "svelte";
  import { t } from "../i18n.js";

  export let grid = [];
  export let selectedCell = null;
  export let selectedWordCells = new Set();
  export let cellInputs = {};
  export let mainWordCellSet = new Set();
  export let blurred = false;
  export let currentClue = null;

  const dispatch = createEventDispatcher();

  let gridEl;

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

  function getTooltipPosition(cell, gridElement) {
    if (!cell || !gridElement) return null;
    const cellEl = gridElement.querySelector(
      `[data-cell="${cell.row},${cell.col}"]`,
    );
    if (!cellEl) return null;
    const cellParent = cellEl.closest(".cell");
    if (!cellParent) return null;
    const gridRect = gridElement.getBoundingClientRect();
    const cellRect = cellParent.getBoundingClientRect();
    return {
      left: cellRect.left - gridRect.left + cellRect.width / 2,
      top: cellRect.top - gridRect.top,
    };
  }

  $: tooltipPos = getTooltipPosition(selectedCell, gridEl);
  $: directionLabel =
    currentClue?.direction === "across"
      ? $t("crossword.across")
      : $t("crossword.down");
</script>

<div class="grid-wrapper" class:blurred>
  <div
    class="crossword-grid"
    bind:this={gridEl}
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

    {#if currentClue && !blurred && tooltipPos}
      <div
        class="grid-tooltip"
        style="left: {tooltipPos.left}px; top: {tooltipPos.top - 8}px;"
      >
        <div class="tooltip-body">
          <div class="tooltip-header">
            <svg class="tooltip-icon" viewBox="0 0 16 16" fill="none">
              {#if currentClue.direction === "across"}
                <path
                  d="M1 8h14M10 3l5 5-5 5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              {:else}
                <path
                  d="M8 1v14M3 10l5 5 5-5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              {/if}
            </svg>
            <span class="tooltip-direction">{directionLabel}</span>
          </div>
          <div class="tooltip-separator"></div>
          <span class="tooltip-text">{currentClue.clue}</span>
        </div>
        <div class="tooltip-arrow"></div>
      </div>
    {/if}
  </div>
</div>

<style>
  .grid-wrapper {
    background-color: var(--bg-secondary);
    padding: 32px;
    border-radius: 0;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  @media (max-width: 1024px) {
    .grid-wrapper {
      padding: 0;
    }
  }

  .crossword-grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-cols), minmax(0, 60px));
    gap: 0;
    background: var(--grid-border, var(--border-color));
    border: 1px solid var(--grid-border, var(--border-color));
    width: fit-content;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
  }

  @media (max-width: 1024px) {
    .crossword-grid {
      grid-template-columns: repeat(var(--grid-cols), 1fr);
      width: 100%;
    }
  }

  /* Floating tooltip — Figma design */
  .grid-tooltip {
    position: absolute;
    z-index: 10;
    pointer-events: none;
    transform: translate(-50%, -100%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tooltip-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    background: #67686e;
    border: 1px solid #fff;
    border-radius: 8px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.16);
    min-width: 120px;
    max-width: 200px;
  }

  .tooltip-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tooltip-icon {
    width: 16px;
    height: 16px;
    color: #fff;
    flex-shrink: 0;
  }

  .tooltip-direction {
    font-family: var(--font-sans, "Source Sans Pro", sans-serif);
    font-size: 12px;
    line-height: 12px;
    color: #fff;
    white-space: nowrap;
  }

  .tooltip-separator {
    width: 100%;
    height: 1px;
    background: #fff;
  }

  .tooltip-text {
    font-family: var(--font-sans, "Source Sans Pro", sans-serif);
    font-size: 12px;
    line-height: 12px;
    color: #fff;
    text-align: center;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #67686e;
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
    border: 0.5px solid var(--grid-border, var(--border-color));
  }

  .cell.blocked {
    background: var(--cell-blocked);
    cursor: default;
    border-color: var(--cell-blocked);
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
