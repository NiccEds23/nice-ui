# 08 — Performance & Shared Hosting Deployment

## Why This Matters

This project is deployed as a **static bundle on Apache shared hosting** — no Node.js runtime, no server-side rendering, no CDN. Every optimization must be baked into the build artifact. The strategies below are already applied; this document explains the "why" and serves as a reference for future changes.

---

## Build Optimizations (`vite.config.ts`)

### Route Lazy Loading

```typescript
VueRouter({ importMode: 'async' })
```

`unplugin-vue-router` is configured with `importMode: 'async'`. This generates every page as a **dynamic import** (`() => import('./pages/...')`). Vite then splits each page into its own JS chunk. On first load the browser only downloads the current route's chunk — not the code for Calendar, Kanban, Design System, etc.

**Impact:** Initial JS payload for the dashboard page drops from the full app bundle to just the dashboard chunk + shared vendor chunks.

Do NOT override this per-route. Adding `definePage({ meta: { importMode: 'sync' } })` on a page defeats the splitting.

---

### Console & Debugger Strip (Production Only)

```typescript
esbuild: {
  drop: mode === 'production' ? ['console', 'debugger'] : [],
}
```

All `console.log`, `console.warn`, `console.error`, and `debugger` statements are removed at the esbuild transform stage during `pnpm build`. Source files are never modified. In development (`pnpm dev`) all console output remains available.

For dev-only logging that should survive this rule, wrap it:
```typescript
if (import.meta.env.DEV) {
  console.log('only in dev:', data);
}
```

---

### No Sourcemaps in Production

```typescript
build: { sourcemap: mode !== 'production' }
```

Sourcemaps expose original TypeScript source on the server filesystem and add ~30–40% to the dist/ artifact size. They are generated in development and CI (for debugging) but not in production builds.

---

### Vendor Chunk Splitting

The `manualChunks` config in `vite.config.ts` creates three long-lived vendor chunks:

| Chunk | Contents | Why separate |
|-------|----------|--------------|
| `vue-vendor` | Vue, Vue Router, Pinia, @vueuse | Rarely changes — browsers cache for 1 year |
| `echarts-vendor` | ECharts 2D + vue-echarts wrapper | Large (~1 MB uncompressed) but stable |
| `ui-vendor` | grid-layout-plus, maska, swrv, axios | Changes less often than app code |

**ECharts 3D** (`echarts-gl`) is loaded dynamically and only when a chart component receives `:is3d="true"`. It is never included in the initial bundle.

---

## Deployment: Apache `.htaccess`

The file `public/.htaccess` is copied to `dist/` at build time. It is required for shared hosting.

### SPA Routing

Vue Router uses HTML5 history mode. Without the rewrite rule, any direct URL access (e.g. refreshing `/kanban`) returns a 404 from Apache because no physical file exists at that path.

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

### Cache-Control

Vite fingerprints all asset filenames (e.g. `vue-vendor.a1b2c3d4.js`). Once a browser has cached a fingerprinted file, it never re-requests it unless the hash changes (which only happens when that bundle's source changes).

| File pattern | Cache policy | Reason |
|---|---|---|
| `*.js`, `*.css`, `*.woff2`, etc. | `max-age=31536000, immutable` | Fingerprinted — safe to cache forever |
| `index.html` | `no-cache, no-store` | Entry point — must re-fetch to pick up new asset hashes |

### Gzip Compression

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript ...
</IfModule>
```

Reduces wire transfer by 60–80% for JS/CSS. Most shared hosts enable this globally, but declaring it in `.htaccess` guarantees it on hosts where it is opt-in per directory.

### Security Headers

| Header | Value | Purpose |
|---|---|---|
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables unused browser features |

---

## Runtime Optimizations

### Background Scroll Performance

`background-attachment: fixed` on `body` forces the browser to repaint the background on every scroll frame (it cannot be GPU-composited). The fix uses a `::before` pseudo-element with `position: fixed`:

```scss
// main.scss
body {
  // No background here
  &::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    background: $bg-gradient; // $bg-gradient = var(--bg-gradient)
  }
}
```

`position: fixed` achieves the same visual result (background stays fixed relative to viewport) while letting the compositor handle it on the GPU. The CSS variable `var(--bg-gradient)` is already redefined in `[data-theme="dark"]`, so dark mode continues to work.

### Intl.NumberFormat Memoization

`new Intl.NumberFormat(...)` construction is expensive. When called inside a `computed()` function it runs on every reactive update. If the locale and options are static, hoist the instance to module scope:

```typescript
// ✅ One instance per app lifetime — shared across all component instances
const _formatter = new Intl.NumberFormat("id-ID");

const formattedValue = computed(() => _formatter.format(props.value as number));
```

This pattern is already applied in `BaseStatCard.vue`.

---

## Pre-Deploy Checklist

Before uploading `dist/` to shared hosting:

- [ ] `pnpm build` completes with no TypeScript errors
- [ ] `dist/assets/` contains separate page chunks (e.g. `_kanban-*.js`, `_calendar-*.js`)
- [ ] No `.map` files in `dist/assets/` (sourcemaps disabled for prod)
- [ ] `dist/.htaccess` exists (Vite copies from `public/`)
- [ ] Test with `pnpm preview` — navigate directly to `/kanban`, `/calendar` to verify SPA routing
- [ ] Upload the **entire contents** of `dist/` to the hosting document root (not `dist/` itself)
- [ ] Verify `/` loads correctly after upload
- [ ] Verify direct URL access to a sub-route (e.g. `/kanban`) returns the app, not a 404

---

## Bundle Analysis (Ad-hoc)

To inspect bundle composition without adding a permanent dev dependency:

```bash
npx vite-bundle-visualizer
# or
npx rollup-plugin-visualizer --open
```

Run after `pnpm build`. This generates an interactive treemap of all chunks showing which modules contribute most to bundle size.

---

## Future Opportunities

These are not yet applied but worth considering if the project grows:

| Opportunity | Trigger |
|---|---|
| **ECharts tree-shaking** | Import only the chart types used instead of the full ECharts core. Apply if echarts-vendor chunk grows past 600 KB gzipped. |
| **Virtual scroll** | Apply `@vueuse/core`'s `useVirtualList` or a dedicated library to `BaseTable` and `BaseAuditLog` if row counts exceed 500. |
| **Web font subsetting** | Self-host Plus Jakarta Sans with only the character ranges used, eliminating the Google Fonts dependency entirely. |
| **Image lazy loading** | Add `loading="lazy"` to any `<img>` tags added in future pages. |
