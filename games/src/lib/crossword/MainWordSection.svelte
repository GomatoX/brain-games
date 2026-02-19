<script>
  import { t } from "../i18n.js";

  export let mainWordProgress = [];
  export let mainWordData = null;
  export let elapsedTime = 0;
  export let mainWord = "";

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }
</script>

{#if mainWord && mainWordProgress.length > 0}
  <div class="main-word-section">
    <h3 class="main-word-title">{$t("crossword.mainWordTitle")}</h3>
    <div class="main-word-slots">
      {#each mainWordProgress as slot, i}
        <div
          class="main-word-slot"
          class:filled={slot.filled}
          class:wrong={slot.typedLetter && !slot.filled}
          class:empty={!slot.typedLetter}
        >
          {#if slot.filled}
            <span class="slot-letter filled">{slot.expectedLetter}</span>
          {:else if slot.typedLetter}
            <span class="slot-letter wrong">{slot.typedLetter}</span>
          {/if}
        </div>
      {/each}
    </div>
    <div class="timer-badge">
      <span class="timer-label">{$t("crossword.yourTime")}</span>
      <span class="timer-value">{formatTime(elapsedTime)}</span>
    </div>
  </div>
{/if}

<style>
  .main-word-section {
    background: var(--bg-secondary);
    border-radius: 8px;
    padding: 32px 0;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .main-word-title {
    font-family: var(--font-serif);
    font-size: 28px;
    font-weight: 400;
    line-height: 36px;
    color: var(--text-primary);
    margin: 0;
  }

  .main-word-slots {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .main-word-slot {
    width: 40px;
    height: 40px;
    border-bottom: 2px solid var(--text-primary, #02030d);
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    transition: all 0.3s ease;
  }

  .main-word-slot.filled {
    border-color: var(--correct, #007a3c);
    background: var(--correct-light, #e2f3ea);
  }

  .main-word-slot.wrong {
    border-color: #ee000e;
    background: #ffe3e4;
  }

  .slot-letter {
    font-family: var(--font-sans);
    font-size: 24px;
    font-weight: 600;
    line-height: 20px;
    text-align: center;
  }

  .slot-letter.filled {
    color: var(--correct, #007a3c);
  }

  .slot-letter.wrong {
    color: #ee000e;
  }

  .timer-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--border-color);
    padding: 10px;
  }

  .timer-label {
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    line-height: 12px;
    color: var(--text-secondary);
  }

  .timer-value {
    font-family: var(--font-sans);
    font-size: 15px;
    font-weight: 400;
    line-height: 17px;
    color: var(--text-primary, #02030d);
  }

  @media (max-width: 1024px) {
    .main-word-section {
      padding: 24px 16px;
    }

    .main-word-title {
      font-size: 20px;
      line-height: 28px;
    }
  }
</style>
