<script>
  import { t } from "../i18n.js";
  import { createEventDispatcher } from "svelte";

  export let elapsedTime = 0;
  export let shareUrl = "";

  const dispatch = createEventDispatcher();

  let showModal = false;
  let copied = false;

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function handleShare() {
    dispatch("share");
    showModal = true;
    copied = false;
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch {
      // Fallback: select the input text
      const input = document.querySelector(".share-url-input");
      if (input) {
        input.select();
      }
    }
  }

  function closeModal() {
    showModal = false;
  }
</script>

<div class="celebration">
  <div class="celebration-header">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 256 256"
      class="check-icon"
      ><path
        d="M170.83,101.17a4,4,0,0,1,0,5.66l-56,56a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L112,154.34l53.17-53.17A4,4,0,0,1,170.83,101.17ZM228,128A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z"
      ></path></svg
    >
    <h2>{$t("crossword.congratulations")}</h2>
  </div>

  <p>{$t("crossword.solvedMessage")}</p>

  <div class="celebration-actions">
    <div class="time-badge">
      <span class="time-label">{$t("crossword.yourTime")}</span>
      <span class="time-value">{formatTime(elapsedTime)}</span>
    </div>

    <button class="share-btn" on:click={handleShare}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 256 256"
        ><path
          d="M237.66,117.66l-80,80A8,8,0,0,1,144,192V152.23c-57.1,3.24-96.25,40.27-107.24,52h0a12,12,0,0,1-20.68-9.58c3.71-32.26,21.38-63.29,49.76-87.37,23.57-20,52.22-32.69,78.16-34.91V32a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,237.66,117.66Z"
        ></path></svg
      >
      {$t("crossword.share")}
    </button>
  </div>
</div>

{#if showModal}
  <div class="share-overlay" on:click={closeModal} role="presentation">
    <div
      class="share-modal"
      on:click|stopPropagation
      role="dialog"
      aria-label="Share result"
    >
      <button class="modal-close" on:click={closeModal}>✕</button>
      <h3 class="modal-title">{$t("crossword.shareTitle")}</h3>
      <p class="modal-subtitle">
        {$t("crossword.shareSubtitle")}
      </p>
      <div class="url-row">
        <input
          class="share-url-input"
          type="text"
          readonly
          value={shareUrl}
          on:click={(e) => e.target.select()}
        />
        <button class="copy-btn" on:click={copyUrl}>
          {#if copied}
            {$t("crossword.copied")}
          {:else}
            {$t("crossword.copy")}
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .celebration {
    margin-top: 16px;
    background: var(--correct-light, #e2f3ea);
    border: 1px solid var(--correct, #007a3c);
    border-radius: 8px;
    padding: 32px;
    text-align: center;
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

  .celebration-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .check-icon {
    color: var(--correct, #007a3c);
    flex-shrink: 0;
  }

  .celebration h2 {
    font-family: var(--font-serif);
    font-size: 1.75rem;
    color: var(--correct, #007a3c);
    margin: 0;
  }

  .celebration p {
    font-family: var(--font-sans);
    color: var(--text-primary);
    margin: 0 0 16px;
  }

  .celebration-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .time-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--correct, #007a3c);
    color: #ffffff;
    padding: 10px;
  }

  .time-label {
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    line-height: 12px;
  }

  .time-value {
    font-family: var(--font-sans);
    font-size: 15px;
    font-weight: 400;
    line-height: 17px;
  }

  .share-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 8px 12px;
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--correct, #007a3c);
    border-radius: 8px;
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .share-btn svg {
    color: var(--correct, #007a3c);
  }

  .share-btn:hover {
    background: var(--correct, #007a3c);
    color: #ffffff;
  }

  .share-btn:hover svg {
    color: #ffffff;
  }

  /* Share Modal */
  .share-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .share-modal {
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 12px;
    padding: 24px;
    max-width: 480px;
    width: calc(100% - 32px);
    position: relative;
    animation: slideUp 0.2s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--text-secondary, #64748b);
    padding: 4px 8px;
    line-height: 1;
  }

  .modal-close:hover {
    color: var(--text-primary, #0f172a);
  }

  .modal-title {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary, #0f172a);
    margin: 0 0 4px;
  }

  .modal-subtitle {
    font-family: var(--font-sans);
    font-size: 0.875rem;
    color: var(--text-secondary, #64748b);
    margin: 0 0 16px;
  }

  .url-row {
    display: flex;
    gap: 8px;
  }

  .share-url-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 8px;
    font-family: var(--font-sans);
    font-size: 0.8rem;
    color: var(--text-primary, #0f172a);
    background: var(--bg-secondary, #f3f4f6);
    outline: none;
    min-width: 0;
  }

  .share-url-input:focus {
    border-color: var(--correct, #007a3c);
  }

  .copy-btn {
    padding: 10px 16px;
    background: var(--correct, #007a3c);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-family: var(--font-sans);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s ease;
  }

  .copy-btn:hover {
    background: var(--correct-hover, #005c2d);
  }
</style>
