// Inspector — left-side controls. Compact, sectioned, with linked-token interactions.
const { useState: useStateI, useEffect: useEffectI } = React;

const PRESETS = [
  { id: 'rust',    name: 'Rust',    primary: '#c2410c', surface: '#fffaf5', text: '#1a1814' },
  { id: 'forest',  name: 'Forest',  primary: '#15803d', surface: '#f6faf6', text: '#0d1f14' },
  { id: 'cobalt',  name: 'Cobalt',  primary: '#1d4ed8', surface: '#f6f8ff', text: '#0c1330' },
  { id: 'plum',    name: 'Plum',    primary: '#7e22ce', surface: '#faf6ff', text: '#1f0e2e' },
  { id: 'graphite',name: 'Graphite',primary: '#4d4d4d', surface: '#ffffff', text: '#0f172a' },
  { id: 'sun',     name: 'Sun',     primary: '#b45309', surface: '#fffaf0', text: '#1f1608' },
  { id: 'rose',    name: 'Rose',    primary: '#be185d', surface: '#fff5f8', text: '#2a0c18' },
  { id: 'ink',     name: 'Ink',     primary: '#0f172a', surface: '#f8fafc', text: '#0f172a' },
];

const FONT_OPTIONS = [
  { v: 'Inter',     label: 'Inter (default)' },
  { v: 'Helvetica', label: 'Helvetica' },
  { v: 'system-ui', label: 'System UI' },
  { v: 'Geist',     label: 'Geist' },
  { v: 'IBM Plex Sans', label: 'IBM Plex Sans' },
];
const SERIF_OPTIONS = [
  { v: 'Fraunces', label: 'Fraunces (default)' },
  { v: 'Georgia',  label: 'Georgia' },
  { v: 'Lora',     label: 'Lora' },
  { v: 'Crimson Pro', label: 'Crimson Pro' },
];

