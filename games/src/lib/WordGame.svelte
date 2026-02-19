<script>
  import { onMount } from "svelte";
  import { applyBrandingFromData } from "./clientThemes.js";
  import { locale, t } from "./i18n.js";

  // Props
  export let gameId = "";
  export let apiUrl = "";
  export let theme = "light";
  export let token = "";
  export let client = "";
  export let lang = "lt";

  $: locale.set(lang);

  /** Translation with positional params: tp('key', val1, val2) replaces {0}, {1}… */
  function tp(key, ...args) {
    let s = $t(key);
    args.forEach((v, i) => (s = s.replace(`{${i}}`, v)));
    return s;
  }

  let containerEl;

  // State
  let game = null;
  let loading = true;
  let error = null;
  let guesses = [];
  let currentGuess = "";
  let gameState = "playing"; // 'playing' | 'won' | 'lost'
  let isPreviewMode = false;
  let feedback = null;

  // Derived
  $: wordLength = game?.word?.length || 5;
  $: maxAttempts = game?.max_attempts || 10;
  $: targetWord = game?.word?.toUpperCase() || "";
  $: themeClass = theme === "dark" ? "dark-theme" : "light-theme";

  // Track used letters and their states
  let letterStates = {}; // { 'A': 'correct' | 'present' | 'absent' }

  onMount(() => {
    // Check if in preview mode
    const urlParams = new URLSearchParams(window.location.search);
    isPreviewMode = urlParams.get("preview") === "true";

    if (gameId) {
      fetchGame();
    }

    // Listen for keyboard input
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  async function fetchGame() {
    try {
      loading = true;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(
        `${apiUrl}/api/public/games?type=wordgames&id=${gameId}`,
        {
          headers,
        },
      );
      if (!response.ok) throw new Error("Failed to fetch game");
      const data = await response.json();
      game = data.data;

      // Apply branding if assigned
      if (game.branding && containerEl) {
        applyBrandingFromData(containerEl, game.branding);
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleKeydown(event) {
    if (gameState !== "playing") return;

    const key = event.key.toUpperCase();

    if (key === "ENTER") {
      submitGuess();
    } else if (key === "BACKSPACE") {
      currentGuess = currentGuess.slice(0, -1);
    } else if (
      /^[A-ZĄČĘĖĮŠŲŪŽ]$/.test(key) &&
      currentGuess.length < wordLength
    ) {
      currentGuess += key;
    }
  }

  function submitGuess() {
    if (currentGuess.length !== wordLength) {
      showFeedback(tp("wordgame.enterLetters", wordLength), "error");
      return;
    }

    const guess = currentGuess.toUpperCase();
    const result = evaluateGuess(guess);

    guesses = [...guesses, { word: guess, result }];

    // Update letter states for keyboard coloring
    guess.split("").forEach((letter, i) => {
      const state = result[i];
      // Only upgrade states: absent -> present -> correct
      if (state === "correct") {
        letterStates[letter] = "correct";
      } else if (state === "present" && letterStates[letter] !== "correct") {
        letterStates[letter] = "present";
      } else if (!letterStates[letter]) {
        letterStates[letter] = "absent";
      }
    });
    letterStates = letterStates; // Trigger reactivity

    currentGuess = "";

    // Check win/lose
    if (guess === targetWord) {
      gameState = "won";
      showFeedback($t("wordgame.guessedCorrectly"), "success");
    } else if (guesses.length >= maxAttempts) {
      gameState = "lost";
      showFeedback($t("wordgame.wordWas") + targetWord, "error");
    }
  }

  function evaluateGuess(guess) {
    const result = Array(wordLength).fill("absent");
    const targetLetters = targetWord.split("");
    const guessLetters = guess.split("");

    // First pass: mark correct positions
    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        result[i] = "correct";
        targetLetters[i] = null; // Mark as used
      }
    });

    // Second pass: mark present letters
    guessLetters.forEach((letter, i) => {
      if (result[i] === "correct") return;

      const targetIndex = targetLetters.indexOf(letter);
      if (targetIndex !== -1) {
        result[i] = "present";
        targetLetters[targetIndex] = null; // Mark as used
      }
    });

    return result;
  }

  function showFeedback(message, type) {
    feedback = { message, type };
    setTimeout(() => (feedback = null), 3000);
  }

  function resetGame() {
    guesses = [];
    currentGuess = "";
    gameState = "playing";
    letterStates = {};
    feedback = null;
  }
</script>

<div class="word-game {themeClass}" bind:this={containerEl}>
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>{$t("wordgame.loading")}</p>
    </div>
  {:else if error}
    <div class="error">
      <p>⚠️ {error}</p>
    </div>
  {:else if game}
    <div class="game-container">
      <!-- Header -->
      <header class="game-header">
        <h1 class="game-title">{game.title || "Word Game"}</h1>
        {#if isPreviewMode}
          <span class="preview-badge">{$t("wordgame.preview")}</span>
        {/if}
      </header>

      {#if game.definition}
        <div class="hint">
          <span class="material-symbols-outlined hint-icon">lightbulb</span>
          <p class="hint-text">{game.definition}</p>
        </div>
      {/if}

      <!-- Grid -->
      <div class="guess-grid" style="--word-length: {wordLength}">
        {#each Array(maxAttempts) as _, rowIndex}
          <div class="guess-row">
            {#each Array(wordLength) as _, colIndex}
              {@const guess = guesses[rowIndex]}
              {@const letter = guess
                ? guess.word[colIndex]
                : rowIndex === guesses.length
                  ? currentGuess[colIndex]
                  : ""}
              {@const state = guess ? guess.result[colIndex] : ""}
              <div
                class="letter-cell"
                class:filled={letter}
                class:correct={state === "correct"}
                class:present={state === "present"}
                class:absent={state === "absent"}
                class:current={rowIndex === guesses.length &&
                  colIndex < currentGuess.length}
              >
                {letter || ""}
              </div>
            {/each}
          </div>
        {/each}
      </div>

      <!-- Feedback -->
      {#if feedback}
        <div class="feedback {feedback.type}">
          {feedback.message}
        </div>
      {/if}

      <!-- Game Over Actions -->
      {#if gameState !== "playing"}
        <div class="game-actions">
          <button class="reset-button" on:click={resetGame}>
            {$t("wordgame.playAgain")}
          </button>
        </div>
      {/if}

      <!-- How to Play Section -->
      <div class="how-to-play">
        <h2>
          <span class="material-symbols-outlined">info</span>
          {$t("wordgame.howToPlayTitle")}
        </h2>
        <ul>
          <li>{@html tp("wordgame.guessWord", maxAttempts)}</li>
          <li>
            {@html tp("wordgame.eachGuessMustBe", wordLength)}
          </li>
          <li>{$t("wordgame.colorsShowHint")}</li>
        </ul>
        <div class="legend">
          <div class="legend-item">
            <div class="legend-cell correct">A</div>
            <span>{$t("wordgame.correctLegend")}</span>
          </div>
          <div class="legend-item">
            <div class="legend-cell present">B</div>
            <span>{$t("wordgame.wrongPlaceLegend")}</span>
          </div>
          <div class="legend-item">
            <div class="legend-cell absent">C</div>
            <span>{$t("wordgame.notInWordLegend")}</span>
          </div>
        </div>
        <div class="keyboard-hints">
          <div class="hint-item">
            <kbd>A-Z</kbd>
            <span>{$t("wordgame.typeLetters")}</span>
          </div>
          <div class="hint-item">
            <kbd>Enter</kbd>
            <span>{@html $t("wordgame.pressEnter")}</span>
          </div>
          <div class="hint-item">
            <kbd>⌫</kbd>
            <span>{@html $t("wordgame.pressBackspace")}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Powered By -->
    <div class="powered-by">
      <span class="powered-label">Powered by</span>
      <a href="https://rustycogs.io" class="powered-link" target="_blank">
        <span class="material-symbols-outlined">settings_suggest</span>
        <span class="powered-text">rustycogs.io</span>
      </a>
    </div>
  {:else}
    <div class="no-game">
      <p>{@html $t("wordgame.gameNotFound")}</p>
    </div>
  {/if}
</div>

<style>
  /* CSS Variables - Rustycogs Theme */
  .word-game {
    --bg-primary: #ffffff;
    --bg-secondary: #f9fafb;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
    --correct: #c25e40;
    --present: #dcb162;
    --absent: #94a3b8;

    font-family:
      var(--font-sans, "Inter"),
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    position: relative;
  }

  .word-game.dark-theme {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --border-color: #334155;
  }

  /* Loading & Error */
  .loading,
  .error,
  .no-game {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border-color);
    border-top-color: var(--correct);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 12px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Game Container */
  .game-container {
    width: 100%;
    max-width: 400px;
    padding: 0 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Header */
  .game-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px 0;
    border-bottom: 1px solid var(--border-color);
  }

  .game-title {
    font-family: var(--font-serif, "Playfair Display"), serif;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1;
  }

  .preview-badge {
    background: var(--correct);
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Hint */
  .hint {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 16px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    border-left: 3px solid var(--correct);
  }

  .hint-icon {
    color: var(--correct);
    font-size: 20px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .hint-text {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.5;
    font-style: italic;
  }

  /* Grid */
  .guess-grid {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
  }

  .guess-row {
    display: grid;
    grid-template-columns: repeat(var(--word-length), 1fr);
    gap: 6px;
  }

  .letter-cell {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-serif, "Playfair Display"), serif;
    font-size: 1.75rem;
    font-weight: 600;
    text-transform: uppercase;
    border: 2px solid var(--border-color);
    background: var(--bg-primary);
    transition: all 0.15s ease;
  }

  .letter-cell.filled {
    border-color: var(--text-secondary);
  }

  .letter-cell.current {
    border-color: var(--text-secondary);
    animation: subtle-pulse 2s infinite;
  }

  .letter-cell.correct {
    background: var(--correct);
    border-color: var(--correct);
    color: white;
    box-shadow: 0 2px 4px rgba(194, 94, 64, 0.3);
  }

  .letter-cell.present {
    background: var(--present);
    border-color: var(--present);
    color: white;
    box-shadow: 0 2px 4px rgba(220, 177, 98, 0.3);
  }

  .letter-cell.absent {
    background: var(--absent);
    border-color: var(--absent);
    color: white;
  }

  @keyframes subtle-pulse {
    0%,
    100% {
      border-color: #cbd5e1;
    }
    50% {
      border-color: #94a3b8;
    }
  }

  /* Feedback */
  .feedback {
    text-align: center;
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .feedback.success {
    background: rgba(194, 94, 64, 0.1);
    color: var(--correct);
  }

  .feedback.error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  /* How to Play */
  .how-to-play {
    border-top: 1px solid var(--border-color);
    padding-top: 20px;
    margin-top: 8px;
  }

  .how-to-play h2 {
    font-family: var(--font-serif, "Playfair Display"), serif;
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0 0 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-primary);
  }

  .how-to-play h2 .material-symbols-outlined {
    color: var(--correct);
    font-size: 20px;
  }

  .how-to-play ul {
    list-style: none;
    padding: 0;
    margin: 0 0 16px;
  }

  .how-to-play li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 8px;
  }

  .how-to-play li::before {
    content: "•";
    color: var(--text-primary);
  }

  .legend {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .legend-cell {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: white;
    border-radius: 4px;
  }

  .legend-cell.correct {
    background: var(--correct);
  }

  .legend-cell.present {
    background: var(--present);
  }

  .legend-cell.absent {
    background: var(--absent);
  }

  .legend-item span {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  /* Keyboard Hints */
  .keyboard-hints {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--border-color);
  }

  .hint-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.825rem;
    color: var(--text-secondary);
  }

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 28px;
    padding: 0 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-primary);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    flex-shrink: 0;
  }

  /* Game Actions */
  .game-actions {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }

  .reset-button {
    padding: 12px 24px;
    background: var(--correct);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .reset-button:hover {
    filter: brightness(0.85);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  /* Powered By */
  .powered-by {
    position: fixed;
    bottom: 8px;
    right: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    opacity: 0.6;
    transition: opacity 0.2s ease;
  }

  .powered-by:hover {
    opacity: 1;
  }

  .powered-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    font-weight: 600;
  }

  .powered-link {
    display: flex;
    align-items: center;
    gap: 4px;
    text-decoration: none;
    color: var(--text-primary);
  }

  .powered-link .material-symbols-outlined {
    font-size: 16px;
    color: var(--correct);
    transition: transform 0.7s ease;
  }

  .powered-link:hover .material-symbols-outlined {
    transform: rotate(180deg);
  }

  .powered-text {
    font-family: var(--font-serif, "Playfair Display"), serif;
    font-size: 0.8rem;
    font-weight: 700;
  }

  code {
    background: var(--bg-secondary);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.85em;
  }
</style>
