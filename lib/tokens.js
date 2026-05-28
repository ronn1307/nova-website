/**
 * Hearth · Design tokens (JavaScript export)
 * Mirrors the Figma Hearth · Color / Spacing / Radius collections.
 * Use these inline when Tailwind utilities aren't enough (eg. SVG fills,
 * dynamic gradients, computed colors).
 *
 * Keep in sync with:
 *   - tailwind.config.js (Tailwind utility colors)
 *   - app/globals.css (CSS variables)
 *   - Figma "Hearth · Color" collection
 */
export const T = {
  // Bone (neutrals / canvas)
  canvas:        "#FAFAFB", // bone-100
  surface:       "#FFFFFF", // bone-50
  mist:          "#F4F4F6", // bone-200
  hairline:      "#E7E7EB", // bone-300
  divider:       "#CECED4", // bone-400
  placeholder:   "#9C9CA3", // bone-500
  inkSoft:       "#6F6F76", // bone-600
  inkMuted:      "#4E4E54", // bone-700
  inkEmphasis:   "#2B2B30", // bone-800
  ink:           "#14110F", // bone-900

  // Persimmon (brand · NOVA logo gradient)
  persimmon50:   "#FEF3EE",
  persimmon100:  "#FDE3D6",
  persimmon200:  "#FCC9B0",
  persimmon300:  "#FAAF89",
  persimmon400:  "#F9A060", // gradient bottom
  persimmon500:  "#F17857", // sunset
  persimmon600:  "#E9504D", // CORAL — primary CTA
  persimmon700:  "#BC3C39",
  persimmon800:  "#8E2C2A",
  persimmon900:  "#5C1B1A",

  // Cobalt (SpiceKit brand-anchor)
  cobalt100:     "#DCE2FE",
  cobalt500:     "#4A60E5",
  cobalt600:     "#2A4FD6",

  // Nebula (AI signal)
  nebula50:      "#F1ECFE",
  nebula100:     "#E2D4FB",
  nebula200:     "#CDB1F7",
  nebula500:     "#7C3AED",
  nebula600:     "#6A43D8", // Nova Nebula

  // Matcha
  matcha500:     "#16A34A",
  matcha600:     "#128A3E",

  // Saffron
  saffron500:    "#F59E0B",

  // Midnight (dark family)
  abyss:         "#080A18",
  midnight:      "#0E1124", // canonical dark canvas
  slate:         "#1A2042",
  twilight:      "#5F6692",
  whisper:       "#FAFAFB",
  whisperSoft:   "#A8ACC4",
};

// Unified type system — Inter across display, body, and labels for synergy.
// FONT_DISPLAY and FONT_MONO are kept as named exports so existing imports
// continue to work without a sweep; they all resolve to the same Inter stack.
const INTER_STACK =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system, sans-serif";

export const FONT_DISPLAY = INTER_STACK;
export const FONT_BODY = INTER_STACK;
export const FONT_MONO = INTER_STACK;
