/**
 * Client Branding Configuration
 *
 * Maps branding data from the Directus API to CSS custom properties
 * and applies them to game container elements.
 */

/**
 * Mapping from Directus branding field names to CSS custom property names.
 * Each entry maps a branding API field → one or more CSS variables.
 */
const BRANDING_FIELD_MAP = {
  accent_color: ["--accent"],
  accent_hover_color: ["--accent-hover"],
  accent_light_color: ["--accent-light"],
  selection_color: ["--cell-selected-bg", "--cell-selected"],
  selection_ring_color: ["--cell-selected-ring"],
  highlight_color: ["--cell-highlighted", "--cell-related"],
  correct_color: ["--correct"],
  present_color: ["--present"],
  bg_primary_color: ["--bg-primary"],
  bg_secondary_color: ["--bg-secondary"],
  text_primary_color: ["--text-primary"],
  text_secondary_color: ["--text-secondary"],
  border_color: ["--border-color"],
  cell_bg_color: ["--cell-bg"],
  cell_blocked_color: ["--cell-blocked"],
  sidebar_active_color: ["--sidebar-active"],
  sidebar_active_bg_color: ["--sidebar-active-bg"],
  grid_border_color: ["--grid-border"],
  font_sans: ["--font-sans"],
  font_serif: ["--font-serif"],
  border_radius: ["--radius-md", "--radius-lg", "--radius-xl"],
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

  for (const [field, cssVars] of Object.entries(BRANDING_FIELD_MAP)) {
    const value = brandingData[field];
    if (value) {
      for (const cssVar of cssVars) {
        element.style.setProperty(cssVar, value);
      }

      // Dynamically load Google Font for font fields
      if (field === "font_sans" || field === "font_serif") {
        loadGoogleFont(value);
      }
    }
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
