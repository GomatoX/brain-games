/* eslint-disable */
// Component Library page. Renders every primitive used across the Rustycogs admin.
// Sections (matching the TOC in Components.html):
//   tokens, icons, buttons, inputs, selects, nav, layout, data, chrome,
//   overlay, tables, code, words, ai, shadcn

const { useState, useEffect, useRef } = React;

// ---------- Reusable card primitives ----------
const Card = ({ name, tag, wide, tall, xl, children }) => (
  <div className={`lib-card ${wide ? 'lib-wide' : ''}`}>
    <div className={`lib-card-stage ${tall ? 'tall' : ''} ${xl ? 'xl' : ''}`}>
      {children}
    </div>
    <div className="lib-card-meta">
      <span className="lib-card-name">{name}</span>
      {tag && <span className="lib-card-tag">{tag}</span>}
    </div>
  </div>
);

const Section = ({ id, num, title, desc, children }) => (
  <section className="lib-section" id={id}>
    <div className="lib-section-head">
      <span className="lib-section-num">{num}</span>
      <h2>{title}</h2>
    </div>
    {desc && <p className="lib-section-desc">{desc}</p>}
    {children}
  </section>
);

// ---------- 01 — Tokens ----------
const ColorSwatch = ({ name, value, label }) => (
  <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
                border:'1px solid var(--tool-border)', borderRadius:8, background:'var(--tool-surface)' }}>
    <div style={{ width:28, height:28, borderRadius:6, background:value,
                  border:'1px solid rgba(0,0,0,0.06)', flexShrink:0 }}/>
    <div style={{ minWidth:0, flex:1 }}>
      <div style={{ fontSize:12.5, fontWeight:500, color:'var(--tool-text)' }}>{label}</div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10.5, color:'var(--tool-text-faint)',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</div>
    </div>
    <div style={{ fontFamily:'var(--font-mono)', fontSize:10.5, color:'var(--tool-text-faint)' }}>{value}</div>
  </div>
);

