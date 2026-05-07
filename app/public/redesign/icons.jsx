// Inline SVG icon set for the tool. Stroke icons, 16px default.
const Icon = ({ name, size = 16, className = '' }) => {
  const paths = {
    overview: <path d="M3 12h4V4H3v8zm0 5h4v-3H3v3zm6 0h4V9H9v8zm6-13v3h4V4h-4zm0 13h4V9h-4v8z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    games: <><rect x="2.5" y="6" width="17" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M7 11h2M8 10v2M14 10.5h.01M16 12h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></>,
    branding: <><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M11 4.5v3M11 14.5v3M4.5 11h3M14.5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></>,
    team: <><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M2.5 17c.6-2.6 2.8-4.5 5.5-4.5s4.9 1.9 5.5 4.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/><circle cx="14.5" cy="6.5" r="2.2" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M14 12c2 .2 3.6 1.4 4.4 3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/></>,
    keys: <><circle cx="7" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M10.5 11h7m-2 0v2.5m-2-2.5v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></>,
    settings: <><circle cx="11" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M11 3v2m0 12v2m6-8h2M3 11h2m11.3-5.3l1.4-1.4M4.3 17.7l1.4-1.4m0-10.6L4.3 4.3m13.4 13.4l-1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></>,
    back: <path d="M11 4l-5 5 5 5M6.5 9h9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    chev: <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    upload: <><path d="M10 13V4M6.5 7.5L10 4l3.5 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.5 13v2.5A1.5 1.5 0 005 17h10a1.5 1.5 0 001.5-1.5V13" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/></>,
    crossword: <><rect x="2.5" y="2.5" width="15" height="15" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M2.5 7.5h15M2.5 12.5h15M7.5 2.5v15M12.5 2.5v15" stroke="currentColor" strokeWidth="1" /><rect x="2.5" y="7.5" width="5" height="5" fill="currentColor" opacity="0.15"/></>,
    wordgame: <><rect x="3" y="4" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3" fill="none"/><rect x="8.5" y="4" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3" fill="currentColor" opacity="0.6"/><rect x="14" y="4" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3" fill="none"/><rect x="3" y="9.5" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3" fill="currentColor" opacity="0.6"/><rect x="8.5" y="9.5" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3" fill="none"/><rect x="14" y="9.5" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3" fill="none"/></>,
    wordsearch: <><rect x="2.5" y="2.5" width="15" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/><text x="5.5" y="9" fontSize="5" fontFamily="monospace" fill="currentColor">A</text><text x="10" y="9" fontSize="5" fontFamily="monospace" fill="currentColor">B</text><text x="14" y="9" fontSize="5" fontFamily="monospace" fill="currentColor">C</text><text x="5.5" y="15" fontSize="5" fontFamily="monospace" fill="currentColor">D</text><text x="10" y="15" fontSize="5" fontFamily="monospace" fill="currentColor">E</text><text x="14" y="15" fontSize="5" fontFamily="monospace" fill="currentColor">F</text></>,
    sudoku: <><rect x="2.5" y="2.5" width="15" height="15" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M7.5 2.5v15M12.5 2.5v15M2.5 7.5h15M2.5 12.5h15" stroke="currentColor" strokeWidth="1"/></>,
    desktop: <><rect x="2" y="3.5" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M7 18h6M10 14.5V18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></>,
    phone: <><rect x="6" y="2" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M9 5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>,
    tablet: <><rect x="4" y="2.5" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/><circle cx="10" cy="14.5" r="0.7" fill="currentColor"/></>,
    refresh: <><path d="M4 10a6 6 0 0110.5-4M16 4v3.5h-3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 10a6 6 0 01-10.5 4M4 16v-3.5h3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    grid: <><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none"/><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none"/><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none"/><rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none"/></>,
    expand: <path d="M4 8V4h4M16 8V4h-4M4 12v4h4M16 12v4h-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    logout: <><path d="M11 14v2.5a1 1 0 01-1 1H4.5a1 1 0 01-1-1v-13a1 1 0 011-1H10a1 1 0 011 1V6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/><path d="M8 10h9m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    eye: <><path d="M2.5 10s2.5-5 7.5-5 7.5 5 7.5 5-2.5 5-7.5 5-7.5-5-7.5-5z" stroke="currentColor" strokeWidth="1.4" fill="none"/><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
  };
  return (
    <svg className={`ico ${className}`} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

window.Icon = Icon;
