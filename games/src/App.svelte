<script>
  import CrosswordGame from "./lib/crossword/CrosswordGame.svelte";
  import WordGame from "./lib/WordGame.svelte";
  import SudokuGame from "./lib/SudokuGame.svelte";

  const urlParams = new URLSearchParams(window.location.search);
  let puzzleId = urlParams.get("id") || "";
  let userId = urlParams.get("user") || "";
  let gameType = urlParams.get("type") || "crossword"; // 'crossword' | 'word' | 'sudoku'
  let isPreview = urlParams.get("preview") === "true";
  let theme = urlParams.get("theme") || "light";
  let resultId = urlParams.get("result") || "";
  let lang = urlParams.get("lang") || "lt";

  // API URL: in production = same origin, in dev = env var or localhost
  const apiBase =
    import.meta.env.VITE_API_URL ||
    urlParams.get("api") ||
    (import.meta.env.DEV ? "http://localhost:3000" : window.location.origin);

  // Either a specific puzzle ID or a user ID for "latest" mode
  const hasGame = puzzleId || userId;

  // Fetch published games for landing
  let gamesPromise = !hasGame
    ? fetch(`${apiBase}/api/public/games/list`).then((r) => r.json())
    : Promise.resolve({ data: [] });

  const typeIcons = {
    crossword: "grid_on",
    word: "spellcheck",
    sudoku: "grid_4x4",
  };

  const typeLabels = {
    crossword: "Crossword",
    word: "Word Game",
    sudoku: "Sudoku",
  };
</script>

{#if hasGame}
  <!-- Clean embed mode - just the game -->
  {#if gameType === "word"}
    <WordGame gameId={puzzleId} {theme} apiUrl={apiBase} {lang} {userId} />
  {:else if gameType === "sudoku"}
    <SudokuGame gameId={puzzleId} {theme} apiUrl={apiBase} {userId} />
  {:else}
    <CrosswordGame
      {puzzleId}
      {theme}
      apiUrl={apiBase}
      {resultId}
      {lang}
      {userId}
    />
  {/if}
{:else}
  <!-- Landing page: published games gallery -->
  <div class="landing">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="material-symbols-outlined logo-icon"
            >settings_suggest</span
          >
          <h1 class="logo-text">Brain Games</h1>
        </div>
      </div>
    </header>

    <main class="main">
      <section class="hero">
        <h2 class="hero-title">Published Games</h2>
        <p class="hero-subtitle">Select a game to play</p>
      </section>

      {#await gamesPromise}
        <div class="loading">
          <span class="material-symbols-outlined spinning"
            >progress_activity</span
          >
          Loading games…
        </div>
      {:then result}
        {#if result.data && result.data.length > 0}
          <section class="games-grid">
            {#each result.data as game}
              <a href="?type={game.type}&id={game.id}" class="game-card">
                <div class="card-header">
                  <h3 class="card-title">{game.title}</h3>
                  <div class="card-icon {game.type}">
                    <span class="material-symbols-outlined">
                      {typeIcons[game.type] || "sports_esports"}
                    </span>
                  </div>
                </div>
                <p class="card-description">
                  {typeLabels[game.type] || "Game"}
                </p>
                <div class="card-action">
                  <span class="material-symbols-outlined">play_circle</span>
                  Play
                </div>
              </a>
            {/each}
          </section>
        {:else}
          <div class="empty-state">
            <span class="material-symbols-outlined empty-icon"
              >sports_esports</span
            >
            <p>No published games yet.</p>
          </div>
        {/if}
      {:catch}
        <div class="empty-state">
          <span class="material-symbols-outlined empty-icon">error</span>
          <p>Failed to load games.</p>
        </div>
      {/await}
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="powered-by">
          <span class="material-symbols-outlined">settings_suggest</span>
          <span>Brain Games Platform</span>
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

  .hero-title {
    font-family: var(--font-serif);
    font-size: 2.5rem;
    font-weight: 500;
    color: var(--text-main);
    margin: 0 0 12px;
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    color: var(--text-muted);
    max-width: 500px;
    margin: 0 auto;
  }

  /* Loading */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 48px;
    color: var(--text-muted);
    font-size: 1rem;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 64px 24px;
    color: var(--text-muted);
  }

  .empty-icon {
    font-size: 48px;
    opacity: 0.4;
    display: block;
    margin-bottom: 16px;
  }

  /* Games Grid */
  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
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
    font-size: 1.1rem;
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
    flex-shrink: 0;
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

  .card-description {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin: 0 0 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 500;
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
    margin-top: auto;
  }

  .game-card:hover .card-action {
    color: var(--primary-dark);
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