// ---------- Section primitive ----------
const Section = ({ title, badge, children, defaultOpen = true }) => {
  const [open, setOpen] = useStateI(defaultOpen);
  return (
    <div className={`section ${open ? 'open' : ''}`}>
      <button className="section-head" onClick={() => setOpen(!open)}>
        <Icon name="chev" size={10} />
        <span>{title}</span>
        {badge && <span className="badge">{badge}</span>}
      </button>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
};

// ---------- Color token row ----------
const TokenRow = ({ tokenKey, value, uses, onChange, onHover, onLeave, isLinked }) => (
  <div
    className={`token-row ${isLinked ? 'linked' : ''}`}
    onMouseEnter={() => onHover && onHover(tokenKey)}
    onMouseLeave={() => onLeave && onLeave()}
  >
    <div className="token-swatch" style={{ '--c': value }}>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
    <input
      className="token-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {uses && <span className="uses">{uses}</span>}
  </div>
);

// ---------- Inspector ----------
const Inspector = ({ tokens, setTokens, hoveredToken, setHoveredToken, activeTab, setActiveTab }) => {
  const set = (k, v) => setTokens(t => ({ ...t, [k]: v }));
  const applyPreset = (p) => setTokens(t => ({
    ...t,
    primary: p.primary,
    surface: p.surface,
    text: p.text,
    preset: p.id,
  }));

  const tabs = [
    { id: 'design', label: 'Design', count: 14 },
    { id: 'identity', label: 'Identity' },
    { id: 'components', label: 'Components' },
  ];

  return (
    <aside className="inspector">
      <div className="inspector-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`inspector-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
            {t.count && <span className="count">{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="inspector-body">

        {activeTab === 'design' && (
          <>
            <div className="preset-bar">
              <div className="preset-bar-label">Preset themes</div>
              <div className="preset-grid">
                {PRESETS.map(p => (
                  <button
                    key={p.id}
                    className={`preset-chip ${tokens.preset === p.id ? 'active' : ''}`}
                    onClick={() => applyPreset(p)}
                  >
                    <div className="preset-swatch">
                      <span style={{ background: p.primary }}></span>
                      <span style={{ background: p.surface }}></span>
                      <span style={{ background: p.text }}></span>
                    </div>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <Section title="Colors" badge="3 tokens">
              <div className="field">
                <label className="field-label">Primary <span className="hint">brand accent</span></label>
                <TokenRow
                  tokenKey="primary"
                  value={tokens.primary}
                  uses="14×"
                  onChange={(v) => set('primary', v)}
                  onHover={setHoveredToken} onLeave={() => setHoveredToken(null)}
                  isLinked={hoveredToken === 'primary'}
                />
              </div>
              <div className="field">
                <label className="field-label">Surface <span className="hint">backgrounds</span></label>
                <TokenRow
                  tokenKey="surface"
                  value={tokens.surface}
                  uses="22×"
                  onChange={(v) => set('surface', v)}
                  onHover={setHoveredToken} onLeave={() => setHoveredToken(null)}
                  isLinked={hoveredToken === 'surface'}
                />
              </div>
              <div className="field">
                <label className="field-label">Text <span className="hint">body + headings</span></label>
                <TokenRow
                  tokenKey="text"
                  value={tokens.text}
                  uses="31×"
                  onChange={(v) => set('text', v)}
                  onHover={setHoveredToken} onLeave={() => setHoveredToken(null)}
                  isLinked={hoveredToken === 'text'}
                />
              </div>
            </Section>

            <Section title="Typography" badge="2 fonts">
              <div className="field">
                <label className="field-label">Sans (UI)</label>
                <select
                  className="select"
                  value={tokens.fontSans}
                  onChange={(e) => set('fontSans', e.target.value)}
                  onMouseEnter={() => setHoveredToken('font-sans')}
                  onMouseLeave={() => setHoveredToken(null)}
                >
                  {FONT_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Serif (display)</label>
                <select
                  className="select"
                  value={tokens.fontSerif}
                  onChange={(e) => set('fontSerif', e.target.value)}
                  onMouseEnter={() => setHoveredToken('font-serif')}
                  onMouseLeave={() => setHoveredToken(null)}
                >
                  {SERIF_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Type scale</label>
                <div className="segmented" style={{ '--cols': 3 }}>
                  {['Compact','Default','Large'].map(v => (
                    <button
                      key={v}
                      className={tokens.scale === v ? 'active' : ''}
                      onClick={() => set('scale', v)}
                    >{v}</button>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Shape & spacing" badge="2 tokens">
              <div className="field">
                <label className="field-label">
                  Corner radius
                  <span className="hint">{tokens.radius}px</span>
                </label>
                <div className="slider-wrap">
                  <input
                    type="range"
                    className="slider"
                    min="0" max="40"
                    value={tokens.radius}
                    onChange={(e) => set('radius', +e.target.value)}
                    onMouseEnter={() => setHoveredToken('radius')}
                    onMouseLeave={() => setHoveredToken(null)}
                  />
                  <span className="slider-value">{tokens.radius}px</span>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Density</label>
                <div className="segmented" style={{ '--cols': 3 }}>
                  {['Compact','Comfortable','Spacious'].map(v => (
                    <button
                      key={v}
                      className={tokens.density === v ? 'active' : ''}
                      onClick={() => set('density', v)}
                    >{v}</button>
                  ))}
                </div>
              </div>
            </Section>
          </>
        )}

        {activeTab === 'identity' && (
          <>
            <Section title="Logo" badge="2 marks">
              <div className="field">
                <label className="field-label">Logo (light surfaces)</label>
                <button className="dropzone">
                  <span className="dropzone-ico"><Icon name="upload" size={16}/></span>
                  <span className="dropzone-meta">
                    <strong>Drop or browse</strong>
                    <span>SVG · PNG · max 2MB</span>
                  </span>
                </button>
              </div>
              <div className="field">
                <label className="field-label">Logo (dark surfaces)</label>
                <button className="dropzone">
                  <span className="dropzone-ico"><Icon name="upload" size={16}/></span>
                  <span className="dropzone-meta">
                    <strong>Drop or browse</strong>
                    <span>SVG · PNG · max 2MB</span>
                  </span>
                </button>
              </div>
              <div className="field">
                <label className="field-label">Favicon</label>
                <button className="dropzone">
                  <span className="dropzone-ico"><Icon name="upload" size={16}/></span>
                  <span className="dropzone-meta">
                    <strong>Drop or browse</strong>
                    <span>32×32 ICO / PNG</span>
                  </span>
                </button>
              </div>
            </Section>

            <Section title="Voice" badge="">
              <div className="field">
                <label className="field-label">Display name</label>
                <input className="select" style={{textAlign:'left', paddingLeft:10, backgroundImage:'none'}} defaultValue="Brand sampler" />
              </div>
              <div className="field">
                <label className="field-label">Tagline</label>
                <input className="select" style={{textAlign:'left', paddingLeft:10, backgroundImage:'none'}} defaultValue="Daily puzzles for your audience" />
              </div>
            </Section>
          </>
        )}

        {activeTab === 'components' && (
          <>
            <Section title="Buttons">
              <div className="field">
                <label className="field-label">Primary variant</label>
                <div className="variant-grid">
                  {[
                    { id: 'b-solid',   label: 'Solid' },
                    { id: 'b-outline', label: 'Outline' },
                    { id: 'b-soft',    label: 'Soft' },
                  ].map(v => (
                    <button
                      key={v.id}
                      className={`variant-card ${tokens.buttonVariant === v.id ? 'active' : ''}`}
                      onClick={() => set('buttonVariant', v.id)}
                      onMouseEnter={() => setHoveredToken('button-variant')}
                      onMouseLeave={() => setHoveredToken(null)}
                    >
                      <span
                        className="variant-preview"
                        style={{
                          background: v.id === 'b-solid' ? tokens.primary : (v.id === 'b-soft' ? `color-mix(in oklab, ${tokens.primary} 18%, ${tokens.surface})` : 'transparent'),
                          color: v.id === 'b-solid' ? '#fff' : tokens.primary,
                          border: v.id === 'b-outline' ? `1.5px solid ${tokens.primary}` : 'none',
                          borderRadius: Math.min(tokens.radius * 0.4, 12) + 'px',
                        }}
                      >
                        Aa
                      </span>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Cells & tiles">
              <div className="field">
                <label className="field-label">Tile fill</label>
                <div className="segmented" style={{ '--cols': 3 }}>
                  {['Flat','Soft','Bordered'].map(v => (
                    <button key={v} className={tokens.tile === v ? 'active' : ''} onClick={() => set('tile', v)}>{v}</button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="field-label">Highlight style</label>
                <div className="segmented" style={{ '--cols': 2 }}>
                  {['Fill','Underline'].map(v => (
                    <button key={v} className={tokens.highlight === v ? 'active' : ''} onClick={() => set('highlight', v)}>{v}</button>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Sound & motion">
              <div className="field">
                <label className="field-label">Reduce motion</label>
                <div className="segmented" style={{ '--cols': 2 }}>
                  {['Off','On'].map(v => (
                    <button key={v} className={tokens.motion === v ? 'active' : ''} onClick={() => set('motion', v)}>{v}</button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label className="field-label">Tap sound</label>
                <div className="segmented" style={{ '--cols': 3 }}>
                  {['None','Soft','Crisp'].map(v => (
                    <button key={v} className={tokens.tapSound === v ? 'active' : ''} onClick={() => set('tapSound', v)}>{v}</button>
                  ))}
                </div>
              </div>
            </Section>
          </>
        )}

      </div>
    </aside>
  );
};

window.Inspector = Inspector;
