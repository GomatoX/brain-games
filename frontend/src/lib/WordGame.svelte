<script>
  import { onMount } from "svelte";

  // Props
  export let gameId = "";
  export let apiUrl = "";
  export let theme = "light";
  export let showKeyboard = true;
  export let token = "";

  // State
  let game = null;
  let loading = true;
  let error = null;
  let guesses = [];
  let currentGuess = "";
  let gameState = "playing"; // 'playing' | 'won' | 'lost'
  let isPreviewMode = false;
  let feedback = null;
  let showRules = false;

  // Derived
  $: wordLength = game?.word?.length || 5;
  $: maxAttempts = game?.max_attempts || 10;
  $: targetWord = game?.word?.toUpperCase() || "";
  $: themeClass = theme === "dark" ? "dark-theme" : "light-theme";

  // Lithuanian keyboard layout
  const keyboardRows = [
    ["Ą", "Č", "Ę", "Ė", "Į", "Š", "Ų", "Ū", "Ž"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];

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
      const response = await fetch(`${apiUrl}/items/wordgames/${gameId}`, {
        headers,
      });
      if (!response.ok) throw new Error("Failed to fetch game");
      const data = await response.json();
      game = data.data;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleKeydown(event) {
    if (showRules) {
      if (event.key === "Escape") showRules = false;
      return;
    }
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

  function handleKeyClick(key) {
    if (gameState !== "playing") return;

    if (key === "ENTER") {
      submitGuess();
    } else if (key === "⌫") {
      currentGuess = currentGuess.slice(0, -1);
    } else if (currentGuess.length < wordLength) {
      currentGuess += key;
    }
  }

  function submitGuess() {
    if (currentGuess.length !== wordLength) {
      showFeedback("Įveskite " + wordLength + " raides", "error");
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
      showFeedback("🎉 Puiku! Atspėjote!", "success");
    } else if (guesses.length >= maxAttempts) {
      gameState = "lost";
      showFeedback("Žodis buvo: " + targetWord, "error");
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

  function getKeyState(key) {
    return letterStates[key] || "";
  }
</script>

<div class="word-game {themeClass}">
  {#if loading}
    <div class="loading">
      <p>Kraunama...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>⚠️ {error}</p>
    </div>
  {:else if game}
    <div class="game-container">
      <!-- Header -->
      <header class="game-header">
        <button class="icon-button" title="Meniu">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <div class="header-center">
          <h1 class="game-title">{game.title || "Word of the Day"}</h1>
          <span class="edition-label">Professional Edition</span>
          {#if isPreviewMode}
            <span class="preview-badge">Peržiūra</span>
          {/if}
        </div>
        <div class="header-actions">
          <button
            class="icon-button"
            on:click={() => (showRules = true)}
            title="Kaip žaisti"
          >
            <span class="material-symbols-outlined">help</span>
          </button>
          <button class="icon-button" title="Rezultatai">
            <span class="material-symbols-outlined">leaderboard</span>
          </button>
          <button class="icon-button" title="Nustatymai">
            <span class="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

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

      <!-- Keyboard -->
      {#if showKeyboard}
        <div class="keyboard">
          {#each keyboardRows as row}
            <div class="keyboard-row">
              {#each row as key}
                <button
                  class="key"
                  class:wide={key === "ENTER" || key === "⌫"}
                  class:correct={getKeyState(key) === "correct"}
                  class:present={getKeyState(key) === "present"}
                  class:absent={getKeyState(key) === "absent"}
                  on:click={() => handleKeyClick(key)}
                >
                  {key}
                </button>
              {/each}
            </div>
          {/each}
        </div>
      {/if}

      <!-- Game Over Actions -->
      {#if gameState !== "playing"}
        <div class="game-actions">
          <button class="reset-button" on:click={resetGame}>
            Žaisti iš naujo
          </button>
        </div>
      {/if}

      <!-- How to Play Section -->
      <div class="how-to-play">
        <h2>
          <span class="material-symbols-outlined">info</span>
          Kaip žaisti
        </h2>
        <ul>
          <li>Atspėkite žodį per <strong>{maxAttempts} bandymų</strong>.</li>
          <li>
            Kiekvienas spėjimas turi būti <strong>{wordLength} raidžių</strong> žodis.
          </li>
          <li>Spalvos parodo, kaip arti buvo spėjimas.</li>
        </ul>
        <div class="legend">
          <div class="legend-item">
            <div class="legend-cell correct">A</div>
            <span>Teisinga</span>
          </div>
          <div class="legend-item">
            <div class="legend-cell present">B</div>
            <span>Ne ten</span>
          </div>
          <div class="legend-item">
            <div class="legend-cell absent">C</div>
            <span>Nėra</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Rules Modal -->
    {#if showRules}
      <div
        class="modal-overlay"
        on:click={() => (showRules = false)}
        on:keydown={(e) => e.key === "Escape" && (showRules = false)}
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-content" on:click|stopPropagation role="document">
          <button class="modal-close" on:click={() => (showRules = false)}
            >×</button
          >
          <h3>Kaip žaisti</h3>
          <p>Atspėkite žodį per <strong>{maxAttempts}</strong> bandymų.</p>

          <div class="rules-list">
            <p>
              • Įveskite <strong>{wordLength}</strong> raidžių žodį ir spauskite
              ENTER
            </p>
            <p>• Po kiekvieno spėjimo langelių spalvos pasikeis:</p>
          </div>

          <div class="examples">
            <div class="example">
              <div class="example-cell correct">A</div>
              <span>Raidė yra žodyje ir teisingoje vietoje</span>
            </div>
            <div class="example">
              <div class="example-cell present">B</div>
              <span>Raidė yra žodyje, bet neteisingoje vietoje</span>
            </div>
            <div class="example">
              <div class="example-cell absent">C</div>
              <span>Raidės nėra žodyje</span>
            </div>
          </div>

          <button class="start-button" on:click={() => (showRules = false)}>
            Pradėti
          </button>
        </div>
      </div>
    {/if}

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
      <p>Žaidimas nerastas. Nustatykite <code>game-id</code> atributą.</p>
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
    --key-bg: #e2e8f0;

    font-family:
      "Inter",
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
    --key-bg: #334155;
  }

  /* Loading & Error */
  .loading,
  .error,
  .no-game {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
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
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
  }

  .header-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .game-title {
    font-family: "Playfair Display", serif;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1;
  }

  .edition-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--text-secondary);
    font-weight: 500;
    margin-top: 2px;
  }

  .header-actions {
    display: flex;
    gap: 2px;
  }

  .icon-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .icon-button:hover {
    background: var(--bg-secondary);
    color: var(--correct);
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

  /* Grid */
  .guess-grid {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    aspect-ratio: calc(var(--word-length) / 6);
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
    font-family: "Playfair Display", serif;
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

  @keyframes pop {
    50% {
      transform: scale(1.1);
    }
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

  /* Keyboard */
  .keyboard {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 500px;
    margin: 8px auto 0;
  }

  .keyboard-row {
    display: flex;
    justify-content: center;
    gap: 4px;
  }

  .key {
    min-width: 32px;
    height: 50px;
    padding: 0 10px;
    border: none;
    border-radius: 4px;
    background: var(--key-bg);
    color: var(--text-primary);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.1s ease;
  }

  .key:hover {
    filter: brightness(0.92);
  }

  .key:active {
    transform: scale(0.95);
  }

  .key.wide {
    min-width: 56px;
    font-size: 0.7rem;
    letter-spacing: 0.02em;
  }

  .key.correct {
    background: var(--correct);
    color: white;
  }

  .key.present {
    background: var(--present);
    color: white;
  }

  .key.absent {
    background: var(--absent);
    color: white;
  }

  /* How to Play */
  .how-to-play {
    border-top: 1px solid var(--border-color);
    padding-top: 20px;
    margin-top: 8px;
  }

  .how-to-play h2 {
    font-family: "Playfair Display", serif;
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
    background: #a0492d;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(194, 94, 64, 0.3);
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background: var(--bg-primary);
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    width: 100%;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: color 0.2s;
  }

  .modal-close:hover {
    color: var(--text-primary);
  }

  .modal-content h3 {
    font-family: "Playfair Display", serif;
    margin: 0 0 16px;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .modal-content p {
    margin: 0 0 12px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .rules-list {
    margin-bottom: 16px;
  }

  .rules-list p {
    margin: 8px 0;
    font-size: 0.9rem;
  }

  .examples {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .example {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .example-cell {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Playfair Display", serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .example-cell.correct {
    background: var(--correct);
  }

  .example-cell.present {
    background: var(--present);
  }

  .example-cell.absent {
    background: var(--absent);
  }

  .example span {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .start-button {
    width: 100%;
    padding: 14px;
    background: var(--correct);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .start-button:hover {
    background: #a0492d;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(194, 94, 64, 0.3);
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
    font-family: "Playfair Display", serif;
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
