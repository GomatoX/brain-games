// ===== Shared building blocks for game-list pages =====
// Used by Create Word Game.html, Create Word Search.html, Create Crossword.html

const { useState, useRef, useEffect } = React;

// ---------- IconSelect ----------
const IconSelect = ({ value, onChange, options, placeholder = 'Choose…' }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = options.find(o => o.id === value);
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(q.toLowerCase()) ||
    (o.sub || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="iselect" ref={ref}>
      <button type="button" className={`iselect-trigger ${open?'open':''}`} onClick={() => setOpen(!open)}>
        {current ? (
          <>
            <span className="iselect-glyph">{current.glyph}</span>
            <span className="iselect-label">{current.label}</span>
            {current.sub && <span className="iselect-sub">{current.sub}</span>}
          </>
        ) : (
          <span className="iselect-label" style={{color:'var(--tool-text-faint)'}}>{placeholder}</span>
        )}
        <svg className="iselect-caret" viewBox="0 0 10 10"><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <div className="iselect-menu">
          <div className="iselect-search">
            <input autoFocus placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div className="iselect-list">
            {filtered.length === 0 && <div className="iselect-empty">No matches</div>}
            {filtered.map(o => (
              <button
                key={o.id}
                type="button"
                className={`iselect-option ${value===o.id?'active':''}`}
                onClick={() => { onChange(o.id); setOpen(false); setQ(''); }}
              >
                <span className="iselect-glyph">{o.glyph}</span>
                <span className="iselect-label">{o.label}</span>
                {o.sub && <span className="iselect-sub">{o.sub}</span>}
                <svg className="iselect-check" viewBox="0 0 14 14"><path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Shared option lists ----------
const STATUS_OPTIONS = [
  { id: 'draft',     label: 'Draft',     sub: 'private',      glyph: <span style={{width:8,height:8,borderRadius:'50%',background:'#b45309'}}/> },
  { id: 'scheduled', label: 'Scheduled', sub: 'auto-publish', glyph: <span style={{width:8,height:8,borderRadius:'50%',background:'#1d4ed8'}}/> },
  { id: 'published', label: 'Published', sub: 'live',         glyph: <span style={{width:8,height:8,borderRadius:'50%',background:'#15803d'}}/> },
];

const DIFFICULTY_OPTIONS = [
  { id: 'easy',   label: 'Easy',   sub: 'beginner',     glyph: <span style={{display:'flex',gap:2}}><span style={{width:4,height:12,background:'#15803d',borderRadius:1}}/><span style={{width:4,height:12,background:'#e5e7eb',borderRadius:1}}/><span style={{width:4,height:12,background:'#e5e7eb',borderRadius:1}}/></span> },
  { id: 'medium', label: 'Medium', sub: 'intermediate', glyph: <span style={{display:'flex',gap:2}}><span style={{width:4,height:12,background:'#b45309',borderRadius:1}}/><span style={{width:4,height:12,background:'#b45309',borderRadius:1}}/><span style={{width:4,height:12,background:'#e5e7eb',borderRadius:1}}/></span> },
  { id: 'hard',   label: 'Hard',   sub: 'expert',       glyph: <span style={{display:'flex',gap:2}}><span style={{width:4,height:12,background:'#b91c1c',borderRadius:1}}/><span style={{width:4,height:12,background:'#b91c1c',borderRadius:1}}/><span style={{width:4,height:12,background:'#b91c1c',borderRadius:1}}/></span> },
];

const PRESET_OPTIONS = [
  { id: 'none',   label: 'Default', sub: 'no branding', glyph: <span style={{display:'flex',gap:1}}><span style={{width:5,height:14,background:'#9ca3af'}}/><span style={{width:5,height:14,background:'#e5e7eb'}}/></span> },
  { id: 'rust',   label: 'Rust',    sub: 'workspace',   glyph: <span style={{display:'flex',gap:1}}><span style={{width:5,height:14,background:'#c2410c'}}/><span style={{width:5,height:14,background:'#fffaf5'}}/></span> },
  { id: 'forest', label: 'Forest',  sub: 'nature.co',   glyph: <span style={{display:'flex',gap:1}}><span style={{width:5,height:14,background:'#15803d'}}/><span style={{width:5,height:14,background:'#f6faf6'}}/></span> },
  { id: 'cobalt', label: 'Cobalt',  sub: 'enterprise',  glyph: <span style={{display:'flex',gap:1}}><span style={{width:5,height:14,background:'#1d4ed8'}}/><span style={{width:5,height:14,background:'#f6f8ff'}}/></span> },
  { id: 'plum',   label: 'Plum',    sub: 'arts',        glyph: <span style={{display:'flex',gap:1}}><span style={{width:5,height:14,background:'#7e22ce'}}/><span style={{width:5,height:14,background:'#faf6ff'}}/></span> },
];

// ---------- Status pill ----------
const StatusPill = ({ s }) => {
  const map = {
    published: { bg: '#ecfdf5', fg: '#15803d', dot: '#15803d', label: 'Published' },
    draft:     { bg: '#fef3c7', fg: '#b45309', dot: '#b45309', label: 'Draft' },
    scheduled: { bg: '#dbeafe', fg: '#1d4ed8', dot: '#1d4ed8', label: 'Scheduled' },
  };
  const m = map[s];
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'2px 8px',borderRadius:999,fontSize:11,fontWeight:500,background:m.bg,color:m.fg}}>
      <span style={{width:6,height:6,borderRadius:'50%',background:m.dot}}/>{m.label}
    </span>
  );
};

const DifficultyDots = ({ d }) => {
  const map = { easy: ['#15803d',1], medium: ['#b45309',2], hard: ['#b91c1c',3] };
  const [color, n] = map[d] || map.easy;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,color:'var(--tool-text-soft)'}}>
      <span style={{display:'flex',gap:2}}>
        {[0,1,2].map(i => <span key={i} style={{width:4,height:11,borderRadius:1,background: i < n ? color : '#e5e7eb'}}/>)}
      </span>
      <span style={{textTransform:'capitalize'}}>{d}</span>
    </span>
  );
};

