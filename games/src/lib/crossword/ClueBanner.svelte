<script>
  import { createEventDispatcher } from "svelte";
  import { t } from "../i18n.js";

  export let currentClue = null;

  const dispatch = createEventDispatcher();

  function navigate(offset) {
    dispatch("navigate", offset);
  }
</script>

<div class="clue-banner">
  <button
    class="banner-arrow"
    on:click={() => navigate(-1)}
    title={$t("crossword.prevClue")}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 256 256"
      ><path
        d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"
      ></path></svg
    >
  </button>
  <div class="clue-banner-content">
    {#if currentClue}
      <span class="clue-banner-direction">
        {currentClue.arrow}
        {currentClue.direction === "across"
          ? $t("crossword.across")
          : $t("crossword.down")}
      </span>
      <span class="clue-banner-text">{currentClue.clue}</span>
    {:else}
      <span class="clue-banner-text">{$t("crossword.selectCell")}</span>
    {/if}
  </div>
  <button
    class="banner-arrow"
    on:click={() => navigate(1)}
    title={$t("crossword.nextClue")}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 256 256"
      ><path
        d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
      ></path></svg
    >
  </button>
</div>

<style>
  .clue-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--cell-highlighted, #e8ebfa);
    border: 1px solid var(--border-color);
    border-radius: 12px 12px 0 0;
    padding: 8px 16px;
    min-height: 52px;
  }

  .banner-arrow {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.4rem;
    color: var(--text-primary);
    transition: all 0.15s ease;
    flex-shrink: 0;
    line-height: 1;
    font-weight: 400;
    font-size: 0;
    padding: 4px;
  }

  .banner-arrow:hover {
    background: rgba(0, 0, 0, 0.05);
    color: var(--text-primary);
  }

  .clue-banner-content {
    flex: 1;
    text-align: center;
    min-width: 0;
  }

  .clue-banner-direction {
    display: block;
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-bottom: 2px;
  }

  .clue-banner-text {
    display: block;
    font-size: 0.95rem;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
