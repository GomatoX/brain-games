/**
 * Client Branding Configuration
 *
 * Maps branding data from the API to CSS custom properties
 * and applies them to game container elements.
 */

/**
 * Mapping from branding field names to CSS custom property names.
 * Each entry maps a branding API field → one or more CSS variables.
 */
const SCALE_VARS = {
  compact: { "--text-sm": "0.8125rem", "--text-base": "0.9375rem", "--text-lg": "1.0625rem", "--text-xl": "1.25rem" },
  default: { "--text-sm": "0.875rem",  "--text-base": "1rem",      "--text-lg": "1.125rem",  "--text-xl": "1.375rem" },
  relaxed: { "--text-sm": "0.9375rem", "--text-base": "1.0625rem", "--text-lg": "1.1875rem", "--text-xl": "1.5rem"  },
};

const DENSITY_VARS = {
  compact:     { "--space-1": "0.125rem", "--space-2": "0.25rem", "--space-3": "0.5rem",  "--space-4": "0.75rem", "--space-6": "1rem" },
  cozy:        { "--space-1": "0.25rem",  "--space-2": "0.5rem",  "--space-3": "0.75rem", "--space-4": "1rem",    "--space-6": "1.5rem" },
  comfortable: { "--space-1": "0.375rem", "--space-2": "0.75rem", "--space-3": "1rem",    "--space-4": "1.5rem",  "--space-6": "2rem" },
};

const BRANDING_FIELD_MAP = {
  primary: ["--primary", "--accent"],
  "primary-hover": ["--primary-hover", "--accent-hover"],
  "primary-light": ["--primary-light", "--accent-light"],
  "primary-foreground": ["--primary-foreground"],
  surface: ["--surface", "--bg-primary"],
  "surface-elevated": ["--surface-elevated", "--bg-secondary"],
  "surface-muted": ["--surface-muted"],
  text: ["--text", "--text-primary"],
  "text-muted": ["--text-muted", "--text-secondary"],
  border: ["--border", "--border-color"],
  correct: ["--correct"],
  "correct-light": ["--correct-light"],
  present: ["--present"],
  absent: ["--absent"],
  selection: ["--selection", "--cell-selected", "--cell-selected-bg"],
  "selection-ring": ["--selection-ring", "--cell-selected-ring"],
  highlight: ["--highlight", "--cell-highlighted", "--cell-related"],
  "cell-bg": ["--cell-bg"],
  "cell-blocked": ["--cell-blocked"],
  "grid-border": ["--grid-border"],
  "main-word-marker": ["--main-word-marker"],
  "sidebar-active": ["--sidebar-active"],
  "sidebar-active-bg": ["--sidebar-active-bg"],
};

/**
 * Apply branding data from the API response to a DOM element
 * as CSS custom property overrides.
 *
 * @param {HTMLElement} element - Container element to style
 * @param {Record<string, string> | null} brandingData - Branding object from API (e.g. puzzle.branding)
 */
export function applyBrandingFromData(element, brandingData) {
  if (!brandingData || !element) return;

  const tokens = brandingData.tokens || {};
  for (const [tokenName, cssVars] of Object.entries(BRANDING_FIELD_MAP)) {
    const value = tokens[tokenName];
    if (!value) continue;
    for (const cssVar of cssVars) {
      element.style.setProperty(cssVar, value);
    }
  }

  const typography = brandingData.typography || {};
  if (typography.fontSans) {
    element.style.setProperty("--font-sans", typography.fontSans);
    loadGoogleFont(typography.fontSans);
  }
  if (typography.fontSerif) {
    element.style.setProperty("--font-serif", typography.fontSerif);
    loadGoogleFont(typography.fontSerif);
  }
  const scaleVars = SCALE_VARS[typography.scale];
  if (scaleVars) {
    for (const [k, v] of Object.entries(scaleVars)) {
      element.style.setProperty(k, v);
    }
  }

  const spacing = brandingData.spacing;
  if (spacing && typeof spacing.radius === "number") {
    element.style.setProperty("--radius-sm", `${spacing.radius * 0.5}px`);
    element.style.setProperty("--radius-md", `${spacing.radius}px`);
    element.style.setProperty("--radius-lg", `${spacing.radius * 1.5}px`);
    element.style.setProperty("--radius-xl", `${spacing.radius * 2}px`);
  }
  const densityVars = spacing && DENSITY_VARS[spacing.density];
  if (densityVars) {
    for (const [k, v] of Object.entries(densityVars)) {
      element.style.setProperty(k, v);
    }
  }

  if (brandingData.orgId) {
    element.setAttribute("data-org-id", brandingData.orgId);
  }

  if (brandingData.customCssGames) {
    let styleEl = element.querySelector("style[data-branding-custom-css]");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.setAttribute("data-branding-custom-css", "");
      element.insertBefore(styleEl, element.firstChild);
    }
    styleEl.textContent = brandingData.customCssGames;
  }
}

/**
 * Dynamically inject a Google Fonts <link> for the given font-family value.
 * Extracts the primary font name (before the first comma) and loads it.
 * Skips system fonts and already-loaded fonts.
 *
 * @param {string} fontValue - CSS font-family value, e.g. "Playfair Display, serif"
 */
const loadedFonts = new Set();

function loadGoogleFont(fontValue) {
  const fontName = fontValue.split(",")[0].trim().replace(/["']/g, "");
  const systemFonts = [
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Arial",
    "Helvetica",
  ];

  if (systemFonts.includes(fontName) || loadedFonts.has(fontName)) return;
  loadedFonts.add(fontName);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}