const TokensSection = () => {
  const colors = [
    ['--tool-bg', '#faf8f5', 'Background'],
    ['--tool-surface', '#ffffff', 'Surface'],
    ['--tool-surface-2', '#f4f1ec', 'Surface 2'],
    ['--tool-border', '#e8e3da', 'Border'],
    ['--tool-border-strong', '#d6cfc1', 'Border strong'],
    ['--tool-text', '#1a1814', 'Text'],
    ['--tool-text-soft', '#6b6357', 'Text soft'],
    ['--tool-text-faint', '#9a9285', 'Text faint'],
    ['--tool-accent', '#c2410c', 'Accent (rust)'],
    ['--tool-accent-soft', '#fdf2ea', 'Accent soft'],
    ['--tool-good', '#15803d', 'Good'],
    ['--tool-warn', '#b45309', 'Warn'],
  ];
  return (
    <Section id="tokens" num="01" title="Tokens"
             desc="The foundation. Colors, type and control sizing — every component composes from these. Surfaces are warm-neutral; the single accent is rust.">
      <div className="lib-grid">
        <div className="lib-card lib-wide">
          <div className="lib-card-stage" style={{ padding:18 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:8, width:'100%' }}>
              {colors.map(([n,v,l]) => <ColorSwatch key={n} name={n} value={v} label={l}/>)}
            </div>
          </div>
          <div className="lib-card-meta">
            <span className="lib-card-name">Color tokens</span>
            <span className="lib-card-tag">--tool-*</span>
          </div>
        </div>

        <Card name="Type · UI" tag="--font-ui" tall>
          <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:6, alignItems:'flex-start' }}>
            <div style={{ fontSize:24, fontWeight:600, letterSpacing:'-0.01em' }}>Inter 24/600</div>
            <div style={{ fontSize:16, fontWeight:500 }}>Inter 16/500</div>
            <div style={{ fontSize:13.5 }}>Inter 13.5 — body</div>
            <div style={{ fontSize:11.5, color:'var(--tool-text-soft)' }}>Inter 11.5 — label</div>
          </div>
        </Card>

        <Card name="Type · Mono" tag="--font-mono" tall>
          <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:6, alignItems:'flex-start',
                        fontFamily:'var(--font-mono)' }}>
            <div style={{ fontSize:18 }}>JetBrains 18</div>
            <div style={{ fontSize:13 }}>JetBrains 13 — code</div>
            <div style={{ fontSize:11, color:'var(--tool-text-faint)', textTransform:'uppercase', letterSpacing:'0.08em' }}>11 · eyebrow</div>
            <div style={{ fontSize:10.5, color:'var(--tool-text-faint)' }}>10.5 · meta</div>
          </div>
        </Card>

        <Card name="Control heights" tag="--ctl-h" tall>
          <div style={{ display:'flex', flexDirection:'column', gap:8, width:'100%', maxWidth:200 }}>
            <button className="btn" style={{ height:'var(--ctl-h-lg)' }}>Large · 38</button>
            <button className="btn">Default · 34</button>
            <button className="btn btn-sm">Small · 28</button>
          </div>
        </Card>

        <Card name="Radii" tag="--ctl-radius" tall>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            {[4,6,8,12].map(r => (
              <div key={r} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <div style={{ width:48, height:48, background:'var(--tool-accent-soft)',
                              border:'1px solid var(--tool-border)', borderRadius:r }}/>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--tool-text-faint)' }}>{r}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
};

// ---------- 02 — Icons ----------
const IconsSection = () => {
  const names = ['overview','games','branding','team','keys','settings','back','chev',
                 'upload','crossword','wordgame','wordsearch','sudoku','desktop','phone',
                 'tablet','refresh','grid','expand','logout','eye'];
  return (
    <Section id="icons" num="02" title="Icons"
             desc="A tight 21-icon set. All inline SVG, 20×20 viewBox, currentColor stroke. Default render at 16px; nav uses 16, table actions use 14.">
      <div className="icon-grid">
        {names.map(n => (
          <div className="icon-cell" key={n}>
            <div className="ico-frame"><Icon name={n} size={20}/></div>
            <span className="ico-name">{n}</span>
          </div>
        ))}
      </div>
    </Section>
  );
};

// ---------- 03 — Buttons ----------
const ButtonsSection = () => (
  <Section id="buttons" num="03" title="Buttons"
           desc="Three intents: primary (one per surface), default, ghost. Three sizes share --ctl-h tokens so they line up next to inputs and selects.">
    <div className="lib-grid">
      <Card name="Primary" tag=".btn-primary">
        <div className="demo-row">
          <button className="btn btn-primary">Save changes</button>
          <button className="btn btn-primary" style={{ height:'var(--ctl-h-lg)' }}>Continue →</button>
        </div>
      </Card>
      <Card name="Default" tag=".btn">
        <div className="demo-row">
          <button className="btn">Cancel</button>
          <button className="btn"><Icon name="upload" size={14}/>Upload</button>
        </div>
      </Card>
      <Card name="Ghost" tag=".btn-ghost">
        <div className="demo-row">
          <button className="btn btn-ghost">Discard</button>
          <button className="btn btn-ghost"><Icon name="back" size={14}/>Back</button>
        </div>
      </Card>
      <Card name="Sizes" tag=".btn-sm / lg">
        <div className="demo-row">
          <button className="btn btn-primary" style={{ height:'var(--ctl-h-lg)' }}>38</button>
          <button className="btn btn-primary">34</button>
          <button className="btn btn-primary btn-sm">28</button>
        </div>
      </Card>
      <Card name="Icon button" tag=".tool-icon-btn">
        <div className="demo-row">
          <button className="tool-icon-btn"><Icon name="eye" size={14}/></button>
          <button className="tool-icon-btn"><Icon name="refresh" size={14}/></button>
          <button className="tool-icon-btn"><Icon name="settings" size={14}/></button>
        </div>
      </Card>
      <Card name="Disabled" tag=":disabled">
        <div className="demo-row">
          <button className="btn btn-primary" disabled style={{ opacity:0.5, cursor:'not-allowed' }}>Save</button>
          <button className="btn" disabled style={{ opacity:0.5, cursor:'not-allowed' }}>Cancel</button>
        </div>
      </Card>
    </div>
  </Section>
);

// ---------- 04 — Inputs ----------
const InputsSection = () => {
  const [n, setN] = useState(7);
  return (
    <Section id="inputs" num="04" title="Inputs"
             desc="Text, mono, textarea, and the segmented number-stepper. All share the same focus ring (rust at 18% alpha) and the 34px height.">
      <div className="lib-grid">
        <Card name="Text input" tag=".input">
          <div className="demo-stack">
            <input className="input" defaultValue="Friday crossword"/>
            <input className="input" placeholder="Placeholder…"/>
          </div>
        </Card>
        <Card name="Mono input" tag=".input-mono">
          <div className="demo-stack">
            <input className="input input-mono" defaultValue="BRAIN"/>
            <input className="input input-mono" placeholder="WORD"/>
          </div>
        </Card>
        <Card name="Textarea" tag=".textarea" tall>
          <textarea className="textarea" defaultValue={`A multi-line\nclue or hint goes\nhere.`}
                    style={{ width:'100%', maxWidth:240, minHeight:90 }}/>
        </Card>
        <Card name="Number stepper" tag=".input-num">
          <div className="input-num">
            <button onClick={() => setN(Math.max(0, n-1))}>−</button>
            <input value={n} onChange={e => setN(Number(e.target.value)||0)}/>
            <button onClick={() => setN(n+1)}>+</button>
          </div>
        </Card>
        <Card name="Search" tag=".input + icon" wide>
          <div style={{ position:'relative', width:'100%', maxWidth:340 }}>
            <input className="input" placeholder="Search games…" style={{ paddingLeft:32 }}/>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)',
                           color:'var(--tool-text-faint)', display:'grid', placeItems:'center' }}>
              <svg width="14" height="14" viewBox="0 0 16 16">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
        </Card>
      </div>
    </Section>
  );
};

