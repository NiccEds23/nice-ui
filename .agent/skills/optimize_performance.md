# Skill: optimize_performance

## When to Apply

Trigger this skill when:
- A new heavy component or page is added (charts, large lists, modals with complex content)
- User reports slow initial load or scroll jank
- Preparing a production deploy to shared hosting
- Adding new dependencies that might inflate bundle size

---

## Pre-Implementation Checklist

Run through this before touching any code:

1. **Route lazy loading active?** Check `vite.config.ts` — `VueRouter({ importMode: 'async' })` must be present.
2. **Console statements?** Use `esbuild.drop` in `vite.config.ts`, not manual removal.
3. **Sourcemaps off for prod?** `build.sourcemap: mode !== 'production'` in `vite.config.ts`.
4. **`.htaccess` present?** `public/.htaccess` must exist for SPA routing + cache headers.
5. **`background-attachment: fixed` anywhere?** Replace with `::before { position: fixed }` pattern (see `main.scss`).
6. **Expensive constructors in computed/render paths?** Hoist to module scope (see `BaseStatCard.vue` `_formatter`).

---

## Build Configuration Patterns (vite.config.ts)

### Route Lazy Loading
```typescript
VueRouter({ importMode: 'async' })
```
Each page in `src/pages/` becomes its own async chunk. Never override with `'sync'` per-route.

### Strip Console in Production
```typescript
esbuild: {
  drop: mode === 'production' ? (['console', 'debugger'] as const) : [],
}
```
Requires the function form `defineConfig(({ mode }) => ({ ... }))`.

### No Prod Sourcemaps
```typescript
build: { sourcemap: mode !== 'production' }
```

### Vendor Chunk Splitting
Current strategy (do not change unless adding a new heavy dep):
- `vue-vendor` → Vue + Vue Router + Pinia + @vueuse
- `echarts-vendor` → ECharts 2D + vue-echarts
- `ui-vendor` → grid-layout-plus + maska + swrv + axios

When adding a new npm package > 50 KB, evaluate whether it needs its own chunk. Add to `manualChunks` if it changes less frequently than app code.

---

## Deployment Artifact (public/.htaccess)

`public/.htaccess` is copied to `dist/` at build time. It must be present for:
- SPA routing (history mode, direct URL access)
- 1-year immutable cache on fingerprinted assets
- `no-cache` on `index.html`
- Gzip compression
- Security headers

Do not delete or move this file. See `documentation/08_PERFORMANCE.md` for the full annotated version.

---

## SCSS Performance Patterns

### Fixed Background (no repaint)
```scss
// ❌ Causes CPU repaint on every scroll frame
body { background: $bg-gradient; background-attachment: fixed; }

// ✅ GPU-composited fixed background — no scroll repaint
body {
  &::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    background: $bg-gradient;
  }
}
```

### will-change
Only add `will-change: transform` to elements that animate frequently (e.g. cards with `:hover { transform: translateY(...) }`). Do NOT apply globally — it consumes GPU memory for every matched element.

---

## Component Patterns

### Hoist Expensive Constructors
```typescript
// ❌ Creates a new Intl.NumberFormat on every reactive update
const formatted = computed(() => new Intl.NumberFormat('id-ID').format(val));

// ✅ One instance for the app's lifetime
const _formatter = new Intl.NumberFormat('id-ID');
const formatted = computed(() => _formatter.format(val));
```
Applies to: `Intl.NumberFormat`, `Intl.DateTimeFormat`, regex literals with `/g` flag, `new Map()/Set()` initialized from constants.

### v-if vs v-show
- **Modals, drawers, popovers** → `v-if` (BaseModal/BaseDrawer/BasePopover already enforce this). DOM is destroyed when hidden; no memory waste for rarely-opened panels.
- **Tabs, accordion panels, expand/collapse** → `v-show` if toggled frequently (avoids re-rendering cost on each toggle).

### Avoid Deeply Nested Reactive Objects
Keep Pinia stores flat. Deeply nested reactive objects cause Vue to track more watchers. Prefer normalized shapes (id → object maps) over arrays of nested objects for large datasets.

---

## Bundle Size Budget

| Chunk | Target (gzipped) |
|---|---|
| `vue-vendor` | < 60 KB |
| `echarts-vendor` | < 300 KB |
| `ui-vendor` | < 40 KB |
| Any single page chunk | < 30 KB |

Run `npx vite-bundle-visualizer` after `pnpm build` to inspect actual sizes.

---

## References

- `vite.config.ts` — canonical build config with all optimizations
- `public/.htaccess` — Apache deployment config
- `src/assets/styles/main.scss` — background pattern
- `src/components/Base/BaseStatCard.vue` — Intl hoisting example
- `documentation/08_PERFORMANCE.md` — full rationale and deployment guide
