/**
 * Hearth · Design tokens (mirrors Figma collections 1:1)
 *
 * Token nomenclature matches the Figma file exactly:
 *   - Hearth · Color          → C    (primitives)
 *   - Hearth · Spacing        → SP   (4pt grid)
 *   - Hearth · Radius         → R
 *   - Hearth · Semantic       → SEM  (Light + Dark modes)
 *   - Hearth · Component      → COMP (Light + Dark modes)
 *   - Type styles             → TS
 *
 * Use these in JSX inline styles and CSS variables. Legacy `T` export at
 * the bottom keeps existing call-sites working while we migrate.
 *
 * Strict 4pt grid: spacing values are all multiples of 4 (except 2 for
 * hairline-level adjustments). Type sizes only use 12/16/20/24/32/48/64.
 */

// ─── PRIMITIVES ──────────────────────────────────────────────────────────────
// Single source of truth. Every higher-level token aliases these.
export const C = {
  bone: {
    50:  "#FFFFFF",
    100: "#FAFAFB",
    200: "#F4F4F6",
    300: "#E7E7EB",
    400: "#CECED4",
    500: "#9C9CA3",
    600: "#6F6F76",
    700: "#4E4E54",
    800: "#2B2B30",
    900: "#14110F",
  },
  persimmon: {
    50:  "#FEF3EE",
    100: "#FDE3D6",
    200: "#FCC9B0",
    300: "#FAAF89",
    400: "#F9A060", // gradient bottom of NOVA logo
    500: "#F17857", // sunset · button bg-start
    600: "#E9504D", // CORAL · primary CTA · button bg-end
    700: "#BC3C39", // button outline · pressed bg-end
    800: "#8E2C2A", // pressed bg-end
    900: "#5C1B1A",
  },
  cobalt: {
    100: "#DCE2FE",
    500: "#4A60E5", // focus ring for Secondary + Ghost
    600: "#2A4FD6",
  },
  nebula: {
    50:  "#F1ECFE",
    100: "#E2D4FB",
    200: "#CDB1F7",
    500: "#7C3AED", // AI signal
    600: "#6A43D8",
  },
  matcha: {
    500: "#16A34A",
    600: "#128A3E",
  },
  saffron: {
    500: "#F59E0B",
  },
  midnightBlack: {
    50:  "#F8F8FA",
    100: "#EFEFF2",
    200: "#D8D8DD",
    300: "#B0B0B7",
    400: "#7E7E86",
    500: "#555560",
    600: "#3D3D48",
    700: "#2A2A35", // ★ hairline anchor — outcome panels, footer
    800: "#20202B",
    900: "#171721", // ★ canvas anchor — wrapper dark bg
  },
  // Legacy indigo Midnight family (kept for any remaining references)
  midnight: {
    50:  "#ECEDF3",
    100: "#D6D9E6",
    200: "#ADB1C8",
    300: "#888DAB",
    400: "#5F6692",
    500: "#3F4775",
    600: "#2A3158",
    700: "#1A2042",
    800: "#131831",
    900: "#0E1124",
  },
  // Alpha primitives (matches Figma `bone-100-alpha/*` + `midnight-black-800-alpha/*`)
  boneAlpha100: {
    0:  "rgba(250, 250, 251, 0)",
    15: "rgba(250, 250, 251, 0.15)",
    30: "rgba(250, 250, 251, 0.30)",
    45: "rgba(250, 250, 251, 0.45)",
    60: "rgba(250, 250, 251, 0.60)",
    75: "rgba(250, 250, 251, 0.75)",
  },
  midnightBlack800Alpha: {
    0:  "rgba(32, 32, 43, 0)",
    15: "rgba(32, 32, 43, 0.15)",
    30: "rgba(32, 32, 43, 0.30)",
    45: "rgba(32, 32, 43, 0.45)",
    60: "rgba(32, 32, 43, 0.60)",
    75: "rgba(32, 32, 43, 0.75)",
  },
};