// ---------- 05 — Selects ----------
const SelectsSection = () => {
  const [s1, setS1] = useState('draft');
  const [s2, setS2] = useState('easy');
  return (
    <Section id="selects" num="05" title="Selects"
             desc="Native select for plain enums. IconSelect for richer state — supports a glyph + label + sub-label and custom search. Pick native unless the option needs visual context.">
      <div className="lib-grid">
        <Card name="Native select" tag=".select">
          <div className="demo-stack">
            <select className="select">
              <option>Crossword</option>
              <option>Wordsearch</option>
              <option>Sudoku</option>
            </select>
          </div>
        </Card>
        <Card name="IconSelect · status" tag="<IconSelect/>" tall>
          <div style={{ width:200 }}>
            <IconSelect value={s1} onChange={setS1} options={STATUS_OPTIONS}/>
          </div>
        </Card>
        <Card name="IconSelect · difficulty" tag="<IconSelect/>" tall>
          <div style={{ width:200 }}>
            <IconSelect value={s2} onChange={setS2} options={DIFFICULTY_OPTIONS}/>
          </div>
        </Card>
        <Card name="Status pill" tag="<StatusPill/>">
          <div className="demo-row">
            <StatusPill s="published"/>
            <StatusPill s="draft"/>
            <StatusPill s="scheduled"/>
          </div>
        </Card>
        <Card name="Difficulty dots" tag="<DifficultyDots/>">
          <div className="demo-row">
            <DifficultyDots d="easy"/>
            <DifficultyDots d="medium"/>
            <DifficultyDots d="hard"/>
          </div>
        </Card>
      </div>
    </Section>
  );
};

// ---------- 06 — Navigation ----------
const NavSection = () => (
  <Section id="nav" num="06" title="Navigation"
           desc="Sidebar rail, topbar with breadcrumbs, and the inspector tab strip. The rail uses 16px icons; active items shift to the rust-soft surface and rust text.">
    <div className="lib-grid">
      <Card name="Sidebar nav" tag=".nav" xl wide>
        <div style={{ width:240, display:'flex', flexDirection:'column', gap:2,
                      padding:12, background:'var(--tool-surface)', border:'1px solid var(--tool-border)',
                      borderRadius:8, alignSelf:'flex-start' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'4px 6px 14px' }}>
            <div style={{ width:26, height:26, borderRadius:6, background:'var(--tool-accent)',
                          color:'white', display:'grid', placeItems:'center',
                          fontFamily:'var(--font-mono)', fontWeight:700, fontSize:12 }}>R</div>
            <div style={{ fontWeight:600, fontSize:13.5 }}>Rustycogs</div>
          </div>
          <a className="nav-item active"><Icon name="overview" size={16}/>Overview</a>
          <a className="nav-item"><Icon name="games" size={16}/>Games</a>
          <a className="nav-item"><Icon name="branding" size={16}/>Branding</a>
          <a className="nav-item"><Icon name="team" size={16}/>Team</a>
          <a className="nav-item"><Icon name="keys" size={16}/>API keys</a>
          <a className="nav-item"><Icon name="settings" size={16}/>Settings</a>
        </div>
      </Card>

      <Card name="Topbar / breadcrumbs" tag=".topbar" wide>
        <div style={{ width:'100%', maxWidth:560, background:'var(--tool-surface)',
                      border:'1px solid var(--tool-border)', borderRadius:8 }}>
          <div className="topbar" style={{ borderRadius:8, borderBottom:'none' }}>
            <button className="topbar-back"><Icon name="back" size={14}/>Games</button>
            <div className="topbar-crumbs">
              <span>Friday crossword</span>
              <span className="sep">/</span>
              <span className="draft"><span className="dot"/>Draft</span>
            </div>
            <div className="topbar-spacer"/>
            <div className="topbar-actions">
              <button className="btn btn-ghost btn-sm">Discard</button>
              <button className="btn btn-primary btn-sm">Publish</button>
            </div>
          </div>
        </div>
      </Card>

      <Card name="Inspector tabs" tag=".inspector-tab" wide>
        <div style={{ width:'100%', maxWidth:360, background:'var(--tool-surface)',
                      border:'1px solid var(--tool-border)', borderRadius:8 }}>
          <div className="inspector-tabs">
            <button className="inspector-tab active">Tokens <span className="count">12</span></button>
            <button className="inspector-tab">Type <span className="count">4</span></button>
            <button className="inspector-tab">Logo</button>
          </div>
        </div>
      </Card>
    </div>
  </Section>
);

