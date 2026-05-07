// Mock games rendered inside the preview. Each consumes the brand tokens
// via custom properties on .game-frame, so they live-update.
const { useState, useEffect, useMemo } = React;

// ============= WORD SEARCH =============
const WS_GRID = [
  ['B','R','A','N','D','X','T','H'],
  ['S','T','Y','L','E','O','H','Q'],
  ['W','C','O','L','O','R','E','V'],
  ['F','O','N','T','P','I','M','Z'],
  ['A','T','H','E','M','E','E','K'],
  ['I','C','O','N','Q','D','R','L'],
  ['L','O','G','O','M','P','V','Y'],
  ['P','I','X','E','L','B','S','N'],
];
const WS_HIGHLIGHTS = new Set(['0,0','0,1','0,2','0,3','0,4','1,0','1,1','1,2','1,3','1,4']); // BRAND, STYLE
const WORDS = ['BRAND','STYLE','COLOR','FONT','THEME','LOGO','PIXEL'];

const WordSearchGame = ({ found = ['BRAND','STYLE'] }) => (
  <div className="game-frame" data-game="wordsearch">
    <div className="game-header" data-token-target="primary surface text font-serif radius">
      <div className="game-title">Brand sampler</div>
      <div className="game-meta">
        <span className="timer">⏱ 00:42</span>
        <span>found: {found.length} / {WORDS.length}</span>
      </div>
    </div>
    <div className="game-body">
      <div className="wordlist" data-token-target="font-serif text">
        <h3>Words to Find</h3>
        <ol>
          {WORDS.map((w, i) => (
            <li key={w} className={found.includes(w) ? 'found' : ''}>
              <span className="num">{String(i+1).padStart(2,'0')}.</span>
              <span>{w}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="ws-grid" data-token-target="primary surface text radius">
        {WS_GRID.flatMap((row, r) => row.map((c, k) => (
          <div key={`${r}-${k}`} className={`ws-cell ${WS_HIGHLIGHTS.has(`${r},${k}`) ? 'hl' : ''}`}>{c}</div>
        )))}
      </div>
    </div>
    <div className="game-footer" data-token-target="button-variant primary radius">
      <button className="game-btn b-soft">Hint</button>
      <button className="game-btn b-solid">Submit Word</button>
    </div>
  </div>
);

// ============= CROSSWORD =============
// 7x7 with some black cells. Just visual.
const CW_LAYOUT = [
  // 1 = white, 0 = black, n = number
  [{n:1,l:'B'},{n:2,l:'R'},{n:3,l:'A'},{n:4,l:'N'},{n:5,l:'D'},{b:1},{b:1}],
  [{l:'O'},{l:'A'},{l:'P'},{l:'I'},{l:'E'},{n:6,l:'L'},{l:'O'}],
  [{l:'X'},{b:1},{n:7,l:'T'},{l:'I'},{l:'L'},{l:'E'},{l:'G'}],
  [{n:8,l:'E'},{n:9,l:'D'},{l:'I'},{l:'T'},{b:1},{l:'A'},{l:'O'}],
  [{l:'S'},{l:'A'},{l:'L'},{l:'T'},{n:10,l:'Y'},{l:'F'},{b:1}],
  [{b:1},{l:'R'},{l:'E'},{n:11,l:'A'},{l:'D'},{b:1},{n:12,l:'P'}],
  [{b:1},{l:'K'},{l:'D'},{l:'M'},{l:'O'},{l:'D'},{l:'E'}],
];

const CrosswordGame = ({ active = '3,2' }) => (
  <div className="game-frame" data-game="crossword">
    <div className="game-header" data-token-target="primary surface text font-serif radius">
      <div className="game-title">Daily mini</div>
      <div className="game-meta">
        <span>Mon, Apr 28</span>
        <span className="timer">⏱ 02:14</span>
      </div>
    </div>
    <div className="game-body">
      <div className="cw-grid" data-token-target="primary surface text radius">
        {CW_LAYOUT.flatMap((row, r) => row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={`cw-cell ${cell.b ? 'black' : ''} ${active === `${r},${c}` ? 'active' : ''}`}
          >
            {cell.n && <span className="num">{cell.n}</span>}
            {!cell.b && cell.l}
          </div>
        )))}
      </div>
      <div className="wordlist" data-token-target="font-serif text">
        <h3>Across</h3>
        <ol>
          <li><span className="num">1.</span><span>What this tool styles</span></li>
          <li><span className="num">7.</span><span>Mosaic unit</span></li>
          <li><span className="num">8.</span><span>Change ___ mode</span></li>
        </ol>
        <h3 style={{marginTop:14}}>Down</h3>
        <ol>
          <li><span className="num">2.</span><span>Color spec</span></li>
          <li><span className="num">9.</span><span>Bold and ___</span></li>
        </ol>
      </div>
    </div>
    <div className="game-footer" data-token-target="button-variant primary radius">
      <button className="game-btn b-soft">Reveal</button>
      <button className="game-btn b-solid">Check</button>
    </div>
  </div>
);

// ============= WORD GAME (Wordle-style) =============
const WG_ROWS = [
  ['B','R','A','N','D'].map((l, i) => ({ l, s: ['absent','present','correct','absent','correct'][i] })),
  ['T','H','E','M','E'].map((l, i) => ({ l, s: ['absent','present','correct','correct','correct'][i] })),
  ['T','I','L','E','S'].map((l, i) => ({ l, s: ['','','','',''][i] })),
];
const KEYS = [['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Z','X','C','V','B','N','M']];

const WordGame = () => (
  <div className="game-frame" data-game="wordgame">
    <div className="game-header" data-token-target="primary surface text font-serif radius">
      <div className="game-title">Five-letter</div>
      <div className="game-meta">
        <span>Streak · 12</span>
        <span className="timer">⏱ 00:48</span>
      </div>
    </div>
    <div className="game-body" style={{gridTemplateColumns: '1fr', justifyItems: 'center'}}>
      <div className="wg" data-token-target="primary text surface radius">
        {WG_ROWS.map((row, ri) => (
          <div key={ri} className="wg-row">
            {row.map((t, ci) => (
              <div key={ci} className={`wg-tile ${t.s}`}>{t.l}</div>
            ))}
          </div>
        ))}
        {[0,1,2].map(i => (
          <div key={`empty-${i}`} className="wg-row">
            {[0,1,2,3,4].map(j => <div key={j} className="wg-tile"></div>)}
          </div>
        ))}
        <div className="wg-keyboard" data-token-target="text surface radius">
          {KEYS.map((row, i) => (
            <div key={i} className="wg-kbd-row">
              {row.map(k => <button key={k} className="wg-key">{k}</button>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ============= SUDOKU =============
const SUDOKU = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];
// User-placed (lighter color)
const USER = new Set(['0,2:1','2,0:2','5,5:4']);

const SudokuGame = () => (
  <div className="game-frame" data-game="sudoku">
    <div className="game-header" data-token-target="primary surface text font-serif radius">
      <div className="game-title">Sudoku · easy</div>
      <div className="game-meta">
        <span>Mistakes 0/3</span>
        <span className="timer">⏱ 04:21</span>
      </div>
    </div>
    <div className="game-body" style={{gridTemplateColumns: '1fr', justifyItems: 'center'}}>
      <div className="sudoku" data-token-target="primary text surface radius">
        {SUDOKU.flatMap((row, r) => row.map((v, c) => {
          const isUser = USER.has(`${r},${c}:${v}`);
          const klass = v === 0 ? '' : (isUser ? 'user' : 'given');
          // Block edges done with extra borders
          const style = {};
          if (r % 3 === 2 && r !== 8) style.boxShadow = 'inset 0 -2px 0 var(--b-text)';
          if (c % 3 === 2 && c !== 8) style.boxShadow = (style.boxShadow ? style.boxShadow + ', ' : '') + 'inset -2px 0 0 var(--b-text)';
          return (
            <div key={`${r}-${c}`} className={`sudoku-cell ${klass}`} style={style}>
              {v !== 0 ? v : ''}
            </div>
          );
        }))}
      </div>
    </div>
    <div className="game-footer" data-token-target="button-variant primary radius">
      <button className="game-btn b-soft">Notes</button>
      <button className="game-btn b-outline">Erase</button>
      <button className="game-btn b-solid">Hint</button>
    </div>
  </div>
);

window.WordSearchGame = WordSearchGame;
window.CrosswordGame = CrosswordGame;
window.WordGame = WordGame;
window.SudokuGame = SudokuGame;
