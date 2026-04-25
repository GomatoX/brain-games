<script>
  import "../app.css"
  import { onMount } from "svelte"
  import { locale, t } from "../../../shared/game-lib/i18n/index.js"
  import { applyBrandingFromData } from "../../../shared/game-lib/branding.js"
  import CelebrationOverlay from "./crossword/CelebrationOverlay.svelte"

  export let puzzleId = ""
  export let userId = ""
  export let theme = "light"
  export let apiUrl = ""
  export let token = ""
  export let client = ""
  export let lang = "lt"

  $: locale.set(lang)

  let containerEl

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
  let foundHighlights = [] // Array of { cells }
  let timer = 0
  let timerInterval = null
  let gameComplete = false
  let shareUrl = ""

  // Latest/history mode — supports both puzzle-id="latest" and empty puzzleId with userId
  let latestMode = puzzleId === "latest" || (!puzzleId && !!userId)
  let historyOffset = 0
  let historyMeta = null // { current, total, hasNewer, hasOlder }

  // Touch support
  let touchStartCell = null

  $: cellSize = gridSize <= 10 ? 40 : gridSize <= 14 ? 34 : 28
  $: fontSize = gridSize <= 10 ? "24px" : gridSize <= 14 ? "20px" : "16px"
  $: gridStyle = `--grid-cols: ${gridSize}; --cell-size: ${cellSize}px; --cell-font: ${fontSize};`
  $: totalWords = words.length
  $: foundCount = foundWords.size

  // Reactive highlight map — rebuilds whenever foundHighlights changes
  $: cellHighlightMap = (() => {
    const map = {}
    for (const highlight of foundHighlights) {
      for (const c of highlight.cells) {
        map[`${c.row},${c.col}`] = true
      }
    }
    return map
  })()

  // Reactive selection set — rebuilds whenever selectionCells changes
  $: cellSelectionSet = new Set(selectionCells.map((c) => `${c.row},${c.col}`))

  onMount(() => {
    // Load Source Sans Pro for LRT design
    if (!document.querySelector('link[href*="Source+Sans+Pro"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href =
        "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap"
      document.head.appendChild(link)
    }

    if (latestMode) {
      fetchLatest()
    } else if (puzzleId) {
      fetchGame()
    }
  })

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

      applyBrandingFromData(containerEl, branding)
      startTimer()
    } catch (err) {
      error = err.message || "Failed to load game"
    } finally {
      loading = false
    }
  }

  async function fetchLatest(offset = 0) {
    loading = true
    error = ""
    try {
      const base = apiUrl || window.location.origin
      const url = `${base}/api/public/games/latest?type=wordsearches&org=${userId}&offset=${offset}`
      const headers = {}
      if (token) headers["Authorization"] = `Bearer ${token}`

      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error("No published games found")

      const json = await res.json()
      const data = json.data || json
      historyMeta = json.meta || null
      historyOffset = offset

      grid = data.grid || []
      gridSize = data.grid_size || grid.length
      title = data.title || ""
      difficulty = data.difficulty || ""
      branding = data.branding || null

      words = (data.words || []).map((w) => ({
        word: w.word?.toUpperCase() || "",
        hint: w.hint || "",
      }))

      // Reset game state for new puzzle
      foundWords = new Set()
      foundHighlights = []
      selectionCells = []
      selectionStart = null
      selectionEnd = null
      gameComplete = false
      selecting = false
      shareUrl = ""

      applyBrandingFromData(containerEl, branding)
      startTimer()
    } catch (err) {
      error = err.message || "Failed to load game"
    } finally {
      loading = false
    }
  }

  const navigateHistory = (direction) => {
    if (direction === "older" && historyMeta?.hasOlder) {
      fetchLatest(historyOffset + 1)
    } else if (direction === "newer" && historyMeta?.hasNewer) {
      fetchLatest(historyOffset - 1)
    }
  }



  function startTimer() {
    if (timerInterval) clearInterval(timerInterval)
    timer = 0
    timerInterval = setInterval(() => {
      if (!gameComplete) timer++
    }, 1000)
  }

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0")
    const s = String(seconds % 60).padStart(2, "0")
    return `${m}:${s}`
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
          { cells: [...selectionCells] },
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

</script>

<div
  class="word-search-container"
  class:dark={theme === "dark"}
  role="application"
  aria-label="Word Search Game"
  bind:this={containerEl}