// ─── SPACING (strict 4pt grid) ───────────────────────────────────────────────
// Use these EVERYWHERE. No raw 17/18/21/etc. anywhere in the codebase.
export const SP = {
  0:    0,
  2:    2,   // hairline only
  4:    4,
  8:    8,
  12:   12,
  16:   16,
  20:   20,
  24:   24,
  28:   28,
  32:   32,
  40:   40,
  48:   48,
  56:   56,
  64:   64,
  72:   72,
  80:   80,
  96:   96,
  112:  112,
  128:  128,
  144:  144,
  160:  160,
};

// ─── RADIUS ──────────────────────────────────────────────────────────────────
export const R = {
  0:    0,
  4:    4,
  6:    6,
  8:    8,
  12:   12,
  16:   16,
  24:   24,
  32:   32,
  44:   44,
  64:   64,
  72:   72,
  96:   96,
  full: 999,
};

// ─── TYPE STYLES (mirrors Figma type styles, 4pt scale) ──────────────────────
export const TS = {
  display64:    { fontSize: 64, lineHeight: 1.08,  letterSpacing: "-0.028em", fontWeight: 500 },
  display48:    { fontSize: 48, lineHeight: 1.08,  letterSpacing: "-0.028em", fontWeight: 500 },
  heading32:    { fontSize: 32, lineHeight: 1.16,  letterSpacing: "-0.02em",  fontWeight: 500 },
  heading24:    { fontSize: 24, lineHeight: 1.24,  letterSpacing: "-0.015em", fontWeight: 500 },
  heading20:    { fontSize: 20, lineHeight: 1.30,  letterSpacing: "-0.01em",  fontWeight: 600 },
  body16Medium: { fontSize: 16, lineHeight: 1.56,  letterSpacing: "-0.005em", fontWeight: 500 },
  body16:       { fontSize: 16, lineHeight: 1.56,  letterSpacing: "-0.005em", fontWeight: 400 },
  body12:       { fontSize: 12, lineHeight: 1.40,  letterSpacing: "0",        fontWeight: 500 },
  label12: {
    fontSize: 12, lineHeight: 1, letterSpacing: "0.18em",
    fontWeight: 600, textTransform: "uppercase",
  },
  // Button labels — line-heights in px so they snap cleanly to button heights
  buttonSm: { fontSize: 14, lineHeight: "20px", letterSpacing: "-0.005em", fontWeight: 500 },
  buttonMd: { fontSize: 14, lineHeight: "24px", letterSpacing: "-0.005em", fontWeight: 500 },
  buttonLg: { fontSize: 16, lineHeight: "24px", letterSpacing: "-0.005em", fontWeight: 500 },
};

