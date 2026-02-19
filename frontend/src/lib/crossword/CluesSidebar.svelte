<script>
  import { createEventDispatcher } from "svelte";

  export let allClues = [];
  export let currentClue = null;
  export let solvedClues = new Set();

  const dispatch = createEventDispatcher();

  function handleClick(clue) {
    dispatch("clueClick", clue);
  }

  function isSolved(clue) {
    return solvedClues.has(`${clue.number}-${clue.direction}`);
  }
</script>

<div class="clues-section">
  <div class="clue-box">
    <h4>Horizontaliai</h4>
    <ul>
      {#each allClues.filter((c) => c.direction === "across") as clue}
        <li
          class="clue-item"
          class:active={currentClue &&
            currentClue.number === clue.number &&
            currentClue.direction === clue.direction}
          class:solved={isSolved(clue)}
          on:click={() => handleClick(clue)}
          role="button"
          tabindex="0"
          on:keydown={(e) => e.key === "Enter" && handleClick(clue)}
        >
          <span class="clue-num">{String(clue.number).padStart(2, "0")}.</span>
          <span class="clue-text">{clue.clue}</span>
        </li>
      {/each}
    </ul>
  </div>

  <div class="clue-box">
    <h4>Vertikaliai</h4>
    <ul>
      {#each allClues.filter((c) => c.direction === "down") as clue}
        <li
          class="clue-item"
          class:active={currentClue &&
            currentClue.number === clue.number &&
            currentClue.direction === clue.direction}
          class:solved={isSolved(clue)}
          on:click={() => handleClick(clue)}
          role="button"
          tabindex="0"
          on:keydown={(e) => e.key === "Enter" && handleClick(clue)}
        >
          <span class="clue-num">{String(clue.number).padStart(2, "0")}.</span>
          <span class="clue-text">{clue.clue}</span>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .clues-section {
    flex: 0 0 35%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 260px;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    position: sticky;
    top: 16px;
  }

  .clues-section::-webkit-scrollbar {
    width: 6px;
  }

  .clues-section::-webkit-scrollbar-track {
    background: transparent;
  }

  .clues-section::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 3px;
  }

  .clue-box {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .clue-box h4 {
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    line-height: 12px;
    letter-spacing: 0.2px;
    color: var(--text-secondary);
    margin: 0 0 6px;
    padding-bottom: 0;
    border-bottom: none;
  }

  .clue-box ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .clue-item {
    display: flex;
    gap: 8px;
    padding: 9px 10px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .clue-item:hover {
    background: var(--bg-secondary);
  }

  /* Active = selected clue */
  .clue-item.active {
    background: var(--sidebar-active-bg, var(--accent-light, #fcece8));
    border-left: 1px solid var(--sidebar-active, var(--accent, #c25e40));
  }

  .clue-item.active .clue-text {
    color: var(--text-primary);
  }

  .clue-item.active .clue-num {
    color: var(--sidebar-active, var(--accent, #c25e40));
  }

  /* Solved = green highlight + strikethrough */
  .clue-item.solved {
    background: var(--correct-light, #e2f3ea);
    border-left: 1px solid var(--correct, #007a3c);
  }

  .clue-item.solved .clue-text {
    text-decoration: line-through;
    color: var(--text-secondary);
  }

  .clue-item.solved .clue-num {
    color: var(--correct, #007a3c);
  }

  /* Active takes priority over solved */
  .clue-item.active.solved {
    background: var(--sidebar-active-bg, var(--accent-light, #fcece8));
    border-left: 1px solid var(--sidebar-active, var(--accent, #c25e40));
  }

  .clue-item.active.solved .clue-text {
    text-decoration: line-through;
    color: var(--text-primary);
  }

  .clue-item.active.solved .clue-num {
    color: var(--sidebar-active, var(--accent, #c25e40));
  }

  .clue-num {
    font-family: var(--font-serif);
    font-size: 22px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0.3px;
    color: var(--text-secondary);
    min-width: 28px;
    flex-shrink: 0;
  }

  .clue-text {
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-primary);
  }

  @media (max-width: 1024px) {
    .clues-section {
      flex: 1 1 auto;
      width: 100%;
      max-width: 100%;
      position: static;
      max-height: none;
      overflow-y: visible;
      min-width: 0;
    }
  }
</style>
