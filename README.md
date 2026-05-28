# Nova · Website

The marketing site for **Nova** — the unified AI-native platform for restaurant operations. Built on the **Hearth** design system.

Production domain: **rondesignhq.com** (hosted on Cloudflare Pages).

---

## Stack

- **Next.js 14** · App Router
- **React 18**
- **Tailwind CSS 3** · with Hearth tokens extended
- **lucide-react** · iconography
- **Inter** + **JetBrains Mono** · via `next/font/google`
- **Cloudflare Pages** · production hosting (via `@cloudflare/next-on-pages`)

---

## Get running locally

You need Node `>= 18.17`. Recommended: latest LTS.

```bash
# 1. Install deps
npm install

# 2. Start the dev server
npm run dev
```

Open <http://localhost:3000> in your browser. Hot reload is on — edits to any file in `app/`, `components/`, or `lib/` show up immediately.

---

## Project layout

```
.
├── app/
│   ├── layout.jsx       # Root HTML shell · Inter + JetBrains Mono
│   ├── globals.css      # Tailwind directives + Hearth CSS variables
│   └── page.jsx         # Server-component shell that renders <LandingPage />
├── components/
│   └── LandingPage.jsx  # The full client-side landing page (all sections)
├── lib/
│   ├── tokens.js        # Hearth color/font tokens (mirrors Figma variables)
│   └── hooks.js         # useScrollY, useSectionProgress
├── tailwind.config.js   # Hearth tokens extended into Tailwind
├── postcss.config.js
├── next.config.mjs
├── jsconfig.json        # Path aliases (@/lib, @/components)
└── package.json
```

### Where things live

- **Hearth color tokens** are defined in **three places** and must be kept in sync:
  1. Figma · `Hearth · Color` variable collection (source of truth)
  2. `tailwind.config.js` (Tailwind utility classes like `bg-bone-100`)
  3. `lib/tokens.js` and `app/globals.css` (JS imports + CSS variables for inline styles)
- **Fonts** are loaded via `next/font/google` in `app/layout.jsx` and exposed as CSS variables (`--font-inter`, `--font-jetbrains-mono`).
- **Section components** currently all live inside `components/LandingPage.jsx`. As the project grows, split each section into its own file under `components/sections/`.

---

## Hearth tokens · quick reference

```js
// Bone (neutrals)         Persimmon (brand)       Midnight (dark)
bone/50  = #FFFFFF         persimmon/400 = #F9A060 midnight/700 = #1A2042
bone/100 = #FAFAFB CANVAS  persimmon/500 = #F17857 midnight/800 = #131831
bone/200 = #F4F4F6 MIST    persimmon/600 = #E9504D midnight/900 = #0E1124
bone/900 = #14110F INK     CORAL · primary CTA            ↑ canonical dark
```

**Primary CTA** = Coral (`persimmon/600`)  
**Secondary CTA** = Mist (`bone/200`)  
**AI signal** = Nebula 600 (`#6A43D8`)  
**Platform brand** = Cobalt 600 (`#2A4FD6`)

---

## What's built

The landing page covers every section from the content brief:

| § | Section                       | State                                            |
|---|-------------------------------|--------------------------------------------------|
| — | Sticky glass nav              | Working · Ramp-style compress on scroll          |
| — | Hero + product mock           | Working · Reporting AI dashboard mock            |
| — | Logo strip (2 clusters)       | Working                                          |
| 01| Consolidation benefit         | Working · stylized SVG diagram (lottie placeholder) |
| 02| AI catalogue · bento          | Working · 3 hero cards + horizontal scroll shelf |
| 03| Systems that never spoke      | Working · sticky-scroll 4-phase morph            |
| 04| Audience segmenter            | Working · Enterprise default · 4 tabs            |
| 05| How it works · midnight       | Working · 3 numbered steps                       |
| 06| Customer outcomes             | Working · stat-led card hierarchy                |
| — | Final CTA · midnight close    | Working                                          |
| — | Footer                        | Working                                          |

Placeholders are clearly marked with `Placeholder · lottie` / `Placeholder · product UI` badges — these are where the visual designer and motion designer plug in real assets.

---

## Deploying to Cloudflare Pages · rondesignhq.com

### One-time setup

1. Install Wrangler globally if you don't have it:
   ```bash
   npm install -g wrangler
   wrangler login
   ```
2. Create the Pages project (first time only):
   ```bash
   wrangler pages project create rondesignhq --production-branch=main
   ```
3. Add your custom domain (in Cloudflare dashboard → Pages → rondesignhq → Custom domains → Add `rondesignhq.com`).

### Build + deploy

```bash
# Build for Cloudflare's edge runtime + deploy
npm run deploy
```

The `deploy` script runs `@cloudflare/next-on-pages` to convert the Next.js build into Cloudflare's Pages output format, then pushes it.

### Preview locally (production build)

```bash
npm run preview
```

Runs the Cloudflare-built output locally on `http://localhost:8788` so you can verify the production bundle before pushing.

### Environment variables

When the time comes, set them in the Cloudflare Pages dashboard under **Settings → Environment variables**. Anything client-side needs the `NEXT_PUBLIC_` prefix.

---

## Roadmap

- [x] Landing page · first draft (this scaffold)
- [ ] Wire real product UI screenshots into hero + bento cards (Reporting AI · Voice AI · Upsell)
- [ ] Replace placeholder SVGs with Lotties from motion designer
- [ ] Mega-menu hover behavior on top nav (Ramp / Stripe pattern)
- [ ] Sub-pages from marketing IA (Platform · AI · Solutions · Customers · Pricing · Company)
- [ ] Book-a-demo form (Calm Business pattern) — replaces buttons-only close
- [ ] Accessibility pass (focus rings, prefers-reduced-motion, semantic landmarks)
- [ ] Performance pass (LCP < 2.5s · CLS < 0.1 · image optimization)
- [ ] Cloudflare Pages production deploy to rondesignhq.com

---

## Conventions

- **Components**: PascalCase. Section components live in `LandingPage.jsx` for now.
- **Hooks**: in `lib/hooks.js`, prefixed `use*`.
- **Tokens**: import from `@/lib/tokens` for inline styles; use Tailwind classes (`bg-bone-100`, `text-ink`, `bg-persimmon-600`) for layout.
- **Inline styles vs Tailwind**: lean Tailwind for layout (grid/flex/spacing), inline styles for color when it depends on a dynamic value or token.
- **SVG illustrations**: every decorative SVG must use `radialGradient` or `linearGradient` with an alpha fade to transparent — **no hard edges, ever**. Soft blend into the canvas color.
- **Placeholder badges**: use the `<PlaceholderTag>` component on any spot where a real lottie / illustration / screenshot will land. This keeps the unfinished spots obvious during reviews.

---

## Design system

The Hearth design system lives in Figma:

- File: **Hearth · NOVA Website**
- Page: **0. Colors** · contains the full color foundations + spacing + radius
- Variable collections:
  - `Hearth · Color` (80 color variables across Bone, Midnight, Persimmon, Cobalt, Nebula, Saffron, Matcha, Lagoon, Bloom)
  - `Hearth · Spacing` (21 tokens · 4pt baseline grid)
  - `Hearth · Radius` (13 tokens · 0 → 96 + full)

When tokens change in Figma, also update:
- `tailwind.config.js`
- `lib/tokens.js`
- `app/globals.css`
