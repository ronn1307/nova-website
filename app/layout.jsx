import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Instrument Serif — editorial display serif used for Hero KPI metrics.
// Variable font with one weight (Regular); italic available if needed.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata = {
  title: "Nova · The unified AI-native platform for restaurant operations",
  description:
    "Nova replaces 7–10 disconnected restaurant systems with one AI-native operating system. POS, online ordering, kitchen, loyalty, workforce and AI — on a single unified data layer. Book a demo.",
  metadataBase: new URL("https://rondesignhq.com"),
  openGraph: {
    title: "Nova · The unified AI-native platform for restaurant operations",
    description:
      "POS, ordering, kitchen, loyalty, workforce, and AI — on one intelligent data layer purpose-built for enterprise restaurants.",
    url: "https://rondesignhq.com",
    siteName: "Nova",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nova · The unified AI-native platform for restaurant operations",
    description:
      "POS, ordering, kitchen, loyalty, workforce, and AI — on one intelligent data layer.",
  },
};

export const viewport = {
  themeColor: "#FAFAFB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