// ---------- AI Generate panel ----------
// Mock dictionary so generation produces plausible-looking words per language.
const AI_DICTS = {
  en: ['BRAIN','CLEVER','LOGIC','PUZZLE','SOLVE','CLUE','MIND','THINK','RIDDLE','STUDY','LEARN','FOCUS','SHARP','SMART','WISE','QUICK','GAME','PLAY','GUESS','TRACE','BLEND','ALERT','SCORE','DAILY','WORD'],
  lt: ['SMEGENYS','GUDRUS','LOGIKA','GALVOSŪKIS','SPRĘSTI','UŽUOMINA','PROTAS','MĄSTYTI','MĮSLĖ','MOKYTIS','AŠTRUS','GREITAS','ŽAIDIMAS','SPĖTI','TIRTI','ŽODIS','RAKTAS','GUDRYBĖ','TAŠKAS','DIENA','LENGVA','SUNKU','RIBA','VIENAS','DU'],
  es: ['CEREBRO','LISTO','LÓGICA','ROMPECABEZAS','RESOLVER','PISTA','MENTE','PENSAR','ENIGMA','ESTUDIO','APRENDER','AGUDO','RÁPIDO','JUEGO','JUGAR','PALABRA','CLAVE','TRUCO','PUNTO','DIARIO'],
  fr: ['CERVEAU','MALIN','LOGIQUE','PUZZLE','RÉSOUDRE','INDICE','ESPRIT','PENSER','ÉNIGME','ÉTUDE','APPRENDRE','VIF','RAPIDE','JEU','JOUER','MOT','CLÉ','ASTUCE','POINT','JOUR'],
};
const AI_HINTS = {
  en: { BRAIN: 'Organ of thought', CLEVER: 'Sharp-witted', LOGIC: 'Reasoning system', PUZZLE: 'Brain-teaser', SOLVE: 'Find the answer', CLUE: 'A hint', MIND: 'The thinker', THINK: 'Use your head', RIDDLE: 'Tricky question', STUDY: 'Learn deeply' },
  lt:  { SMEGENYS: 'Mąstymo organas', LOGIKA: 'Mąstymo sistema', GALVOSŪKIS: 'Galvosūkis', SPRĘSTI: 'Rasti atsakymą', UŽUOMINA: 'Patarimas', PROTAS: 'Mąstytojas', MĮSLĖ: 'Sudėtingas klausimas', GREITAS: 'Spartus' },
  es:  { CEREBRO: 'Órgano del pensamiento', LÓGICA: 'Sistema de razonamiento', PISTA: 'Una sugerencia', MENTE: 'El pensador' },
  fr:  { CERVEAU: 'Organe de la pensée', LOGIQUE: 'Système de raisonnement', INDICE: 'Un soupçon', ESPRIT: 'Le penseur' },
};

