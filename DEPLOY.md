# Deploying NOVA to Cloudflare Pages via GitHub

The site is configured for **static export** (`output: "export"` in `next.config.mjs`).
`npm run build` produces an `out/` folder of pre-rendered HTML/CSS/JS that
Cloudflare Pages serves directly from its edge — zero server cost, fast TTFB
worldwide.

A clean git repo is already initialized in this folder with one commit.

---

## 1 · Push to GitHub

Create an empty repo on GitHub (no README, no `.gitignore` — we already have both):

1. Go to <https://github.com/new>
2. Repository name: `nova-website` (or whatever you prefer)
3. **Private** is fine — Cloudflare Pages can read private repos via the GitHub integration
4. Click **Create repository** — don't initialize with any files

Then from your terminal, in `~/Desktop/NOVA-web-2026-staging`:

```bash
git remote add origin git@github.com:<your-username>/nova-website.git
git push -u origin main
```

(Use the HTTPS URL `https://github.com/<your-username>/nova-website.git` if you
haven't set up SSH keys.)

---

## 2 · Connect Cloudflare Pages to the repo

1. Open the Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Authorize Cloudflare to access your GitHub account, then pick the `nova-website` repo
3. **Set up builds and deployments:**
   - **Production branch:** `main`
   - **Framework preset:** `Next.js (Static HTML Export)`
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Root directory:** (leave blank)
4. **Environment variables:** add one
   - `NODE_VERSION` = `18.17.0` (or `20`)
5. Click **Save and Deploy**

The first build takes 2–3 minutes. When it's done you'll get a preview URL like
`https://nova-website-abc.pages.dev`. Click it — that's your site live.

Every future `git push` to `main` triggers an auto-build. PRs get their own
preview URLs.

---

## 3 · Attach your custom domain

Because the domain is already on Cloudflare, this is just two clicks — no DNS
records to copy.

1. In the Cloudflare Pages project → **Custom domains** tab → **Set up a custom domain**
2. Enter your domain (e.g. `nova.yourcompany.com` or the apex `yourcompany.com`)
3. Cloudflare detects that the domain is in your account and offers to add the
   CNAME / route automatically — click **Activate domain**
4. Wait ~30 seconds for the SSL certificate to provision. You'll see the status
   flip from "Verifying" → "Active".

For an **apex domain** (e.g. `yourcompany.com` with no subdomain), Cloudflare
adds a CNAME flattening record automatically — works the same way.

That's it. The site is live on your domain over HTTPS with Cloudflare's edge
caching and DDoS protection in front.

---

## Local development reminders

```bash
npm run dev      # localhost:3000 with hot reload
npm run build    # produces /out folder
npm run lint     # eslint pass
```

If you want to preview the exact static output Cloudflare will serve:

```bash
npm run build
npx serve out/   # or any static file server
```

---

## Troubleshooting

**Build fails with "Module not found"** — Cloudflare Pages may default to Node
16, which Next.js 14 doesn't support. Confirm `NODE_VERSION=18.17.0` or higher
is set in the Pages environment variables.

**404s on routes other than `/`** — Make sure the build output directory is
`out` (not `.next`). Static export writes pages as `/about/index.html`, not
`/about.html`; `trailingSlash: true` in `next.config.mjs` handles this.

**SSL cert stuck "Verifying"** — Cloudflare can occasionally take a few
minutes. If it's stuck > 10 minutes, remove and re-add the custom domain.

**Want to roll back a deploy** — Cloudflare Pages → Deployments tab → find a
prior successful build → **⋯** menu → **Rollback to this deployment**. Instant
swap, no rebuild required.
