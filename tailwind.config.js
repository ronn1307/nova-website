/**
 * Hearth · Tailwind extension
 * Tokens mirror the Figma Hearth · Color / Spacing / Radius collections.
 * Keep this in sync when ramps in Figma change.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bone (neutrals)
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
        // Midnight (dark)
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
        // Persimmon (brand)
        persimmon: {
          50:  "#FEF3EE",
          100: "#FDE3D6",
          200: "#FCC9B0",
          300: "#FAAF89",
          400: "#F9A060",
          500: "#F17857",
          600: "#E9504D",
          700: "#BC3C39",
          800: "#8E2C2A",
          900: "#5C1B1A",
        },
        // Cobalt
        cobalt: {
          50:  "#EEF1FE",
          100: "#DCE2FE",
          200: "#BAC6FC",
          300: "#8FA1F8",
          400: "#6B7FF0",
          500: "#4A60E5",
          600: "#2A4FD6",
          700: "#2042B0",
          800: "#1A348A",
          900: "#112258",
        },
        // Nebula (AI)
        nebula: {
          50:  "#F1ECFE",
          100: "#E2D4FB",
          200: "#CDB1F7",
          300: "#B38DF4",
          400: "#9965F0",
          500: "#7C3AED",
          600: "#6A43D8",
          700: "#5A2BC0",
          800: "#44218E",
          900: "#2E165F",
        },
        // Saffron
        saffron: {
          50:  "#FEF5E6",
          500: "#F59E0B",
          600: "#D58608",
        },
        // Matcha
        matcha: {
          50:  "#ECFAF1",
          500: "#16A34A",
          600: "#128A3E",
        },
        // Lagoon
        lagoon: {
          50:  "#E7F6F4",
          500: "#0D9488",
          600: "#0B7C72",
        },
        // Bloom
        bloom: {
          50:  "#FCE8F1",
          500: "#DB2777",
          600: "#BB1F66",
        },
      },
      spacing: {
        // Hearth spacing scale — 4pt baseline grid
        // (values that don't conflict with Tailwind defaults)
        "px-2":  "2px",
        "1.75": "7px",
        "4.5":  "18px",
        "5.5":  "22px",
        "13":   "52px",
        "15":   "60px",
        "17":   "68px",
        "18":   "72px",
        "22":   "88px",
        "28":   "112px",
        "30":   "120px",
        "32":   "128px",
        "36":   "144px",
        "40":   "160px",
      },
      borderRadius: {
        // Hearth radius
        "xs":  "4px",
        "sm":  "6px",
        "md":  "8px",
        "lg":  "12px",
        "xl":  "16px",
        "2xl": "24px",
        "3xl": "32px",
        "4xl": "44px",
        "5xl": "64px",
        "6xl": "72px",
        "7xl": "96px",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        display: [
          "'Söhne'",
          "'GT America'",
          "'Aeonik'",
          "'General Sans'",
          "var(--font-inter)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-jetbrains-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "SF Mono",
          "Menlo",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter:  "-0.04em",
        tight:    "-0.025em",
        normal:   "-0.005em",
        eyebrow:  "0.18em",
        mono:     "0.14em",
      },
    },
  },
  plugins: [],
};