>
  {#if loading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>{$t("wordsearch.loading")}</p>
    </div>
  {:else if error}
    <div class="error-state">
      <p>⚠️ {error}</p>
    </div>
  {:else}
    <div class="game-layout">
      <!-- Sidebar: Word List (reuses crossword CluesSidebar pattern) -->
      <div class="clues-section">
        <div class="clue-box">
          <h4>{$t("wordsearch.wordsToFind")}</h4>
          <ul>
            {#each words as w, i}
              <li
                class="clue-item"
                class:solved={foundWords.has(w.word)}
                title={w.hint || ""}
              >
                <span class="clue-num"
                  >{String(i + 1).padStart(2, "0")}.</span
                >
                <span class="clue-text">{w.word}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <!-- Main Content: Grid Section (reuses crossword grid-section pattern) -->
      <div class="grid-section">
        <!-- Header banner (reuses crossword ClueBanner pattern) -->
        <div class="clue-banner">
          <div class="clue-banner-content">
            <span class="clue-banner-text font-serif">{title}</span>
            <div class="content-meta">
              <div class="meta-item">
                <span class="material-symbols-outlined meta-icon"
                  >timer</span
                >
                <span>{formatTime(timer)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label"
                  >{$t("wordsearch.found")}:</span
                >
                <span class="meta-count"
                  >{foundCount} / {totalWords}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Grid area -->
        <div class="grid-area">
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
              style={gridStyle}
            >
              {#each grid as row, rowIdx}
                {#each row as letter, colIdx}
                  {@const cellKey = `${rowIdx},${colIdx}`}
                  {@const isFound = cellHighlightMap[cellKey] || false}
                  {@const isSelecting = cellSelectionSet.has(cellKey)}
                  <div
                    class="cell"
                    class:selecting={isSelecting}
                    class:found={isFound}
                    data-row={rowIdx}
                    data-col={colIdx}
                    role="gridcell"
                    aria-label="Letter {letter}"
                  >
                    <span class="cell-letter">{letter}</span>
                  </div>
                {/each}
              {/each}
            </div>
          </div>
        </div>

        <!-- Completion Section — OUTSIDE gray zone, below grid -->
        {#if gameComplete}
          <CelebrationOverlay
            elapsedTime={timer}
            {shareUrl}
            titleText={$t("wordsearch.congratulations")}
            messageText={$t("wordsearch.foundAllWords").replace(
              "{0}",
              String(totalWords),
            )}
            on:share={generateShareUrl}
          />
          <div class="restart-row">
            <button
              class="restart-btn"
              on:click={handleRestart}
              aria-label={$t("wordsearch.playAgain")}
              tabindex="0"
            >
              <span class="material-symbols-outlined" style="font-size: 16px"
                >replay</span
              >
              {$t("wordsearch.playAgain")}
            </button>
          </div>
        {/if}

        {#if latestMode && historyMeta}
          <div class="history-nav">
            <button
              class="history-btn"
              disabled={!historyMeta.hasOlder}
              on:click={() => navigateHistory("older")}
              aria-label="Older puzzle"
              tabindex="0"
            >
              ← {$t("wordsearch.older")}
            </button>
            <span class="history-count">
              {historyMeta.current + 1} / {historyMeta.total}
            </span>
            <button
              class="history-btn"
              disabled={!historyMeta.hasNewer}
              on:click={() => navigateHistory("newer")}
              aria-label="Newer puzzle"
              tabindex="0"
            >
              {$t("wordsearch.newer")} →
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  * {
    box-sizing: border-box;
  }

  /* ─── Container ─────────────────────────────────────── */
  .word-search-container {
    /* Branded CSS variables flow in from the parent. Use-site fallbacks
       below preserve the previous light defaults. `--correct-hover` is
       not in the branded pipeline; it stays declared here. */
    --correct-hover: #005c2d;

    font-family: var(--font-sans);
    padding: 0;
    margin: 0 auto;
    max-width: 1440px;
    background: var(--bg-primary, #ffffff);
    color: var(--text-primary, #0f172a);
    user-select: none;
    -webkit-user-select: none;
  }

  :global(.dark-theme) .word-search-container {
    background: var(--bg-primary, #0f172a);
    color: var(--text-primary, #f1f5f9);
  }

  /* ─── Loading & Error ───────────────────────────────── */
  .loading-state,
  .error-state {
    text-align: center;
    padding: 48px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color, #e2e8f0);
    border-top-color: #64748b;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }

  :global(.dark-theme) .spinner {
    border-color: var(--border-color, #334155);
    border-top-color: #64748b;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error-state {
    color: #ef4444;
  }

  /* ─── Game Layout (matches crossword) ───────────────── */
  .game-layout {
    display: flex;
    gap: 32px;
    align-items: flex-start;
  }

  /* ─── Sidebar (reuses crossword CluesSidebar pattern) ─ */
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
    background-color: var(--border-color, #e2e8f0);
    border-radius: 3px;
  }

  :global(.dark-theme) .clues-section::-webkit-scrollbar-thumb {
    background-color: var(--border-color, #334155);
  }

  .clue-box {
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  :global(.dark-theme) .clue-box {
    background: var(--bg-primary, #0f172a);
    border-color: var(--border-color, #334155);
  }

  .clue-box h4 {
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    line-height: 12px;
    letter-spacing: 0.2px;
    color: var(--text-secondary, #64748b);
    margin: 0 0 6px;
    padding-bottom: 0;
    border-bottom: none;
  }

  :global(.dark-theme) .clue-box h4 {
    color: var(--text-secondary, #94a3b8);
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
    cursor: default;
    transition: all 0.15s ease;
  }

  .clue-item:hover {
    background: var(--bg-secondary, #f3f4f6);
  }

  :global(.dark-theme) .clue-item:hover {
    background: var(--bg-secondary, #1e293b);
  }

  /* Solved = green highlight + strikethrough (matches crossword) */
  .clue-item.solved {
    background: var(--correct-light, #e2f3ea);
    border-left: 1px solid var(--correct, #007a3c);
  }

  :global(.dark-theme) .clue-item.solved {
    background: var(--correct-light, rgba(16, 185, 129, 0.15));
    border-left-color: var(--correct, #10b981);
  }

  .clue-item.solved .clue-text {
    text-decoration: line-through;
    color: var(--text-secondary, #64748b);
  }

  :global(.dark-theme) .clue-item.solved .clue-text {
    color: var(--text-secondary, #94a3b8);
  }

  .clue-item.solved .clue-num {
    color: var(--correct, #007a3c);
  }

  :global(.dark-theme) .clue-item.solved .clue-num {
    color: var(--correct, #10b981);
  }

  .clue-num {
    font-family: var(--font-serif);
    font-size: 22px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0.3px;
    color: var(--text-secondary, #64748b);
    min-width: 28px;
    flex-shrink: 0;
  }

  :global(.dark-theme) .clue-num {
    color: var(--text-secondary, #94a3b8);
  }

  .clue-text {
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-primary, #0f172a);
  }

  :global(.dark-theme) .clue-text {
    color: var(--text-primary, #f1f5f9);
  }

  /* ─── Grid Section (matches crossword) ──────────────── */
  .grid-section {
    flex: 1 1 65%;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: visible;
  }

  /* ─── Banner Header (reuses crossword ClueBanner pattern) */
  .clue-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--cell-highlighted, #fcece8);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 12px 12px 0 0;
    padding: 8px 16px;
    min-height: 52px;
  }

  :global(.dark-theme) .clue-banner {
    background: var(--cell-highlighted, rgba(194, 94, 64, 0.15));
    border-color: var(--border-color, #334155);
  }

  .clue-banner-content {
    flex: 1;
    text-align: center;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .clue-banner-text {
    display: block;
    font-size: 0.95rem;
    color: var(--text-primary, #0f172a);
  }

  :global(.dark-theme) .clue-banner-text {
    color: var(--text-primary, #f1f5f9);
  }

  .content-meta {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: var(--font-sans);
    font-size: 12px;
    line-height: 12px;
    color: var(--text-secondary, #64748b);
  }

  :global(.dark-theme) .meta-item {
    color: var(--text-secondary, #94a3b8);
  }

  .meta-icon {
    font-size: 16px !important;
  }

  .meta-label {
    font-weight: 400;
  }

  .meta-count {
    font-weight: 400;
  }

  /* ─── History Navigation (bottom, matching crossword) ── */
  .history-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 12px 0;
    border-top: 1px solid var(--border-color, #e2e8f0);
    margin-top: 8px;
  }

  :global(.dark-theme) .history-nav {
    border-top-color: var(--border-color, #334155);
  }

  .history-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 6px;
    font-family: var(--font-sans);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-primary, #0f172a);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  :global(.dark-theme) .history-btn {
    background: var(--bg-primary, #0f172a);
    border-color: var(--border-color, #334155);
    color: var(--text-primary, #f1f5f9);
  }

  .history-btn:hover:not(:disabled) {
    border-color: var(--accent, #c25e40);
    color: var(--accent, #c25e40);
  }

  .history-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .history-count {
    font-family: var(--font-sans);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-secondary, #64748b);
  }

  :global(.dark-theme) .history-count {
    color: var(--text-secondary, #94a3b8);
  }

  /* ─── Grid Area (gray zone) ─────────────────────────── */
  .grid-area {
    background: var(--bg-secondary, #f3f4f6);
    display: flex;
    justify-content: center;
    padding: 16px;
    cursor: crosshair;
    touch-action: none;
  }

  :global(.dark-theme) .grid-area {
    background: var(--bg-secondary, #1e293b);
  }

  .grid-wrapper {
    cursor: crosshair;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-cols, 10), minmax(0, var(--cell-size, 40px)));
    gap: 1px;
    background: var(--cell-blocked, #1a1a1a);
    border-radius: 8px;
    overflow: hidden;
    padding: 1px;
    width: fit-content;
    max-width: 100%;
  }

  :global(.dark-theme) .grid {
    background: var(--cell-blocked, #0f172a);
  }

  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cell-bg, #ffffff);
    cursor: crosshair;
    transition: background-color 0.1s ease;
    position: relative;
    aspect-ratio: 1;
    min-width: 0;
    font-size: var(--cell-font, 20px);
  }

  :global(.dark-theme) .cell {
    background: var(--cell-bg, #1e293b);
  }

  /* Fix: hover uses a subtle highlight, not black */
  .cell:hover:not(.found):not(.selecting) {
    background-color: var(--cell-highlighted, #fcece8);
  }

  :global(.dark-theme) .cell:hover:not(.found):not(.selecting) {
    background-color: var(--cell-highlighted, rgba(194, 94, 64, 0.15));
  }

  .cell.selecting {
    background-color: #e6e8ff;
  }

  .cell.selecting .cell-letter {
    color: #2f357d;
  }

  .cell.found {
    background-color: var(--correct-light, #e2f3ea);
  }

  :global(.dark-theme) .cell.found {
    background-color: var(--correct-light, rgba(16, 185, 129, 0.15));
  }

  .cell.found .cell-letter {
    color: var(--correct, #007a3c);
  }

  :global(.dark-theme) .cell.found .cell-letter {
    color: var(--correct, #10b981);
  }

  .cell-letter {
    font-family: var(--font-sans);
    font-weight: 600;
    text-transform: uppercase;
    pointer-events: none;
    line-height: 1;
    letter-spacing: 0.4px;
    color: var(--text-primary, #0f172a);
  }

  :global(.dark-theme) .cell-letter {
    color: var(--text-primary, #f1f5f9);
  }

  /* ─── Restart ───────────────────────────────────────── */
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
    color: var(--text-secondary, #64748b);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: var(--font-sans);
  }

  :global(.dark-theme) .restart-btn {
    color: var(--text-secondary, #94a3b8);
    border-color: var(--border-color, #334155);
  }

  .restart-btn:hover {
    border-color: var(--correct, #007a3c);
    color: var(--correct, #007a3c);
  }

  :global(.dark-theme) .restart-btn:hover {
    border-color: var(--correct, #10b981);
    color: var(--correct, #10b981);
  }

  /* ─── Responsive (matches crossword breakpoint) ─────── */
  @media (max-width: 1024px) {
    .game-layout {
      flex-direction: column;
      gap: 16px;
    }

    .grid-section {
      max-width: 100%;
      order: -1;
      flex: 1;
      flex-grow: 1;
      width: 100%;
    }

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

  /* Phone: let the grid fill available width so it never overflows */
  @media (max-width: 640px) {
    .grid-area {
      padding: 8px;
    }

    .grid {
      grid-template-columns: repeat(var(--grid-cols, 10), minmax(0, 1fr));
      width: 100%;
      max-width: 100%;
    }

    .cell {
      /* Scale font with cell width: viewport minus grid-area padding, divided
         by column count, scaled down to leave margin for gaps. Capped at the
         desktop font-size so it doesn't grow on tablets. */
      font-size: min(
        var(--cell-font, 20px),
        calc((100vw - 16px) / var(--grid-cols, 10) * 0.55)
      );
    }
  }
</style>