// ---------- 07 — Layout (sections, fields, preset chips) ----------
const LayoutSection = () => (
  <Section id="layout" num="07" title="Layout"
           desc="Inspector section accordion, field rows with labels + hints, and the preset chip rail. These compose into the left rail of every editor.">
    <div className="lib-grid">
      <Card name="Inspector section" tag=".section" xl>
        <div style={{ width:260, alignSelf:'flex-start',
                      background:'var(--tool-surface)', border:'1px solid var(--tool-border)', borderRadius:8 }}>
          <div className="section open">
            <div className="section-head">
              <Icon name="chev" size={10}/>
              <span>Color tokens</span>
              <span className="badge">12</span>
            </div>
            <div style={{ padding:'4px 12px 12px' }}>
              <div className="token-row">
                <div className="token-swatch" style={{ background:'#c2410c' }}/>
                <input className="token-input" defaultValue="--accent"/>
                <span className="uses">14×</span>
              </div>
              <div className="token-row" style={{ marginTop:6 }}>
                <div className="token-swatch" style={{ background:'#1a1814' }}/>
                <input className="token-input" defaultValue="--text"/>
                <span className="uses">42×</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card name="Field row" tag=".field-row" tall>
        <div style={{ width:240, display:'flex', flexDirection:'column', gap:6 }}>
          <div className="field-label">
            <span>Logo size</span>
            <span className="hint">px</span>
          </div>
          <input className="input" defaultValue="42"/>
        </div>
      </Card>

      <Card name="Preset chips" tag=".preset-chip" wide>
        <div className="preset-bar" style={{ width:'100%', maxWidth:480, borderRadius:8,
                                              border:'1px solid var(--tool-border)' }}>
          <div className="preset-bar-label">Workspace presets</div>
          <div className="preset-chips">
            {[['Default','#9ca3af'],['Rust','#c2410c',true],['Plum','#7e22ce'],['Forest','#15803d']]
              .map(([l,c,active]) => (
                <button key={l} className={`preset-chip ${active?'active':''}`}>
                  <span className="preset-swatch" style={{ width:18, height:18, borderRadius:4, background:c }}/>
                  {l}
                </button>
              ))}
          </div>
        </div>
      </Card>
    </div>
  </Section>
);

// ---------- 08 — Status & data ----------
const DataSection = () => (
  <Section id="data" num="08" title="Status & data"
           desc="Display chips and small data viz used in tables and rows: status pills, difficulty dots, the Wordle-style tile mini-row.">
    <div className="lib-grid">
      <Card name="Filter chip" tag=".filter-chip">
        <div className="demo-row">
          <button className="filter-chip active">All <span className="count">142</span></button>
          <button className="filter-chip">Published <span className="count">98</span></button>
          <button className="filter-chip">Draft <span className="count">32</span></button>
        </div>
      </Card>
      <Card name="Tile row" tag=".gtbl-tiles">
        <div className="gtbl-tiles">
          <span className="t correct">B</span>
          <span className="t correct">R</span>
          <span className="t present">A</span>
          <span className="t">I</span>
          <span className="t">N</span>
        </div>
      </Card>
      <Card name="Title cell" tag="<TitleCell/>" wide>
        <div style={{ width:'100%', maxWidth:380 }}>
          <TitleCell title="Friday crossword" sub="22 × 22 · 78 clues" iconName="crossword"/>
        </div>
      </Card>
    </div>
  </Section>
);

