<script>
  import CrosswordGame from "./lib/CrosswordGame.svelte";
  import WordGame from "./lib/WordGame.svelte";
  import SudokuGame from "./lib/SudokuGame.svelte";

  const urlParams = new URLSearchParams(window.location.search);
  let puzzleId = urlParams.get("id") || "";
  let gameType = urlParams.get("type") || "crossword"; // 'crossword' | 'word' | 'sudoku'
  let isPreview = urlParams.get("preview") === "true";
  let theme = urlParams.get("theme") || "light";

  // API URL: use env var > URL param > fallback
  const apiBase =
    import.meta.env.VITE_API_URL ||
    urlParams.get("api") ||
    (import.meta.env.DEV ? "http://localhost:8055" : window.location.origin);
</script>

{#if puzzleId}
  <!-- Clean embed mode - just the game -->
  {#if gameType === "word"}
    <WordGame gameId={puzzleId} {theme} apiUrl={apiBase} />
  {:else if gameType === "sudoku"}
    <SudokuGame gameId={puzzleId} {theme} apiUrl={apiBase} />
  {:else}
    <CrosswordGame {puzzleId} {theme} apiUrl={apiBase} />
  {/if}
{:else}
  <!-- Landing page when no game loaded -->
  <div class="landing">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="material-symbols-outlined logo-icon"
            >settings_suggest</span
          >
          <h1 class="logo-text">Rustycogs.io</h1>
        </div>
        <div class="header-badge">
          <span class="badge-dot"></span>
          Development Mode
        </div>
      </div>
    </header>

    <main class="main">
      <section class="hero">
        <div class="hero-badge">Brain Games Engine</div>
        <h2 class="hero-title">
          Premium <span class="highlight">Puzzle</span> Games
        </h2>
        <p class="hero-subtitle">
          Embeddable crosswords, word games, and more for digital publishers.
        </p>
      </section>

      <section class="games-grid">
        <a
          href="{apiBase}/admin/content/crosswords"
          target="_blank"
          class="game-card"
        >
          <div class="card-header">
            <h3 class="card-title">Daily Crossword</h3>
            <div class="card-icon crossword">
              <span class="material-symbols-outlined">grid_on</span>
            </div>
          </div>
          <p class="card-description">
            Classic crossword puzzles with auto-layout algorithm and clue
            tracking.
          </p>
          <div class="card-preview crossword-preview">
            <div class="mini-grid">
              {#each Array(9) as _, i}
                <div
                  class="mini-cell"
                  class:black={[1, 3, 5, 7].includes(i)}
                ></div>
              {/each}
            </div>
          </div>
          <div class="card-action">
            <span class="material-symbols-outlined">add_circle</span>
            Create in Directus
          </div>
        </a>

        <a
          href="{apiBase}/admin/content/wordgames"
          target="_blank"
          class="game-card"
        >
          <div class="card-header">
            <h3 class="card-title">Word of the Day</h3>
            <div class="card-icon word">
              <span class="material-symbols-outlined">spellcheck</span>
            </div>
          </div>
          <p class="card-description">
            Wordle-style word guessing with Lithuanian keyboard support.
          </p>
          <div class="card-preview word-preview">
            <div class="mini-tiles">
              <div class="tile correct">P</div>
              <div class="tile present">L</div>
              <div class="tile absent">A</div>
              <div class="tile absent">T</div>
              <div class="tile correct">E</div>
            </div>
          </div>
          <div class="card-action">
            <span class="material-symbols-outlined">add_circle</span>
            Create in Directus
          </div>
        </a>

        <a
          href="{apiBase}/admin/content/sudoku"
          target="_blank"
          class="game-card"
        >
          <div class="card-header">
            <h3 class="card-title">Sudoku</h3>
            <div class="card-icon sudoku">
              <span class="material-symbols-outlined">grid_4x4</span>
            </div>
          </div>
          <p class="card-description">
            Classic number puzzle with conflict detection, notes, and hints.
          </p>
          <div class="card-preview sudoku-preview">
            <div class="mini-sudoku">
              {#each [5, 3, 0, 0, 7, 0, 0, 0, 0] as v}
                <div class="mini-s-cell" class:empty={v === 0}>{v || ""}</div>
              {/each}
            </div>
          </div>
          <div class="card-action">
            <span class="material-symbols-outlined">add_circle</span>
            Create in Directus
          </div>
        </a>
      </section>

      <section class="embed-section">
        <h3 class="section-title">
          <span class="material-symbols-outlined">code</span>
          Quick Start
        </h3>
        <div class="code-block">
          <div class="code-header">
            <span>Embed URL</span>
          </div>
          <pre class="code-content"><code
              ><span class="comment">/* Crossword */</span>
<span class="url">?id=PUZZLE_ID</span>

<span class="comment">/* Word Game */</span>
<span class="url">?type=word&id=GAME_ID</span>

<span class="comment">/* Sudoku */</span>
<span class="url">?type=sudoku&id=PUZZLE_ID</span>

<span class="comment">/* Preview Mode */</span>
<span class="url">?id=ID&preview=true</span></code
            ></pre>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="powered-by">
          <span class="material-symbols-outlined">settings_suggest</span>
          <span>Powered by Rustycogs.io</span>
        </div>
      </div>
    </footer>
  </div>
{/if}

<style>
  /* Landing Page Styles */
  .landing {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
      135deg,
      var(--surface) 0%,
      var(--surface-offset) 100%
    );
  }

  /* Header */
  .header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border-light);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-icon {
    font-size: 28px;
    color: var(--primary);
  }

  .logo-text {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-main);
    margin: 0;
  }

  .header-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
    background: var(--surface-offset);
    padding: 6px 12px;
    border-radius: 20px;
    border: 1px solid var(--border-light);
  }

  .badge-dot {
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
  }

  /* Main */
  .main {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 24px;
    width: 100%;
  }

  /* Hero */
  .hero {
    text-align: center;
    margin-bottom: 48px;
  }

  .hero-badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--primary);
    background: var(--primary-light);
    padding: 6px 16px;
    border-radius: 20px;
    margin-bottom: 16px;
  }

  .hero-title {
    font-family: var(--font-serif);
    font-size: 3rem;
    font-weight: 500;
    color: var(--text-main);
    margin: 0 0 12px;
    line-height: 1.1;
  }

  .hero-title .highlight {
    color: var(--primary);
    font-style: italic;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    color: var(--text-muted);
    max-width: 500px;
    margin: 0 auto;
  }

  /* Games Grid */
  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  }

  .game-card {
    background: white;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-xl);
    padding: 24px;
    text-decoration: none;
    color: inherit;
    box-shadow: var(--shadow-card);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .game-card:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-4px);
    border-color: var(--primary);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .card-title {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-main);
  }

  .card-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-icon.crossword {
    background: #eff6ff;
    color: #3b82f6;
  }

  .card-icon.word {
    background: #f0fdf4;
    color: #22c55e;
  }

  .card-icon.sudoku {
    background: #faf5ff;
    color: #a855f7;
  }

  /* Mini Sudoku Preview */
  .mini-sudoku {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border-light);
    padding: 1px;
    width: 80px;
  }

  .mini-s-cell {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .mini-s-cell.empty {
    background: var(--surface-offset);
  }

  .card-description {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0 0 16px;
    line-height: 1.5;
  }

  .card-preview {
    background: var(--surface-offset);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    flex: 1;
  }

  /* Mini Crossword Preview */
  .mini-grid {
    display: grid;
    grid-template-columns: repeat(3, 24px);
    gap: 2px;
    background: #1a1a1a;
    padding: 2px;
  }

  .mini-cell {
    width: 24px;
    height: 24px;
    background: white;
  }

  .mini-cell.black {
    background: #1a1a1a;
  }

  /* Mini Word Preview */
  .mini-tiles {
    display: flex;
    gap: 4px;
  }

  .tile {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-serif);
    font-weight: 600;
    font-size: 1rem;
    color: white;
    border-radius: 4px;
  }

  .tile.correct {
    background: var(--primary);
  }

  .tile.present {
    background: var(--gold-muted);
  }

  .tile.absent {
    background: #94a3b8;
  }

  .card-action {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--primary);
    padding-top: 16px;
    border-top: 1px solid var(--border-light);
  }

  .game-card:hover .card-action {
    color: var(--primary-dark);
  }

  /* Embed Section */
  .embed-section {
    margin-bottom: 48px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 16px;
  }

  .section-title .material-symbols-outlined {
    color: var(--primary);
  }

  .code-block {
    background: #1e293b;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-grid);
  }

  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #0f172a;
    border-bottom: 1px solid #334155;
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .code-content {
    padding: 16px 20px;
    margin: 0;
    font-family: "Monaco", "Consolas", monospace;
    font-size: 0.875rem;
    line-height: 1.8;
    color: #e2e8f0;
    overflow-x: auto;
  }

  .code-content .comment {
    color: #64748b;
  }

  .code-content .url {
    color: #4ade80;
  }

  /* Footer */
  .footer {
    border-top: 1px solid var(--border-light);
    background: var(--surface-offset);
    padding: 24px;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  .powered-by {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    color: var(--text-muted);
  }

  .powered-by .material-symbols-outlined {
    color: var(--primary);
    font-size: 18px;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .hero-title {
      font-size: 2rem;
    }

    .games-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