const LANG_OPTIONS_AI = [
  { id: 'lt', label: 'Lithuanian', flag: '🇱🇹' },
  { id: 'en', label: 'English',    flag: '🇬🇧' },
  { id: 'es', label: 'Spanish',    flag: '🇪🇸' },
  { id: 'fr', label: 'French',     flag: '🇫🇷' },
];

// AI panel — inline bar with direct quantity buttons. Click a number, words
// land directly in the list (no popover, no preview, no accept step).
// Inline language picker on the right (small flag chip with native <select>
// overlay). State is one click from action.
const AITopicField = ({ value, editing, onChange, onEditStart, onEditEnd, disabled }) => {
  const inputRef = React.useRef(null);
  useEffect(() => { if (editing && inputRef.current) inputRef.current.select(); }, [editing]);
  const placeholder = 'anything';
  const display = (value || '').trim() || placeholder;
  const isPlaceholder = !((value || '').trim());

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="ai-topic-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onEditEnd}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); onEditEnd(); }
        }}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={40}
      />
    );
  }
  return (
    <button
      type="button"
      className={`ai-topic-chip ${isPlaceholder ? 'is-placeholder' : ''}`}
      onClick={onEditStart}
      disabled={disabled}
      title="Click to change topic"
    >
      <span className="ai-topic-text">{display}</span>
      <svg width="9" height="9" viewBox="0 0 12 12" className="ai-topic-pencil" aria-hidden="true">
        <path d="M8.5 1.5l2 2-6 6-2.5.5.5-2.5 6-6z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

// AI panel — inline bar with direct quantity buttons. Click a number, words
// land directly in the list (no popover, no preview, no accept step).
// Inline language picker on the right (small flag chip with native <select>
// overlay). State is one click from action.
const AIGeneratePanel = ({ context = '', existingWords = [], onAccept, defaultLang = 'lt', minLen = 3, maxLen = 12, label }) => {
  const [lang, setLang] = useState(defaultLang);
  const [busyN, setBusyN] = useState(null); // count currently generating
  // Topic the AI is "thinking about". Defaults to whatever the parent passed
  // (puzzle title), but the user can override per batch — e.g. start with
  // "animals", flip to "verbs" for the next +10. Empty = unconstrained.
  const [topic, setTopic] = useState(context);
  const [topicEditing, setTopicEditing] = useState(false);
  // Keep topic in sync if parent context changes AND user hasn't touched it.
  const ctxRef = React.useRef(context);
  useEffect(() => {
    if (topic === ctxRef.current) setTopic(context);
    ctxRef.current = context;
  }, [context]);

  const buildItems = (n, salt = 0) => {
    const dict = AI_DICTS[lang] || AI_DICTS.en;
    const seen = new Set(existingWords.map(w => (w.word || w).toUpperCase()));
    if (topic) seen.add(topic.toUpperCase());
    const pool = dict.filter(w => !seen.has(w) && w.length >= minLen && w.length <= maxLen);
    if (pool.length === 0) return [];
    const offset = ((topic.length * 3) + salt * 5 + Date.now()) % Math.max(1, pool.length);
    const picks = [];
    for (let i = 0; i < n && i < pool.length; i++) {
      picks.push(pool[(offset + i) % pool.length]);
    }
    const hintMap = AI_HINTS[lang] || {};
    return picks.map(w => ({ word: w, hint: hintMap[w] || '', ai: true }));
  };

  const generate = (n) => {
    setBusyN(n);
    setTimeout(() => {
      onAccept(buildItems(n, n));
      setBusyN(null);
    }, 450);
  };

  const currentLang = LANG_OPTIONS_AI.find(l => l.id === lang) || LANG_OPTIONS_AI[0];
  const empty = existingWords.length === 0;
  const presets = [5, 10, 15];

  return (
    <div className={`ai-bar ${empty ? 'ai-bar-empty' : 'ai-bar-compact'}`}>
      <div className="ai-bar-lead">
        <span className="ai-bar-mark">
          <svg width="11" height="11" viewBox="0 0 14 14"><path d="M7 1.5l1.4 3.1 3.1 1.4-3.1 1.4L7 10.5 5.6 7.4 2.5 6l3.1-1.4L7 1.5z" fill="currentColor"/></svg>
        </span>
        <span className="ai-bar-label">
          {empty ? 'Generate words about' : 'More words about'}
        </span>
        <AITopicField
          value={topic}
          editing={topicEditing}
          onChange={setTopic}
          onEditStart={() => setTopicEditing(true)}
          onEditEnd={() => setTopicEditing(false)}
          disabled={busyN !== null}
        />
      </div>

      <div className="ai-bar-actions">
        {presets.map(n => (
          <button
            key={n}
            type="button"
            className={`ai-bar-btn ${busyN === n ? 'busy' : ''}`}
            onClick={() => generate(n)}
            disabled={busyN !== null}
            aria-label={`Generate ${n} words`}
          >
            {busyN === n ? <span className="ai-spinner-sm"/> : <strong>+{n}</strong>}
          </button>
        ))}
        <span className="ai-bar-divider"/>
        <label className="ai-bar-lang" title="Generation language">
          <span className="ai-bar-lang-flag">{currentLang.flag}</span>
          <span className="ai-bar-lang-code">{currentLang.id.toUpperCase()}</span>
          <svg width="8" height="8" viewBox="0 0 10 10" style={{opacity:0.5,marginLeft:2}}>
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="ai-bar-lang-select"
            disabled={busyN !== null}
          >
            {LANG_OPTIONS_AI.map(l => (
              <option key={l.id} value={l.id}>{l.flag} {l.label}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};


// ---------- Full AI Generate Tab (used as a 3rd modal tab) ----------
// Roomier alternative to AIGeneratePanel. Lives in its own tab, so it has the
// whole modal body to work with. Layout:
//   [ topic textarea (large) ]   [ side panel: count + language + style + history ]
//   [ ----- preview list ----- ] (results land here, can be accepted/regenerated)
//   [ generate ] button at the bottom
// Accepts results into parent's word list via onAccept(items).
const AIGenerateTab = ({ context = '', existingWords = [], onAccept, defaultLang = 'lt', minLen = 3, maxLen = 12, kind = 'words' }) => {
  const [topic, setTopic] = useState(context);
  const [count, setCount] = useState(10);
  const [lang, setLang] = useState(defaultLang);
  const [style, setStyle] = useState('mixed'); // mixed / easy / tricky
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState([]); // candidate items not yet accepted
  const [history, setHistory] = useState([]); // {id, topic, count, lang, style, items}
  const [accepted, setAccepted] = useState(new Set()); // ids of items already accepted

  // Sync topic from parent if it changes (e.g. user edited title in another tab)
  useEffect(() => { if (context && !topic) setTopic(context); }, [context]);

  const buildItems = (n, t, l, salt = 0) => {
    const dict = AI_DICTS[l] || AI_DICTS.en;
    const seen = new Set(existingWords.map(w => (w.word || w).toUpperCase()));
    if (t) seen.add(t.toUpperCase());
    const pool = dict.filter(w => !seen.has(w) && w.length >= minLen && w.length <= maxLen);
    if (pool.length === 0) return [];
    const offset = ((t.length * 3) + salt * 5 + Date.now()) % Math.max(1, pool.length);
    const picks = [];
    for (let i = 0; i < n && i < pool.length; i++) {
      picks.push(pool[(offset + i) % pool.length]);
    }
    const hintMap = AI_HINTS[l] || {};
    return picks.map((w, i) => ({
      id: `${Date.now()}-${i}`,
      word: w,
      hint: hintMap[w] || '',
      ai: true,
    }));
  };

  const generate = () => {
    if (busy) return;
    setBusy(true);
    setTimeout(() => {
      const items = buildItems(count, topic, lang, history.length);
      setResults(items);
      setHistory(h => [{ id: Date.now(), topic, count, lang, style, items }, ...h.slice(0, 4)]);
      setBusy(false);
    }, 600);
  };

  const acceptAll = () => {
    const fresh = results.filter(r => !accepted.has(r.id));
    if (fresh.length === 0) return;
    onAccept(fresh.map(({ id, ...rest }) => rest));
    setAccepted(prev => {
      const next = new Set(prev);
      fresh.forEach(r => next.add(r.id));
      return next;
    });
  };

  const acceptOne = (item) => {
    if (accepted.has(item.id)) return;
    onAccept([{ word: item.word, hint: item.hint, ai: true }]);
    setAccepted(prev => { const next = new Set(prev); next.add(item.id); return next; });
  };

  const removeFromResults = (id) => {
    setResults(rs => rs.filter(r => r.id !== id));
  };

  const restoreHistory = (h) => {
    setTopic(h.topic);
    setCount(h.count);
    setLang(h.lang);
    setStyle(h.style);
    setResults(h.items);
  };

  const currentLang = LANG_OPTIONS_AI.find(l => l.id === lang) || LANG_OPTIONS_AI[0];
  const itemNoun = kind === 'entries' ? 'entries' : 'words';
  const itemSingular = kind === 'entries' ? 'entry' : 'word';
  const remaining = results.filter(r => !accepted.has(r.id)).length;

  return (
    <div className="ai-tab">
      <div className="ai-tab-grid">
        {/* Left — prompt */}
        <div className="ai-tab-prompt">
          <div className="ai-tab-prompt-head">
            <span className="ai-tab-spark">
              <svg width="13" height="13" viewBox="0 0 14 14"><path d="M7 1.5l1.4 3.1 3.1 1.4-3.1 1.4L7 10.5 5.6 7.4 2.5 6l3.1-1.4L7 1.5z" fill="currentColor"/></svg>
            </span>
            <div>
              <div className="ai-tab-title">Cluemaster</div>
              <div className="ai-tab-sub">Describe your puzzle and we'll suggest {itemNoun}.</div>
            </div>
          </div>

          <label className="field-label-block">What's it about?</label>
          <textarea
            className="textarea"
            placeholder="e.g. Forest animals for kids learning their first English words. Include a few action verbs."
            rows="3"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            style={{minHeight: 78, resize: 'vertical'}}
          />
          <div className="ai-tab-suggest">
            <span className="ai-tab-suggest-label">Try:</span>
            {['Space exploration', 'Ancient Rome', 'Kitchen verbs', 'Ocean creatures'].map(s => (
              <button key={s} type="button" className="ai-tab-suggest-chip" onClick={() => setTopic(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Right — controls */}
        <div className="ai-tab-controls">
          <div className="ai-tab-control">
            <label className="field-label-block">How many {itemNoun}?</label>
            <div className="ai-tab-count">
              {[5, 10, 15, 20].map(n => (
                <button
                  key={n}
                  type="button"
                  className={`ai-tab-count-btn ${count === n ? 'active' : ''}`}
                  onClick={() => setCount(n)}
                >{n}</button>
              ))}
            </div>
          </div>

          <div className="ai-tab-control">
            <label className="field-label-block">Language</label>
            <div className="ai-tab-lang-row">
              {LANG_OPTIONS_AI.map(l => (
                <button
                  key={l.id}
                  type="button"
                  className={`ai-tab-lang ${lang === l.id ? 'active' : ''}`}
                  onClick={() => setLang(l.id)}
                  title={l.label}
                >
                  <span className="ai-tab-lang-flag">{l.flag}</span>
                  <span className="ai-tab-lang-code">{l.id.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ai-tab-control">
            <label className="field-label-block">Style</label>
            <div className="ai-tab-style">
              {[
                { id: 'easy',   label: 'Easy',    desc: 'Common words, simple clues' },
                { id: 'mixed',  label: 'Mixed',   desc: 'A balanced range' },
                { id: 'tricky', label: 'Tricky',  desc: 'Less common, longer words' },
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={`ai-tab-style-btn ${style === s.id ? 'active' : ''}`}
                  onClick={() => setStyle(s.id)}
                >
                  <strong>{s.label}</strong>
                  <small>{s.desc}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate row */}
      <div className="ai-tab-action">
        <button
          type="button"
          className="btn btn-primary ai-tab-generate"
          onClick={generate}
          disabled={busy || !topic.trim()}
        >
          {busy ? (
            <><span className="ai-spinner-sm"/> Generating…</>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 14 14"><path d="M7 1.5l1.4 3.1 3.1 1.4-3.1 1.4L7 10.5 5.6 7.4 2.5 6l3.1-1.4L7 1.5z" fill="currentColor"/></svg>
              {results.length > 0 ? 'Generate again' : `Generate ${count} ${itemNoun}`}
            </>
          )}
        </button>
        {results.length > 0 && (
          <span className="ai-tab-action-meta">
            {currentLang.flag} {currentLang.label} · {style}
          </span>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="ai-tab-results">
          <div className="ai-tab-results-head">
            <div>
              <div className="ai-tab-results-title">
                Suggestions
                <span className="ai-tab-results-count">{remaining}/{results.length} remaining</span>
              </div>
              <div className="ai-tab-results-sub">Add individually, or accept all into your puzzle.</div>
            </div>
            <div className="ai-tab-results-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={generate} disabled={busy}>
                <svg width="11" height="11" viewBox="0 0 12 12" style={{marginRight:4}}>
                  <path d="M2 5a4 4 0 017-2.5M10 7a4 4 0 01-7 2.5M9 1v3H6M3 11V8h3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Try again
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={acceptAll} disabled={remaining === 0}>
                {remaining === 0 ? `All added` : `Add all ${remaining}`}
              </button>
            </div>
          </div>

          <div className="ai-tab-result-list">
            {results.map((r) => {
              const used = accepted.has(r.id);
              return (
                <div key={r.id} className={`ai-tab-result ${used ? 'used' : ''}`}>
                  <div className="ai-tab-result-word">{r.word}</div>
                  <div className="ai-tab-result-hint">
                    {r.hint || <span className="ai-tab-result-no-hint">no clue — edit after adding</span>}
                  </div>
                  <div className="ai-tab-result-actions">
                    {used ? (
                      <span className="ai-tab-result-tick" title="Already added">
                        <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2.5 6.5l2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Added
                      </span>
                    ) : (
                      <>
                        <button type="button" className="ai-tab-result-btn" title="Skip" onClick={() => removeFromResults(r.id)}>
                          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                        </button>
                        <button type="button" className="ai-tab-result-add" onClick={() => acceptOne(r)}>
                          <svg width="11" height="11" viewBox="0 0 12 12"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                          Add
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {history.length > 1 && (
            <div className="ai-tab-history">
              <div className="ai-tab-history-label">Previous batches</div>
              <div className="ai-tab-history-list">
                {history.slice(1).map(h => (
                  <button key={h.id} type="button" className="ai-tab-history-chip" onClick={() => restoreHistory(h)}>
                    <span className="ai-tab-history-topic">{h.topic || '(no topic)'}</span>
                    <span className="ai-tab-history-meta">{h.count} · {h.lang.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {results.length === 0 && !busy && (
        <div className="ai-tab-empty">
          <div className="ai-tab-empty-mark">
            <svg width="20" height="20" viewBox="0 0 20 20" style={{opacity:0.5}}><path d="M10 2.5l2 4.5 4.5 2-4.5 2L10 15.5 8 11l-4.5-2L8 7l2-4.5z" fill="currentColor"/></svg>
          </div>
          <div className="ai-tab-empty-title">Ready when you are</div>
          <div className="ai-tab-empty-sub">Pick a topic above and hit generate. You'll see suggestions here, then add the ones you like.</div>
        </div>
      )}
    </div>
  );
};

// ---------- Word/clue chip list (used by Word Search & Crossword modals) ----------
// Each row is editable in place: click to edit, Enter to save, Esc to cancel.
// AI-generated rows get a small sparkle marker until edited.
const WordChipList = ({ items, onUpdate, onRemove, hintLabel = 'Hint' }) => {
  const [editing, setEditing] = useState(null); // index being edited

  if (items.length === 0) {
    return (
      <div className="words-empty">
        <svg width="22" height="22" viewBox="0 0 22 22" style={{opacity:0.4}}>
          <rect x="2" y="6" width="18" height="3" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none"/>
          <rect x="2" y="13" width="18" height="3" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        </svg>
        <span>No words yet — add or generate some below.</span>
      </div>
    );
  }

  return (
    <div className="words-list" data-count={items.length}>
      {items.map((it, i) => (
        <WordChipRow
          key={i}
          index={i}
          item={it}
          isEditing={editing === i}
          onStartEdit={() => setEditing(i)}
          onCommitEdit={(patch) => { onUpdate(i, patch); setEditing(null); }}
          onCancelEdit={() => setEditing(null)}
          onRemove={() => onRemove(i)}
          hintLabel={hintLabel}
        />
      ))}
    </div>
  );
};

const WordChipRow = ({ index, item, isEditing, onStartEdit, onCommitEdit, onCancelEdit, onRemove, hintLabel }) => {
  const [word, setWord] = useState(item.word);
  const [hint, setHint] = useState(item.hint || '');

  useEffect(() => {
    if (isEditing) { setWord(item.word); setHint(item.hint || ''); }
  }, [isEditing, item]);

  const commit = () => {
    const w = (word || '').trim().toUpperCase();
    if (w.length < 2) return;
    onCommitEdit({ word: w, hint: hint.trim(), ai: false });
  };

  if (isEditing) {
    return (
      <div className="words-row editing">
        <span className="words-row-num">{index + 1}</span>
        <input
          autoFocus
          className="words-row-word-input"
          value={word}
          onChange={e => setWord(e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase())}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') onCancelEdit(); }}
          maxLength={14}
        />
        <input
          className="words-row-hint-input"
          placeholder={`${hintLabel} (optional)`}
          value={hint}
          onChange={e => setHint(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') onCancelEdit(); }}
        />
        <button type="button" className="words-row-btn words-row-btn-primary" onClick={commit} title="Save (Enter)">
          <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button type="button" className="words-row-btn" onClick={onCancelEdit} title="Cancel (Esc)">
          <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 2l7 7M9 2l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
      </div>
    );
  }

  return (
    <div className="words-row" onDoubleClick={onStartEdit}>
      <span className="words-row-num">{index + 1}</span>
      <span className="words-row-word">
        {item.word}
        {item.ai && <span className="words-row-ai" title="Generated by AI">AI</span>}
      </span>
      <span className={`words-row-hint ${!item.hint ? 'empty' : ''}`} onClick={onStartEdit}>
        {item.hint || `Click to add ${hintLabel.toLowerCase()}…`}
      </span>
      <button type="button" className="words-row-btn" onClick={onStartEdit} title="Edit">
        <svg width="11" height="11" viewBox="0 0 14 14"><path d="M9.5 2.5l2 2L5 11H3v-2l6.5-6.5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/></svg>
      </button>
      <button type="button" className="words-row-btn words-row-btn-danger" onClick={onRemove} title="Remove">
        <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 2l7 7M9 2l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
};

// ---------- Word/clue input row ----------
const WordHintInput = ({ onAdd, hintPlaceholder = 'Hint (optional)', wordPlaceholder = 'WORD', maxLen = 12 }) => {
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const submit = () => {
    const w = word.trim().toUpperCase();
    if (w.length < 2) return;
    onAdd({ word: w, hint: hint.trim() });
    setWord(''); setHint('');
  };
  return (
    <div style={{display:'flex',gap:6}}>
      <input
        className="input input-mono"
        placeholder={wordPlaceholder}
        value={word}
        maxLength={maxLen}
        onChange={e => setWord(e.target.value.replace(/[^A-Za-z]/g, ''))}
        onKeyDown={e => { if (e.key === 'Enter') submit(); }}
        style={{flex:'0 0 130px'}}
      />
      <input
        className="input"
        placeholder={hintPlaceholder}
        value={hint}
        onChange={e => setHint(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit(); }}
        style={{flex:1}}
      />
      <button
        type="button"
        className="btn"
        onClick={submit}
        disabled={word.trim().length < 2}
        style={word.trim().length < 2 ? {opacity:0.45, cursor:'not-allowed'} : {}}
      >Add</button>
    </div>
  );
};

// ---------- Toolbar / table / pagination wrapper ----------
const GamesList = ({
  games,           // [{id, title, status, ...customFields}]
  iconName,        // Icon name for row glyph
  columns,         // [{header, width, render(g)}]
  onNew,
  emptyLabel = 'No games match your filters.',
}) => {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const counts = {
    all: games.length,
    published: games.filter(g => g.status === 'published').length,
    draft: games.filter(g => g.status === 'draft').length,
    scheduled: games.filter(g => g.status === 'scheduled').length,
  };

  const filtered = games.filter(g => {
    if (filter !== 'all' && g.status !== filter) return false;
    if (q && !g.title.toLowerCase().includes(q.toLowerCase()) && !(g.searchKey || '').toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const curPage = Math.min(page, totalPages);
  const start = (curPage - 1) * PAGE_SIZE;
  const slice = filtered.slice(start, start + PAGE_SIZE);

  useEffect(() => { setPage(1); }, [q, filter]);

  return (
    <>
      <div className="list-toolbar">
        <div className="list-search">
          <input placeholder="Search…" value={q} onChange={e => setQ(e.target.value)}/>
        </div>
        {[
          { id: 'all',       label: 'All' },
          { id: 'published', label: 'Published' },
          { id: 'scheduled', label: 'Scheduled' },
          { id: 'draft',     label: 'Draft' },
        ].map(f => (
          <button key={f.id} className={`filter-chip ${filter===f.id?'active':''}`} onClick={() => setFilter(f.id)}>
            {f.label}<span className="count">{counts[f.id]}</span>
          </button>
        ))}
        <div style={{flex:1}}></div>
        <button className="btn"><Icon name="upload" size={14}/> Export</button>
      </div>

      <table className="tbl gtbl">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={{width: c.width, textAlign: c.align || 'left'}}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slice.map(g => (
            <tr key={g.id}>
              {columns.map((c, i) => (
                <td key={i} style={{textAlign: c.align || 'left'}}>{c.render(g, iconName)}</td>
              ))}
            </tr>
          ))}
          {slice.length === 0 && (
            <tr><td colSpan={columns.length} style={{textAlign:'center', padding:'40px 16px', color:'var(--tool-text-faint)'}}>{emptyLabel}</td></tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <span>Showing <strong style={{color:'var(--tool-text)'}}>{start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)}</strong> of {filtered.length}</span>
        <div className="pagination-controls">
          <button className="page-btn" disabled={curPage === 1} onClick={() => setPage(curPage - 1)}>‹</button>
          {Array.from({length: totalPages}, (_, i) => i + 1).slice(0, 5).map(n => (
            <button key={n} className={`page-btn ${curPage === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
          ))}
          {totalPages > 5 && <span style={{padding:'0 4px',color:'var(--tool-text-faint)'}}>…</span>}
          {totalPages > 5 && <button className={`page-btn ${curPage === totalPages ? 'active' : ''}`} onClick={() => setPage(totalPages)}>{totalPages}</button>}
          <button className="page-btn" disabled={curPage === totalPages} onClick={() => setPage(curPage + 1)}>›</button>
        </div>
      </div>
    </>
  );
};

// ---------- Title cell helper ----------
const TitleCell = ({ title, sub, iconName }) => (
  <div className="gtbl-title-cell">
    <div className="gtbl-glyph"><Icon name={iconName} size={14}/></div>
    <div style={{minWidth:0}}>
      <div className="gtbl-title">{title}</div>
      <div className="gtbl-sub">{sub}</div>
    </div>
  </div>
);

const RowActions = () => (
  <div className="row-actions" style={{justifyContent:'flex-end'}}>
    <button className="tool-icon-btn" title="Preview"><Icon name="eye" size={14}/></button>
    <button className="tool-icon-btn" title="Edit"><Icon name="settings" size={14}/></button>
  </div>
);

// Export to globals so other Babel scripts can use them.
Object.assign(window, {
  IconSelect,
  STATUS_OPTIONS, DIFFICULTY_OPTIONS, PRESET_OPTIONS,
  StatusPill, DifficultyDots,
  WordChipList, WordHintInput,
  AIGeneratePanel,
  GamesList, TitleCell, RowActions,
});
