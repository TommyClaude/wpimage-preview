# WPImage — project context for Claude Code

> Handoff notes so any fresh Claude Code session can continue this work seamlessly.
> **The user communicates in Vietnamese — reply in Vietnamese.**

## What this is
WPImage = a WordPress plugin admin UI (image-optimization product). Built with
**React 18 + Babel standalone** — JSX is compiled in the browser, there is **no
build step / no bundler**. Forked from the NinjaTeam WP admin UI kit; uses native
WordPress core component classNames (`.components-*`, `.button`, etc.).

## Repo layout
- `wpimage/` — the actual WordPress plugin (this is what ships):
  - `wpimage.php` — bootstrap; enqueues React/Babel (unpkg CDN) + the JSX/CSS
    assets, each versioned with `WPIMAGE_VERSION` for cache-busting.
  - `assets/js/*.jsx` — React, loaded as `type="text/babel"`:
    `app.jsx` (main app + DashboardPage/SettingsPage + footer version string),
    `components.jsx` (Ic, SectionCard, StatCard, QuotaBar, TrendChart, …),
    `cross-sell.jsx` (PluginsPage/AboutSection/InstallBtn),
    `support.jsx`, `auth-modal.jsx`; `icons.js` (NTIcons inline-SVG injector).
  - `assets/css/` — `tokens.css`, `wpimage-admin.css`.
- `index.html` — GitHub Pages **preview harness**: simulates the wp-admin shell and
  loads the SAME JSX from `wpimage/assets/`. Assets carry `?v=VERSION` cache-bust.
- `blueprint.json` — WordPress Playground blueprint (installs + activates `wpimage.zip`).
- `wpimage.zip` — built plugin zip (committed; Playground downloads it).
- `.github/workflows/deploy.yml` — deploys the repo root to GitHub Pages on push to `main`.

## Live URLs
- Preview:    https://tommyclaude.github.io/wpimage-preview/
- Playground: https://playground.wordpress.net/?blueprint-url=https://tommyclaude.github.io/wpimage-preview/blueprint.json?v=VERSION

## Conventions — FOLLOW ON EVERY CHANGE
1. **Bump the version on every build** (user tracks it). Update ALL four together:
   - `wpimage/assets/js/app.jsx` — footer `v2.8.x`
   - `wpimage/wpimage.php` — header `Version:` + `define( 'WPIMAGE_VERSION', '2.8.x' )`
   - `index.html` — every asset `?v=2.8.x`
   - `blueprint.json` — zip url `?v=2.8.x`
2. **Validate JSX before building** (no build step → catch syntax errors early):
   compile each `.jsx` with Babel `@babel/plugin-transform-react-jsx`
   (`@babel/core` lives in `/tmp/node_modules`; `npm i` it if missing).
3. **Rebuild the zip**: `rm -f wpimage.zip && zip -qr wpimage.zip wpimage/ -x "*.DS_Store"`,
   then verify `WPIMAGE_VERSION` inside the zip matches.
4. Commit + push to `main`; the Action auto-deploys to Pages (~1 min). Poll the run
   to confirm `conclusion=success` before telling the user it's live.
5. **Mobile URL formatting**: the user is on iPhone. Put each URL on its OWN line and
   never wrap URLs in markdown bold/`**` — it breaks tap-to-open.
6. Network: `tommyclaude.github.io` is NOT in the container allowlist, so you can't
   `curl` the live site from here — verify via the zip contents + the deploy status.

## Current state (v2.8.21)
- **Optimizations chart**: real-time rolling 30-day window ending today (computed from
  `new Date()`); x-axis ticks show month on first tick + month changes; **tooltip shows
  the real date, except the last bar (today) which shows "Today"**; all bars uniform
  color; dark shade only as transient hover/tap feedback; single baseline (no floating
  gridlines).
- **Install button** (About → More Plugins) uses `components-spinner`, not the `is-busy`
  stripe. `is-busy` is still used by the Sync/Save buttons — keep its CSS.
- Dead code removed: `AuthCheckbox`, `LockOverlay`.
- Login modal centered on mobile; inputs are placeholder-only; no "Remember me".

## GitHub
Repo: `TommyClaude/wpimage-preview` (branch `main`). End commit messages with the
session link line per the harness instructions.