// ─── SEMANTIC (Light + Dark) ─────────────────────────────────────────────────
// Each token aliases a primitive. Picks by theme are done at the call-site
// via the useScrollTheme hook → SEM[theme].
export const SEM = {
  light: {
    bg: {
      canvas:   C.bone[100],   // page background
      surface:  C.bone[50],    // cards / panels
      elevated: C.bone[50],    // raised surfaces
      mist:     C.bone[200],   // subtle bg
      overlay:  "rgba(20,17,15,0.45)",
    },
    fg: {
      primary:     C.bone[900],
      secondary:   C.bone[700],
      muted:       C.bone[600],
      placeholder: C.bone[500],
      inverse:     C.midnightBlack[50],
      brand:       C.persimmon[600],
      ai:          C.nebula[500],
      success:     C.matcha[600],
      onBrand:     "#FFFFFF",
    },
    border: {
      subtle: C.bone[300],
      strong: C.bone[400],
      brand:  C.persimmon[600],
    },
    accent: {
      brand:      C.persimmon[600],
      brandHover: "#EE5A57",
      brandSoft:  C.persimmon[100],
      ai:         C.nebula[500],
      aiSoft:     C.nebula[100],
      success:    C.matcha[500],
      warning:    C.saffron[500],
      info:       C.cobalt[500],
    },
    gradient: {
      brandStart: C.persimmon[600],
      brandEnd:   C.persimmon[400],
    },
  },
  dark: {
    bg: {
      canvas:   C.midnightBlack[900],
      surface:  C.midnightBlack[800],
      elevated: C.midnightBlack[700],
      mist:     C.midnightBlack[800],
      overlay:  "rgba(0,0,0,0.65)",
    },
    fg: {
      primary:     C.midnightBlack[50],
      secondary:   C.midnightBlack[200],
      muted:       C.midnightBlack[300],
      placeholder: C.midnightBlack[400],
      inverse:     C.bone[900],
      brand:       C.persimmon[500],
      ai:          C.nebula[500],
      success:     C.matcha[500],
      onBrand:     "#FFFFFF",
    },
    border: {
      subtle: C.midnightBlack[700],
      strong: C.midnightBlack[600],
      brand:  C.persimmon[500],
    },
    accent: {
      brand:      C.persimmon[600],
      brandHover: "#EE5A57",
      brandSoft:  C.persimmon[100],
      ai:         C.nebula[500],
      aiSoft:     C.nebula[100],
      success:    C.matcha[500],
      warning:    C.saffron[500],
      info:       C.cobalt[500],
    },
    gradient: {
      brandStart: C.persimmon[600],
      brandEnd:   C.persimmon[400],
    },
  },
};