// ---------- 09 — Chrome (workspace canvas) ----------
const ChromeSection = () => (
  <Section id="chrome" num="09" title="Chrome"
           desc="The workspace canvas: dotted background, viewport zoom controls, the device-mode toggle. Used in the branding tool.">
    <div className="lib-grid">
      <Card name="Dotted canvas" tag=".workspace" wide xl>
        <div style={{ width:'100%', height:240,
                      background:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.07) 1px, transparent 0) 0 0 / 18px 18px, #faf8f5',
                      border:'1px solid var(--tool-border)', borderRadius:8,
                      display:'grid', placeItems:'center', position:'relative' }}>
          <div style={{ width:200, height:140, background:'white', borderRadius:8,
                        boxShadow:'0 8px 24px rgba(0,0,0,0.08)', border:'1px solid var(--tool-border)' }}/>
          <div style={{ position:'absolute', bottom:10, right:10, display:'flex', gap:4,
                        background:'white', border:'1px solid var(--tool-border)',
                        borderRadius:6, padding:3 }}>
            <button className="tool-icon-btn"><Icon name="desktop" size={14}/></button>
            <button className="tool-icon-btn" style={{ background:'var(--tool-accent-soft)', color:'var(--tool-accent)' }}><Icon name="tablet" size={14}/></button>
            <button className="tool-icon-btn"><Icon name="phone" size={14}/></button>
          </div>
        </div>
      </Card>

      <Card name="Zoom control" tag=".zoom-control">
        <div style={{ display:'inline-flex', background:'var(--tool-surface)',
                      border:'1px solid var(--tool-border)', borderRadius:6,
                      fontFamily:'var(--font-mono)', fontSize:12 }}>
          <button className="tool-icon-btn" style={{ borderRadius:0 }}>−</button>
          <span style={{ padding:'0 12px', display:'grid', placeItems:'center', minWidth:48 }}>100%</span>
          <button className="tool-icon-btn" style={{ borderRadius:0 }}>+</button>
        </div>
      </Card>

      <Card name="Device toggle" tag="device-mode">
        <div style={{ display:'inline-flex', background:'var(--tool-surface)',
                      border:'1px solid var(--tool-border)', borderRadius:6, padding:3, gap:2 }}>
          <button className="tool-icon-btn"><Icon name="desktop" size={14}/></button>
          <button className="tool-icon-btn" style={{ background:'var(--tool-accent-soft)', color:'var(--tool-accent)' }}><Icon name="tablet" size={14}/></button>
          <button className="tool-icon-btn"><Icon name="phone" size={14}/></button>
        </div>
      </Card>
    </div>
  </Section>
);

// ---------- 10 — Overlay (modal) ----------
const OverlaySection = () => (
  <Section id="overlay" num="10" title="Overlay"
           desc="Modal dialog. Always centered, uses a 40% black scrim. Three variants: simple, with-tabs (for stepper flows), and wide (for the AI cluemaster).">
    <div className="lib-grid">
      <Card name="Modal · simple" tag=".modal" wide xl>
        <div className="modal" style={{ position:'relative', maxWidth:420, animation:'none' }}>
          <div className="modal-head">
            <div>
              <h3 className="modal-title">Delete game?</h3>
              <p className="modal-sub">"Friday crossword" will be removed permanently.</p>
            </div>
            <button className="modal-close"><Icon name="back" size={12}/></button>
          </div>
          <div className="modal-foot">
            <button className="btn btn-ghost">Cancel</button>
            <button className="btn btn-primary">Delete</button>
          </div>
        </div>
      </Card>

      <Card name="Modal · with tabs" tag=".modal-tabs" wide xl>
        <div className="modal" style={{ position:'relative', maxWidth:520, animation:'none' }}>
          <div className="modal-head">
            <div>
              <h3 className="modal-title">New crossword</h3>
              <p className="modal-sub">Set up the grid, then add clues.</p>
            </div>
            <button className="modal-close"><Icon name="back" size={12}/></button>
          </div>
          <div className="modal-tabs">
            <button className="modal-tab active"><span className="step-num">1</span>Setup</button>
            <button className="modal-tab"><span className="step-num">2</span>Clues</button>
            <button className="modal-tab"><span className="step-num">3</span>Review</button>
          </div>
          <div className="modal-body">
            <div className="field-label-block">Title</div>
            <input className="input" defaultValue="Friday crossword" style={{ marginBottom:12 }}/>
            <div className="field-label-block">Difficulty</div>
            <div className="demo-row" style={{ justifyContent:'flex-start' }}>
              <DifficultyDots d="medium"/>
              <span style={{ fontSize:13 }}>Medium</span>
            </div>
          </div>
          <div className="modal-foot">
            <button className="btn btn-ghost">Cancel</button>
            <button className="btn btn-primary">Continue →</button>
          </div>
        </div>
      </Card>
    </div>
  </Section>
);

