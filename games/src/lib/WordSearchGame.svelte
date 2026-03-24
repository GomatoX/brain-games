<script>
  import "../app.css"
  import { locale, t } from "./i18n.js"
  import CelebrationOverlay from "./crossword/CelebrationOverlay.svelte"

  export let puzzleId = ""
  export let userId = ""
  export let theme = "light"
  export let apiUrl = ""
  export let token = ""
  export let client = ""
  export let lang = "lt"

  $: locale.set(lang)

  let grid = []
  let gridSize = 0
  let words = []
  let title = ""
  let difficulty = ""
  let loading = true
  let error = ""
  let branding = null

  // Game state
  let foundWords = new Set()
  let selecting = false
  let selectionStart = null
  let selectionEnd = null
  let selectionCells = []
  let foundHighlights = [] // Array of { cells, colorIndex }
  let timer = 0
  let timerInterval = null
  let gameComplete = false
  let shareUrl = ""

  // Touch support
  let touchStartCell = null

  const HIGHLIGHT_COLORS = [
    "rgba(194, 94, 64, 0.3)",   // rust
    "rgba(59, 130, 246, 0.3)",  // blue
    "rgba(34, 197, 94, 0.3)",   // green
    "rgba(168, 85, 247, 0.3)",  // purple
    "rgba(234, 179, 8, 0.3)",   // yellow
    "rgba(236, 72, 153, 0.3)",  // pink
    "rgba(20, 184, 166, 0.3)",  // teal
    "rgba(249, 115, 22, 0.3)",  // orange
  ]

  $: cellSize = gridSize <= 10 ? 40 : gridSize <= 14 ? 34 : 28
  $: fontSize = gridSize <= 10 ? "1rem" : gridSize <= 14 ? "0.875rem" : "0.75rem"
  $: totalWords = words.length
  $: foundCount = foundWords.size
  $: progress = totalWords > 0 ? Math.round((foundCount / totalWords) * 100) : 0

  // Reactive highlight map — rebuilds whenever foundHighlights changes
  $: cellHighlightMap = (() => {
    const map = {}
    for (const highlight of foundHighlights) {
      for (const c of highlight.cells) {
        map[`${c.row},${c.col}`] = HIGHLIGHT_COLORS[highlight.colorIndex]
      }
    }
    return map
  })()

  // Reactive selection set — rebuilds whenever selectionCells changes
  $: cellSelectionSet = new Set(selectionCells.map((c) => `${c.row},${c.col}`))

  async function fetchGame() {
    loading = true
    error = ""
    try {
      const base = apiUrl || window.location.origin
      const url = `${base}/api/public/games?type=wordsearches&id=${puzzleId}`
      const headers = {}
      if (token) headers["Authorization"] = `Bearer ${token}`

      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error("Failed to load game")

      const json = await res.json()
      const data = json.data || json

      grid = data.grid || []
      gridSize = data.grid_size || grid.length
      title = data.title || ""
      difficulty = data.difficulty || ""
      branding = data.branding || null

      // Words come without placement positions (anti-cheat)
      words = (data.words || []).map((w) => ({
        word: w.word?.toUpperCase() || "",
        hint: w.hint || "",
      }))

      applyBranding()
      startTimer()
    } catch (err) {
      error = err.message || "Failed to load game"
    } finally {
      loading = false
    }
  }

  function applyBranding() {
    if (!branding) return
    const el = document.querySelector("word-search-game") || document.body
    if (branding.accent_color) el.style.setProperty("--primary", branding.accent_color)
    if (branding.bg_primary_color) el.style.setProperty("--surface", branding.bg_primary_color)
    if (branding.text_primary_color) el.style.setProperty("--text-main", branding.text_primary_color)
    if (branding.border_color) el.style.setProperty("--border-light", branding.border_color)
    if (branding.font_sans) el.style.setProperty("--font-sans", branding.font_sans)
    if (branding.font_serif) el.style.setProperty("--font-serif", branding.font_serif)
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval)
    timer = 0
    timerInterval = setInterval(() => {
      if (!gameComplete) timer++
    }, 1000)
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, "0")}`
  }

  // ─── Selection Logic ──────────────────────────────────

  function getCellFromEvent(e) {
    const target = e.target.closest("[data-row][data-col]")
    if (!target) return null
    return {
      row: parseInt(target.dataset.row),
      col: parseInt(target.dataset.col),
    }
  }

  function computeSelectionCells(start, end) {
    if (!start || !end) return []

    const dr = Math.sign(end.row - start.row)
    const dc = Math.sign(end.col - start.col)
    const rowDist = Math.abs(end.row - start.row)
    const colDist = Math.abs(end.col - start.col)

    // Must be in a straight line (horizontal, vertical, or diagonal)
    if (rowDist !== colDist && rowDist !== 0 && colDist !== 0) return []

    const steps = Math.max(rowDist, colDist)
    const cells = []
    for (let i = 0; i <= steps; i++) {
      cells.push({ row: start.row + dr * i, col: start.col + dc * i })
    }
    return cells
  }

  function getSelectedWord(cells) {
    return cells.map((c) => grid[c.row]?.[c.col] || "").join("")
  }

  function handlePointerDown(e) {
    const cell = getCellFromEvent(e)
    if (!cell || gameComplete) return
    selecting = true
    selectionStart = cell
    selectionEnd = cell
    selectionCells = [cell]
  }

  function handlePointerMove(e) {
    if (!selecting || gameComplete) return
    const cell = getCellFromEvent(e)
    if (!cell) return
    selectionEnd = cell
    selectionCells = computeSelectionCells(selectionStart, selectionEnd)
  }

  function handlePointerUp() {
    if (!selecting || gameComplete) return
    selecting = false

    if (selectionCells.length > 1) {
      const selectedWord = getSelectedWord(selectionCells)
      const reversedWord = selectedWord.split("").reverse().join("")

      // Check if selected word matches any unfound word
      const match = words.find(
        (w) =>
          !foundWords.has(w.word) &&
          (w.word === selectedWord || w.word === reversedWord),
      )

      if (match) {
        foundWords = new Set([...foundWords, match.word])
        foundHighlights = [
          ...foundHighlights,
          {
            cells: [...selectionCells],
            colorIndex: foundHighlights.length % HIGHLIGHT_COLORS.length,
          },
        ]

        // Check completion
        if (foundWords.size === words.length) {
          gameComplete = true
          if (timerInterval) clearInterval(timerInterval)
        }
      }
    }

    selectionCells = []
    selectionStart = null
    selectionEnd = null
  }

  // Touch event handlers
  function handleTouchStart(e) {
    e.preventDefault()
    const touch = e.touches[0]
    const el = document.elementFromPoint(touch.clientX, touch.clientY)
    if (!el) return
    const target = el.closest("[data-row][data-col]")
    if (!target || gameComplete) return
    selecting = true
    selectionStart = {
      row: parseInt(target.dataset.row),
      col: parseInt(target.dataset.col),
    }
    selectionEnd = selectionStart
    selectionCells = [selectionStart]
  }

  function handleTouchMove(e) {
    e.preventDefault()
    if (!selecting || gameComplete) return
    const touch = e.touches[0]
    const el = document.elementFromPoint(touch.clientX, touch.clientY)
    if (!el) return
    const target = el.closest("[data-row][data-col]")
    if (!target) return
    selectionEnd = {
      row: parseInt(target.dataset.row),
      col: parseInt(target.dataset.col),
    }
    selectionCells = computeSelectionCells(selectionStart, selectionEnd)
  }

  function handleTouchEnd(e) {
    e.preventDefault()
    handlePointerUp()
  }



  function handleRestart() {
    foundWords = new Set()
    foundHighlights = []
    selectionCells = []
    selectionStart = null
    selectionEnd = null
    gameComplete = false
    selecting = false
    shareUrl = ""
    startTimer()
  }

  function generateShareUrl() {
    const mins = String(Math.floor(timer / 60)).padStart(2, "0")
    const secs = String(timer % 60).padStart(2, "0")
    const timeStr = `${mins}:${secs}`

    const redirectUrl = new URL(window.location.href)
    redirectUrl.searchParams.delete("result")

    const payload = {
      t: timer,
      r: redirectUrl.toString(),
      title: `${title} — Word Search`,
      desc: `Solved in ${timeStr}! Can you beat my time?`,
    }

    const shareData = btoa(encodeURIComponent(JSON.stringify(payload)))
    const base = apiUrl || window.location.origin
    const sharePageUrl = new URL("/share", base)
    sharePageUrl.searchParams.set("data", shareData)
    shareUrl = sharePageUrl.toString()
  }

  // Initialize
  if (puzzleId) {
    fetchGame()
  }
</script>

<div
  class="word-search-container"
  class:dark={theme === "dark"}
  role="application"
  aria-label="Word Search Game"
>
  {#if loading}
    <div class="loading-state">
      <span class="material-symbols-outlined spinning">progress_activity</span>
      <p>{$t("wordsearch.loading")}</p>
    </div>
  {:else if error}
    <div class="error-state">
      <span class="material-symbols-outlined">error</span>
      <p>{error}</p>
    </div>
  {:else}
    <!-- Header -->
    <div class="game-header">
      <div class="game-title-row">
        <h2 class="game-title font-serif">{title}</h2>
        {#if difficulty}
          <span class="difficulty-badge">{difficulty}</span>
        {/if}
      </div>
      <div class="game-meta">
        <span class="timer">
          <span class="material-symbols-outlined" style="font-size: 16px">timer</span>
          {formatTime(timer)}
        </span>
        <span class="progress-label">{foundCount}/{totalWords} {$t("wordsearch.found")}</span>
      </div>
      <!-- Progress bar -->
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progress}%"></div>
      </div>
    </div>

    <div class="game-body">
      <!-- Grid -->
      <div
        class="grid-wrapper"
        on:mousedown={handlePointerDown}
        on:mousemove={handlePointerMove}
        on:mouseup={handlePointerUp}
        on:mouseleave={handlePointerUp}
        on:touchstart={handleTouchStart}
        on:touchmove={handleTouchMove}
        on:touchend={handleTouchEnd}
        role="grid"
        aria-label="Word search grid"
        tabindex="0"
      >
        <div
          class="grid"
          style="grid-template-columns: repeat({gridSize}, {cellSize}px); grid-template-rows: repeat({gridSize}, {cellSize}px);"
        >
          {#each grid as row, rowIdx}
            {#each row as letter, colIdx}
              {@const cellKey = `${rowIdx},${colIdx}`}
              {@const highlightColor = cellHighlightMap[cellKey] || null}
              {@const isSelecting = cellSelectionSet.has(cellKey)}
              <div
                class="cell"
                class:selecting={isSelecting}
                class:found={highlightColor !== null}
                data-row={rowIdx}
                data-col={colIdx}
                style="
                  width: {cellSize}px;
                  height: {cellSize}px;
                  font-size: {fontSize};
                  {highlightColor ? `background-color: ${highlightColor};` : ''}
                "
                role="gridcell"
                aria-label="Letter {letter}"
              >
                <span class="cell-letter font-serif">{letter}</span>
              </div>
            {/each}
          {/each}
        </div>
      </div>

      <!-- Word List -->
      <div class="word-list">
        <h3 class="word-list-title">{$t("wordsearch.wordsToFind")}</h3>
        <div class="words">
          {#each words as w}
            <div
              class="word-item"
              class:found={foundWords.has(w.word)}
              title={w.hint || ""}
            >
              <span class="word-text">{w.word}</span>
              {#if foundWords.has(w.word)}
                <span class="material-symbols-outlined check-icon">check_circle</span>
              {/if}
              {#if w.hint && !foundWords.has(w.word)}
                <span class="hint-text">{w.hint}</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Celebration (reusing crossword component) -->
    {#if gameComplete}
      <CelebrationOverlay
        elapsedTime={timer}
        {shareUrl}
        titleText={$t("wordsearch.congratulations")}
        messageText={$t("wordsearch.foundAllWords").replace("{0}", String(totalWords))}
        on:share={generateShareUrl}
      />
      <div class="restart-row">
        <button class="restart-btn" on:click={handleRestart} aria-label={$t("wordsearch.playAgain")} tabindex="0">
          <span class="material-symbols-outlined" style="font-size: 16px">replay</span>
          {$t("wordsearch.playAgain")}
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .word-search-container {
    font-family: var(--font-sans);
    color: var(--text-main);
    max-width: 900px;
    margin: 0 auto;
    padding: 1rem;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Loading & Error */
  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    gap: 0.75rem;
    color: var(--text-muted);
  }
  .error-state { color: #ef4444; }
  .spinning {
    animation: spin 1s linear infinite;
    font-size: 2rem;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Header */
  .game-header {
    margin-bottom: 1.25rem;
  }
  .game-title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }
  .game-title {
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--text-main);
    margin: 0;
  }
  .difficulty-badge {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.125rem 0.5rem;
    border-radius: 999px;
    background: var(--primary-light);
    color: var(--primary);
  }
  .game-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  .timer {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }
  .progress-label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--primary);
  }
  .progress-bar {
    height: 4px;
    background: var(--border-light);
    border-radius: 999px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: var(--primary);
    border-radius: 999px;
    transition: width 0.4s ease;
  }

  /* Game Body */
  .game-body {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  }

  @media (max-width: 640px) {
    .game-body {
      flex-direction: column;
    }
  }

  /* Grid */
  .grid-wrapper {
    flex-shrink: 0;
    cursor: crosshair;
    touch-action: none;
  }
  .grid {
    display: grid;
    gap: 1px;
    background: var(--border-light);
    border: 2px solid var(--grid-black);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface);
    transition: background-color 0.15s ease;
    cursor: crosshair;
  }
  .cell:hover {
    background-color: rgba(194, 94, 64, 0.08);
  }
  .cell.selecting {
    background-color: rgba(194, 94, 64, 0.2) !important;
  }
  .cell-letter {
    font-weight: 700;
    pointer-events: none;
    line-height: 1;
  }

  /* Word List */
  .word-list {
    flex: 1;
    min-width: 0;
  }
  .word-list-title {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }
  .words {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }
  .word-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
    background: var(--surface);
    font-size: 0.8125rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  .word-item.found {
    background: var(--primary-light);
    border-color: var(--primary);
    text-decoration: line-through;
    opacity: 0.7;
  }
  .word-text {
    font-family: var(--font-serif);
    letter-spacing: 0.05em;
  }
  .check-icon {
    font-size: 16px;
    color: var(--primary);
  }
  .hint-text {
    font-size: 0.6875rem;
    color: var(--text-muted);
    font-weight: 400;
    font-style: italic;
  }

  /* Restart row */
  .restart-row {
    display: flex;
    justify-content: center;
    margin-top: 12px;
  }
  .restart-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 8px 16px;
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border-light);
    border-radius: 8px;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: var(--font-sans);
  }
  .restart-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
</style>