// ─── COMPONENT TOKENS · BUTTON (SpiceKit gradient pattern) ───────────────────
// Mirrors the Figma `Hearth · Component` collection for buttons.
// Reference shape: BUTTON[mode][variant][state] = { bgStart, bgEnd, highlight, outline, fg, ring? }
const _btnPrimary = {
  light: {
    default:  { bgStart: C.persimmon[500], bgEnd: C.persimmon[600], highlight: C.bone[50],  outline: C.persimmon[700], fg: "#FFFFFF" },
    hover:    { bgStart: C.persimmon[400], bgEnd: C.persimmon[500], highlight: C.bone[50],  outline: C.persimmon[700], fg: "#FFFFFF" },
    pressed:  { bgStart: C.persimmon[600], bgEnd: C.persimmon[700], highlight: C.bone[50],  outline: C.persimmon[800], fg: "#FFFFFF" },
    focused:  { bgStart: C.persimmon[500], bgEnd: C.persimmon[600], highlight: C.bone[50],  outline: C.persimmon[700], fg: "#FFFFFF", ring: C.persimmon[200] },
    disabled: { bgStart: C.bone[200],      bgEnd: C.bone[300],      highlight: C.bone[100], outline: C.bone[300],      fg: C.bone[500] },
  },
  dark: {
    default:  { bgStart: C.persimmon[500], bgEnd: C.persimmon[600], highlight: C.bone[50],  outline: C.persimmon[700], fg: "#FFFFFF" },
    hover:    { bgStart: C.persimmon[400], bgEnd: C.persimmon[500], highlight: C.bone[50],  outline: C.persimmon[700], fg: "#FFFFFF" },
    pressed:  { bgStart: C.persimmon[600], bgEnd: C.persimmon[700], highlight: C.bone[50],  outline: C.persimmon[800], fg: "#FFFFFF" },
    focused:  { bgStart: C.persimmon[500], bgEnd: C.persimmon[600], highlight: C.bone[50],  outline: C.persimmon[700], fg: "#FFFFFF", ring: C.persimmon[700] },
    disabled: { bgStart: C.midnightBlack[700], bgEnd: C.midnightBlack[800], highlight: C.midnightBlack[600], outline: C.midnightBlack[600], fg: C.midnightBlack[400] },
  },
};
const _btnSecondary = {
  light: {
    default:  { bgStart: C.bone[50],  bgEnd: C.bone[200], highlight: C.bone[50],  outline: C.bone[300], fg: C.bone[900] },
    hover:    { bgStart: C.bone[100], bgEnd: C.bone[300], highlight: C.bone[50],  outline: C.bone[400], fg: C.bone[900] },
    pressed:  { bgStart: C.bone[200], bgEnd: C.bone[400], highlight: C.bone[50],  outline: C.bone[500], fg: C.bone[900] },
    focused:  { bgStart: C.bone[50],  bgEnd: C.bone[200], highlight: C.bone[50],  outline: C.bone[300], fg: C.bone[900], ring: C.cobalt[500] },
    disabled: { bgStart: C.bone[100], bgEnd: C.bone[200], highlight: C.bone[100], outline: C.bone[200], fg: C.bone[500] },
  },
  dark: {
    default:  { bgStart: C.midnightBlack[700], bgEnd: C.midnightBlack[800], highlight: C.midnightBlack[600], outline: C.midnightBlack[500], fg: C.midnightBlack[50] },
    hover:    { bgStart: C.midnightBlack[600], bgEnd: C.midnightBlack[700], highlight: C.midnightBlack[600], outline: C.midnightBlack[400], fg: C.midnightBlack[50] },
    pressed:  { bgStart: C.midnightBlack[500], bgEnd: C.midnightBlack[600], highlight: C.midnightBlack[600], outline: C.midnightBlack[300], fg: C.midnightBlack[50] },
    focused:  { bgStart: C.midnightBlack[700], bgEnd: C.midnightBlack[800], highlight: C.midnightBlack[600], outline: C.midnightBlack[500], fg: C.midnightBlack[50], ring: C.cobalt[500] },
    disabled: { bgStart: C.midnightBlack[800], bgEnd: C.midnightBlack[800], highlight: C.midnightBlack[700], outline: C.midnightBlack[700], fg: C.midnightBlack[400] },
  },
};
const _btnGhost = {
  light: {
    default:  { bgStart: C.boneAlpha100[0], bgEnd: C.boneAlpha100[0], highlight: C.boneAlpha100[0], outline: C.bone[300], fg: C.bone[900] },
    hover:    { bgStart: C.bone[50],        bgEnd: C.bone[200],       highlight: C.boneAlpha100[0], outline: C.bone[400], fg: C.bone[900] },
    pressed:  { bgStart: C.bone[100],       bgEnd: C.bone[300],       highlight: C.boneAlpha100[0], outline: C.bone[500], fg: C.bone[900] },
    focused:  { bgStart: C.boneAlpha100[0], bgEnd: C.boneAlpha100[0], highlight: C.boneAlpha100[0], outline: C.bone[300], fg: C.bone[900], ring: C.cobalt[500] },
    disabled: { bgStart: C.boneAlpha100[0], bgEnd: C.boneAlpha100[0], highlight: C.boneAlpha100[0], outline: C.bone[200], fg: C.bone[500] },
  },
  dark: {
    default:  { bgStart: C.midnightBlack800Alpha[0], bgEnd: C.midnightBlack800Alpha[0], highlight: C.midnightBlack800Alpha[0], outline: C.midnightBlack[700], fg: C.midnightBlack[50] },
    hover:    { bgStart: C.midnightBlack[700],       bgEnd: C.midnightBlack[600],       highlight: C.midnightBlack800Alpha[0], outline: C.midnightBlack[600], fg: C.midnightBlack[50] },
    pressed:  { bgStart: C.midnightBlack[600],       bgEnd: C.midnightBlack[500],       highlight: C.midnightBlack800Alpha[0], outline: C.midnightBlack[500], fg: C.midnightBlack[50] },
    focused:  { bgStart: C.midnightBlack800Alpha[0], bgEnd: C.midnightBlack800Alpha[0], highlight: C.midnightBlack800Alpha[0], outline: C.midnightBlack[700], fg: C.midnightBlack[50], ring: C.cobalt[500] },
    disabled: { bgStart: C.midnightBlack800Alpha[0], bgEnd: C.midnightBlack800Alpha[0], highlight: C.midnightBlack800Alpha[0], outline: C.midnightBlack[800], fg: C.midnightBlack[400] },
  },
};
export const BUTTON = {
  light: { primary: _btnPrimary.light, secondary: _btnSecondary.light, ghost: _btnGhost.light },
  dark:  { primary: _btnPrimary.dark,  secondary: _btnSecondary.dark,  ghost: _btnGhost.dark  },
};