// ---------- 11 — Tables ----------
const TablesSection = () => (
  <Section id="tables" num="11" title="Tables"
           desc="Games list table. Hover reveals row actions; cells use the title-cell helper; pagination sits below in a dedicated bar.">
    <div className="lib-grid">
      <Card name="Games table" tag=".gtbl" wide xl>
        <div style={{ width:'100%', background:'var(--tool-surface)',
                      border:'1px solid var(--tool-border)', borderRadius:8, overflow:'hidden' }}>
          <table className="gtbl">
            <thead>
              <tr style={{ background:'var(--tool-surface-2)' }}>
                <th style={{ textAlign:'left', padding:'10px 14px', fontSize:11,
                              textTransform:'uppercase', letterSpacing:'0.06em',
                              color:'var(--tool-text-faint)', fontWeight:500 }}>Title</th>
                <th style={{ textAlign:'left', padding:'10px 14px', fontSize:11,
                              textTransform:'uppercase', letterSpacing:'0.06em',
                              color:'var(--tool-text-faint)', fontWeight:500 }}>Status</th>
                <th style={{ textAlign:'left', padding:'10px 14px', fontSize:11,
                              textTransform:'uppercase', letterSpacing:'0.06em',
                              color:'var(--tool-text-faint)', fontWeight:500 }}>Difficulty</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {[
                ['Friday crossword', 'crossword', 'published', 'medium'],
                ['Animal wordsearch', 'wordsearch', 'draft', 'easy'],
                ['Daily sudoku', 'sudoku', 'scheduled', 'hard'],
              ].map(([t, ic, st, df]) => (
                <tr key={t} style={{ borderTop:'1px solid var(--tool-border)' }}>
                  <td style={{ padding:'10px 14px' }}><TitleCell title={t} sub="updated 2h ago" iconName={ic}/></td>
                  <td style={{ padding:'10px 14px' }}><StatusPill s={st}/></td>
                  <td style={{ padding:'10px 14px' }}><DifficultyDots d={df}/></td>
                  <td style={{ padding:'10px 14px', textAlign:'right' }}><RowActions/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </Section>
);

// ---------- 12 — Code blocks ----------
const tokenize = (src) => {
  // Very simple highlighter for HTML-ish snippets.
  return src
    .replace(/(&)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\/\/.*$)/gm, '<span class="com">$1</span>')
    .replace(/("[^"]*")/g, '<span class="str">$1</span>')
    .replace(/(--[a-z-]+)/g, '<span class="key">$1</span>');
};

const CodeBlock = ({ lang, children }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="code">
      <div className="code-head">
        <span className="code-lang">{lang}</span>
        <button className={`code-copy ${copied?'copied':''}`} onClick={onCopy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="code-body" dangerouslySetInnerHTML={{ __html: tokenize(children) }}/>
    </div>
  );
};

const CodeSection = () => (
  <Section id="code" num="12" title="Code blocks"
           desc="Used in the developer handoff and shadcn integration. Dark surface, JetBrains Mono, copy-button affordance with confirmed state.">
    <div className="lib-grid">
      <Card name="Code · CSS" tag=".code" wide xl>
        <div style={{ width:'100%' }}>
          <CodeBlock lang="css">{`:root {
  --tool-accent: #c2410c;
  --tool-bg: #faf8f5;
  --ctl-h: 34px;
}

.btn-primary {
  background: var(--tool-accent);
  color: white;
  height: var(--ctl-h);
}`}</CodeBlock>
        </div>
      </Card>
    </div>
  </Section>
);

// ---------- 13 — Words list ----------
const WordsSection = () => {
  const [items, setItems] = useState([
    { word: 'BRAIN', hint: 'Organ of thought' },
    { word: 'CLEVER', hint: 'Sharp-witted', ai: true },
    { word: 'PUZZLE', hint: '' },
  ]);
  return (
    <Section id="words" num="13" title="Words list"
             desc="The clue/word editor used in crossword and wordsearch builders. Click a row to edit in place; AI-generated rows show a small wordmark until the user touches them.">
      <div className="lib-grid">
        <Card name="WordChipList" tag="<WordChipList/>" wide xl>
          <div style={{ width:'100%', maxWidth:520 }}>
            <WordChipList
              items={items}
              onUpdate={(i, next) => setItems(items.map((x,idx) => idx===i ? {...x,...next,ai:false} : x))}
              onRemove={(i) => setItems(items.filter((_,idx) => idx!==i))}
              hintLabel="Clue"
            />
          </div>
        </Card>
        <Card name="WordHintInput" tag="<WordHintInput/>" wide>
          <div style={{ width:'100%', maxWidth:520 }}>
            <WordHintInput onAdd={(w) => setItems([...items, w])} hintPlaceholder="Clue (optional)"/>
          </div>
        </Card>
      </div>
    </Section>
  );
};

// ---------- 14 — AI generate ----------
const AISection = () => {
  const [accepted, setAccepted] = useState([]);
  return (
    <Section id="ai" num="14" title="AI generate"
             desc="Inline AI bar. Topic chip is editable in place; language is one click on the right; results stream into the words list.">
      <div className="lib-grid">
        <Card name="AIGeneratePanel" tag="<AIGeneratePanel/>" wide xl>
          <div style={{ width:'100%', maxWidth:560 }}>
            <AIGeneratePanel
              context="brain games"
              existingWords={accepted.map(x => x.word)}
              onAccept={(items) => setAccepted([...accepted, ...items])}
              defaultLang="en"
            />
            {accepted.length > 0 && (
              <div style={{ marginTop:14, fontSize:12, color:'var(--tool-text-faint)' }}>
                {accepted.length} accepted →{' '}
                {accepted.slice(-3).map(x => x.word).join(', ')}
                {accepted.length > 3 && '…'}
              </div>
            )}
          </div>
        </Card>
      </div>
    </Section>
  );
};

// ---------- 15 — shadcn integration ----------
const ShadcnSection = () => {
  const [tab, setTab] = useState('setup');
  return (
    <Section id="shadcn" num="15" title="shadcn integration"
             desc="How to use these tokens with shadcn/ui. The Rustycogs tokens map cleanly onto shadcn's CSS-variable theme; you keep shadcn's component API, we provide the look.">
      <div className="shadcn-tabs">
        {[['setup','Setup'],['mapping','Token mapping'],['components','Component overrides']]
          .map(([id,label]) => (
            <button key={id} className={`shadcn-tab ${tab===id?'active':''}`} onClick={() => setTab(id)}>{label}</button>
          ))}
      </div>

      {tab === 'setup' && (
        <div>
          <div className="shadcn-step">
            <div className="shadcn-step-num">1</div>
            <div className="shadcn-step-body">
              <h4>Install shadcn/ui</h4>
              <p>Initialize shadcn in your Next.js or Vite app the usual way. Pick "Default" style and "Neutral" base color — we'll override the palette below.</p>
              <CodeBlock lang="bash">{`npx shadcn@latest init`}</CodeBlock>
            </div>
          </div>
          <div className="shadcn-step">
            <div className="shadcn-step-num">2</div>
            <div className="shadcn-step-body">
              <h4>Drop in our tokens</h4>
              <p>Replace the generated <code>:root</code> block in <code>globals.css</code> with the Rustycogs theme. Both light and dark hues are included; shadcn's <code>.dark</code> selector still applies.</p>
              <CodeBlock lang="css">{`@layer base {
  :root {
    --background: 36 33% 98%;
    --foreground: 30 14% 9%;
    --card: 0 0% 100%;
    --primary: 18 88% 41%;
    --primary-foreground: 0 0% 100%;
    --muted: 33 23% 93%;
    --muted-foreground: 28 9% 38%;
    --border: 36 23% 88%;
    --ring: 18 88% 41%;
    --radius: 0.375rem;
  }
}`}</CodeBlock>
            </div>
          </div>
          <div className="shadcn-step">
            <div className="shadcn-step-num">3</div>
            <div className="shadcn-step-body">
              <h4>Add fonts</h4>
              <p>shadcn defaults to system-ui. Pull Inter and JetBrains Mono in your root layout, then point Tailwind at them.</p>
              <CodeBlock lang="css">{`/* tailwind.config.ts */
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'ui-monospace'],
}`}</CodeBlock>
            </div>
          </div>
          <div className="shadcn-step">
            <div className="shadcn-step-num">4</div>
            <div className="shadcn-step-body">
              <h4>Generate components</h4>
              <p>Add the components you need. They'll render with our palette automatically because they read from the CSS variables above.</p>
              <CodeBlock lang="bash">{`npx shadcn@latest add button input select dialog table`}</CodeBlock>
            </div>
          </div>
        </div>
      )}

      {tab === 'mapping' && (
        <div>
          <p className="lib-section-desc" style={{ marginBottom:16 }}>
            shadcn uses HSL CSS variables. Each Rustycogs token has a direct shadcn equivalent —
            override the right-hand column and every shadcn component picks up the change.
          </p>
          <table className="shadcn-mapping-table">
            <thead>
              <tr>
                <th>Rustycogs token</th>
                <th>Hex</th>
                <th></th>
                <th>shadcn variable</th>
                <th>HSL value</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['--tool-bg', '#faf8f5', '--background', '36 33% 98%'],
                ['--tool-surface', '#ffffff', '--card', '0 0% 100%'],
                ['--tool-surface-2', '#f4f1ec', '--muted', '33 23% 93%'],
                ['--tool-border', '#e8e3da', '--border', '36 23% 88%'],
                ['--tool-text', '#1a1814', '--foreground', '30 14% 9%'],
                ['--tool-text-soft', '#6b6357', '--muted-foreground', '28 9% 38%'],
                ['--tool-accent', '#c2410c', '--primary', '18 88% 41%'],
                ['--tool-accent-soft', '#fdf2ea', '--accent', '24 90% 95%'],
                ['--tool-good', '#15803d', '--success', '142 71% 29%'],
                ['--tool-warn', '#b45309', '--warning', '28 92% 37%'],
              ].map(([rc, hex, sc, hsl]) => (
                <tr key={rc}>
                  <td className="mono">{rc}</td>
                  <td className="mono" style={{ color:'var(--tool-text-faint)' }}>{hex}</td>
                  <td className="arrow">→</td>
                  <td className="mono">{sc}</td>
                  <td className="mono" style={{ color:'var(--tool-text-faint)' }}>{hsl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'components' && (
        <div>
          <p className="lib-section-desc" style={{ marginBottom:16 }}>
            shadcn's defaults render close to ours after the token swap. A handful need component-level
            tweaks for an exact match — primarily height tokens and border-radius.
          </p>
          <div className="lib-grid">
            <Card name="Button height" tag="components/ui/button.tsx">
              <div className="demo-stack">
                <button className="btn btn-primary">Default · 34px</button>
                <span style={{ fontSize:11, color:'var(--tool-text-faint)', fontFamily:'var(--font-mono)' }}>
                  size="default" → h-9 (36) → h-[34px]
                </span>
              </div>
            </Card>
            <Card name="Input height" tag="components/ui/input.tsx">
              <div className="demo-stack">
                <input className="input" placeholder="Matches button"/>
                <span style={{ fontSize:11, color:'var(--tool-text-faint)', fontFamily:'var(--font-mono)' }}>
                  h-10 → h-[34px]
                </span>
              </div>
            </Card>
            <Card name="Border radius" tag="--radius" wide>
              <div className="demo-row">
                <div style={{ width:60, height:34, background:'var(--tool-accent-soft)',
                              border:'1px solid var(--tool-accent)', borderRadius:6,
                              display:'grid', placeItems:'center', fontSize:12 }}>6px</div>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--tool-text-faint)' }}>
                  shadcn default 0.5rem → 0.375rem
                </span>
              </div>
            </Card>
          </div>
          <div style={{ marginTop:18 }}>
            <CodeBlock lang="tsx">{`// components/ui/button.tsx — height override
const buttonVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md text-sm font-medium",
  {
    variants: {
      size: {
        default: "h-[34px] px-3.5",  // was h-9 px-4
        sm:      "h-[28px] px-2.5",
        lg:      "h-[38px] px-4",
      },
    },
  }
)`}</CodeBlock>
          </div>
        </div>
      )}
    </Section>
  );
};

// ---------- App ----------
const App = () => (
  <>
    <TokensSection/>
    <IconsSection/>
    <ButtonsSection/>
    <InputsSection/>
    <SelectsSection/>
    <NavSection/>
    <LayoutSection/>
    <DataSection/>
    <ChromeSection/>
    <OverlaySection/>
    <TablesSection/>
    <CodeSection/>
    <WordsSection/>
    <AISection/>
    <ShadcnSection/>
  </>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