// ─── BUTTON SIZE CONFIG (matches the 90-variant Figma set) ───────────────────
// padX_icon = padX with trailing icon present (visual centre: -4px)
export const BUTTON_SIZE = {
  sm: { height: 36, padX: SP[16], padX_icon: SP[12], padY: SP[8],  gap: SP[8], iconSize: 14, ts: TS.buttonSm },
  md: { height: 40, padX: SP[20], padX_icon: SP[16], padY: SP[8],  gap: SP[8], iconSize: 16, ts: TS.buttonMd },
  lg: { height: 48, padX: SP[24], padX_icon: SP[20], padY: SP[12], gap: SP[8], iconSize: 18, ts: TS.buttonLg },
};

// ─── FONT STACKS ─────────────────────────────────────────────────────────────
const INTER_STACK =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system, sans-serif";

export const FONT_DISPLAY = INTER_STACK;
export const FONT_BODY    = INTER_STACK;
export const FONT_MONO    = INTER_STACK;

// ─── LEGACY FLAT KEYS (backwards compat — DO NOT add new keys here) ──────────
// Existing call-sites use these flat names. Migrate to C / SEM / BUTTON above
// over time; do not introduce new code against these shapes.
export const T = {
  canvas:        C.bone[100],
  surface:       C.bone[50],
  mist:          C.bone[200],
  hairline:      C.bone[300],
  divider:       C.bone[400],
  placeholder:   C.bone[500],
  inkSoft:       C.bone[600],
  inkMuted:      C.bone[700],
  inkEmphasis:   C.bone[800],
  ink:           C.bone[900],

  persimmon50:   C.persimmon[50],
  persimmon100:  C.persimmon[100],
  persimmon200:  C.persimmon[200],
  persimmon300:  C.persimmon[300],
  persimmon400:  C.persimmon[400],
  persimmon500:  C.persimmon[500],
  persimmon600:  C.persimmon[600],
  persimmon700:  C.persimmon[700],
  persimmon800:  C.persimmon[800],
  persimmon900:  C.persimmon[900],

  cobalt100:     C.cobalt[100],
  cobalt500:     C.cobalt[500],
  cobalt600:     C.cobalt[600],

  nebula50:      C.nebula[50],
  nebula100:     C.nebula[100],
  nebula200:     C.nebula[200],
  nebula500:     C.nebula[500],
  nebula600:     C.nebula[600],

  matcha500:     C.matcha[500],
  matcha600:     C.matcha[600],

  saffron500:    C.saffron[500],

  // Legacy indigo midnight (kept for any remaining references)
  abyss:         "#080A18",
  midnight:      C.midnight[900],
  slate:         C.midnight[700],
  twilight:      C.midnight[400],
  whisper:       C.midnightBlack[50],
  whisperSoft:   "#A8ACC4",

  // Midnight Black (warmer dark family)
  mb50:          C.midnightBlack[50],
  mb100:         C.midnightBlack[100],
  mb200:         C.midnightBlack[200],
  mb300:         C.midnightBlack[300],
  mb400:         C.midnightBlack[400],
  mb500:         C.midnightBlack[500],
  mb600:         C.midnightBlack[600],
  mb700:         C.midnightBlack[700],
  mb800:         C.midnightBlack[800],
  mb900:         C.midnightBlack[900],
};
