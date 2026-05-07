# Frontend Coding Rules & Standards

## 0. AGENT PERSONA (You are strictly bound to this role)

**Role**: Senior Frontend Developer (Vue Specialist)
**Experience**: 10+ Years
**Specialty**: High-Performance, Scalable Architecture, Modern UX/UI
**Design Style**: Dynamic, Clean, "Wow Factor" (Glassmorphism, Micro-interactions)
**Code Style**:

- **Efficient**: No redundant re-renders, optimized reactivity.
- **Maintainable**: Strict typing, clear separation of concerns, generic components.
- **Performance**: Mobile-first, Lazy loading, Caching strategies.

---

## 1. Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Styling**: SCSS (Scoped) with Global Mixins & Variables
- **State Management**: Pinia (Client State)
- **Data Fetching**: SWRV (Server State/Read), Axios (Write/Transport)
- **Build Tool**: Vite

> **📦 Dependencies Rule**: See [PROJECT_PACKAGES.md](./PROJECT_PACKAGES.md) for the strictly enforced package list and usage guidelines.

## 2. Component Structure

Always use `<script setup lang="ts">`.

### File Name

- **Base Components**: `Base[Name].vue` (e.g., `BaseButton.vue`)
- **Feature Components**: PascalCase (e.g., `UserList.vue`)
- **Views/Pages**: kebab-case for routing (e.g., `design-system.vue`, `user-profile.vue`)

### Template

- Avoid hardcoded colors; use SCSS variables.
- Use `Base*` components for all UI elements.

### Script

- **Props**: Use `defineProps` with strict typing and defaults.
- **Emits**: Use `defineEmits` to declare all events.
- **Imports**:
  - Use alias `@/` for imports.
  - Group imports: Vue core -> Stores/Composables -> Components -> Types.

### Style

- Always use `scoped`.
- Import variables/mixins explicitly if needed:
  ```scss
  @use "@/assets/styles/variables" as *;
  @use "@/assets/styles/component_mixins" as *;
  ```

## 3. Base Components Usage

**Strictly** use these components instead of native HTML elements:

| Native                        | Replacement            | Notes                                                     |
| ----------------------------- | ---------------------- | --------------------------------------------------------- |
| `<button>`                    | `<BaseButton>`         | Variants: primary, secondary, danger, ghost, success      |
| `<input>`                     | `<BaseInput>`          | Supports labels, errors, icons, masks, currency           |
| `<textarea>`                  | `<BaseTextarea>`       | Label, error, hint, maxlength, resize, disabled           |
| `<select>`                    | `<BaseSelect>`         | Search, multiple, async — **Teleport-based dropdown**     |
| `<table>`                     | `<BaseTable>`          | Config-driven, sorting, checkboxes, integrated pagination |
| `<input type="checkbox">`     | `<BaseCheckbox>`       | Single boolean or Array mode                              |
| `<input type="radio">`        | `<BaseRadio>`          | Single radio with animated indicator                      |
| `<input type="date">`         | `<BaseDatepicker>`     | Single or Range                                           |
| `<input type="file">`         | `<BaseUpload>`         | Field or Button mode                                      |
| `<input type="file">` (multi) | `<BaseUploadMultiple>` | Multiple files with preview list                          |
| `<input>` (OTP/PIN)           | `<BaseOtpInput>`       | Auto-tab, paste, backspace, masked                        |
| `Modal/Dialog`                | `<BaseModal>`          | Use `v-model:visible`, **NOT** `v-model`                  |
| `Drawer/Sidebar`              | `<BaseDrawer>`         | placement: right/left/bottom — Teleport-based             |
| `Tooltip`                     | `<BaseTooltip>`        | Hover information — Teleport-based                        |
| `Popover`                     | `<BasePopover>`        | position, click/hover trigger — Teleport-based            |
| `<hr>` / divider              | `<BaseDivider>`        | solid/dashed/dotted/gradient, optional label              |
| `star rating`                 | `<BaseRating>`         | v-model, hover preview, variants, readonly                |
| `color picker`                | `<BaseColorPicker>`    | Presets + hex input + native fallback                     |
| `pagination`                  | `<BasePagination>`     | Standalone (for grids/lists outside tables)               |
| `accordion`                   | `<BaseAccordion>`      | Single/multiple mode, flush variant                       |
| `timeline`                    | `<BaseTimeline>`       | Status nodes, compact variant                             |
| `kanban board`                | `<BaseKanbanBoard>`    | Drag-and-drop, columns, priority badges                   |
| `stat card`                   | `<BaseStatCard>`       | Value, trend %, sparkline SVG, variants                   |
| `tabs/nav`                    | `<BaseTabs>`           | line/pill/card variants, badges, icons                    |
| `stepper`                     | `<BaseStepper>`        | horizontal/vertical, clickable steps                      |
| `progress bar`                | `<BaseProgress>`       | linear + circular, striped, animated                      |
| `skeleton`                    | `<BaseSkeletonLoader>` | Multiple types, animated                                  |
| `empty state`                 | `<BaseEmptyState>`     | icon, title, description, action slot                     |

## 4. State Management & Data Fetching (CRITICAL)

**Use the right tool for the job:**

### A. SWRV (Read/Fetch)

Use `swrv` for **GET** requests. It provides caching, deduplication, and auto-revalidation.

```ts
import useSWRV from "swrv";
import { fetcher } from "@/utils/fetcher";

// Inside setup/composable
const { data, error, isValidating } = useSWRV("/api/users", fetcher, {
  refreshInterval: 0, // Manual refresh or on focus
  revalidateOnFocus: false,
});
```

### B. Axios (Write/Mutate)

Use generic helpers for **POST, PUT, DELETE**.

```ts
import { postData, putData, destroyData } from "@/utils/http-helper";

const createUser = async (payload) => {
  await postData("/api/users", payload);
  mutate("/api/users"); // Revalidate SWRV cache
};
```

### C. Pinia (Client State)

Use Pinia **ONLY** for:

- User Session / Auth
- Global UI State (Theme, Sidebar, Toasts, Loaders)
- Cross-component data sharing that isn't server-bound

## 5. Common Patterns

### Tables

Use `useTableHelper` composable for consistent pagination, sorting, and filtering.

```ts
const { tableRequest, handleSort, handlePageChange } =
  useTableHelper(fetchData);
```

### Modals

Always control visibility with a boolean ref and `v-model:visible`.

```vue
<BaseModal v-model:visible="showModal" title="...">
  ...
</BaseModal>
```

### Forms

Use `BaseInput`, `BaseSelect` etc. with `v-model`.
For validation, consider `useFormHelper` (if available) or simple computed validators.

## 6. CSS Framework

- **Variables**: `src/assets/styles/_variables.scss`
- **Mixins**: `src/assets/styles/_component_mixins.scss`
- **Global**: `src/assets/styles/main.scss`
- Avoid utility classes (Tailwind-like) unless defined in global styles. Prefer semantic classes.

---

## 7. Dark Mode — MANDATORY RULES 🚨

> These rules exist to prevent breaking layouts when switching between light and dark themes.
> **Violating any of these rules requires an immediate fix.**

### 7.1 Never Hardcode Colors

**ALWAYS** use CSS custom properties or SCSS variables. Never use hex or raw `rgba()` with fixed values.

```scss
// ❌ WRONG — breaks dark mode
background: white;
background: #f8fafc;
background: rgba(255, 255, 255, 0.9);
border: 1px solid #e2e8f0;

// ✅ CORRECT
background: var(--surface-white);
background: var(--neutral-50);
background: var(--surface-glass-heavy);
border: 1px solid var(--border-light);
```

### 7.2 Mandatory Variable Map

| Use case                    | Variable to use                                |
| --------------------------- | ---------------------------------------------- |
| Card / table background     | `var(--surface-white)`                         |
| Input background            | `var(--surface-glass)`                         |
| Glass panel                 | `var(--surface-glass-heavy)`                   |
| Dropdown/popover background | `var(--surface-glass-heavy)`                   |
| All borders                 | `var(--border-light)` or `var(--border-glass)` |
| Table header bg             | `var(--neutral-50)`                            |
| Table row hover             | `var(--neutral-100)`                           |
| Table parent row bg         | `var(--neutral-50)`                            |
| Text primary                | `$text-primary` or `var(--text-primary)`       |
| Text secondary              | `$text-secondary`                              |
| Text muted                  | `$text-muted`                                  |

### 7.3 Arrow / Triangle Colors (Tooltip, Dropdown Caret)

```scss
// ✅ rgba() with CSS var — adapts in dark mode
border-color: rgba(var(--neutral-900-rgb), 0.85) transparent transparent
  transparent;

// ❌ Hardcoded dark color — invisible in dark mode
border-color: rgba(15, 23, 42, 0.85) transparent transparent transparent;
```

### 7.4 Hover CSS Rulesets

**Never leave empty SCSS rulesets.** Remove the rule entirely or add a comment:

```scss
// ❌ WRONG — SCSS lint error
&:hover {
}

// ✅ CORRECT — either remove, or comment out
// &:hover { ... }
```

### 7.5 Teleport Components — Floating UI Pattern

Components with floating elements (dropdowns, popovers, drawers) **MUST** use `<Teleport to="body">` to escape overflow clipping from any parent container.

**Rules:**

```vue
<!-- ✅ Correct pattern -->
<Teleport to="body">
  <div class="my-dropdown" :style="floatingStyle">...</div>
</Teleport>
```

```ts
// Position with position:fixed + getBoundingClientRect()
function calcPosition() {
  const rect = triggerRef.value!.getBoundingClientRect();
  floatingStyle.value = {
    position: "fixed",
    left: `${rect.left}px`,
    top: `${rect.bottom + 6}px`,
    width: `${rect.width}px`,
  };
}
// Also add scroll/resize listeners to reposition:
window.addEventListener("scroll", calcPosition, true);
window.addEventListener("resize", calcPosition);
```

```scss
/* ❌ Wrong — scoped classes won't reach teleported DOM */
/* <style lang="scss" scoped> */

/* ✅ Correct — use a second non-scoped <style> block for teleported elements */
/* <style lang="scss"> (no scoped) */
```

**Components that MUST follow this pattern:**

- `BaseSelect` (rows-per-page dropdown in BaseTable, filter selects)
- `BaseTooltip`, `BasePopover`
- `BaseDrawer`

---

## 8. Vue 3 TypeScript — Pitfalls to Avoid 🚨

### 8.1 Never Call defineProps/defineEmits Twice

`defineProps` and `defineEmits` are compiler macros — calling them twice causes a runtime error.
Always use `withDefaults` in a **single** call:

```ts
// ✅ Correct
const props = withDefaults(
  defineProps<{
    label?: string;
    loading?: boolean;
  }>(),
  {
    label: "",
    loading: false,
  },
);

// ❌ Wrong — defineProps called twice
const props = defineProps<{ label?: string }>();
withDefaults(defineProps<{ label?: string }>(), { label: "" });
```

### 8.2 Never Remove Existing CSS Classes During a Diff Edit

When editing a SCSS file to fix one section, **always preserve all other classes** in the same block.
A partial replacement that removes `.base-select-input`, `.base-select-display`, `.arrow-icon` etc. will silently break the component.

✅ **Rule**: When replacing a large SCSS block, output the **complete** replacement, not a partial one.

### 8.3 Strict TypeScript — Record Indexed Access

```ts
const MAP: Record<string, string> = { default: "icon_name" };

// ❌ May be `string | undefined` in strict mode
return MAP[key];

// ✅ Explicit string fallback
return MAP[key] ?? "icon_name";
```

### 8.4 Click-Outside for Teleported Dropdowns

When a dropdown is Teleported to `<body>`, the standard `containerRef.contains()` check will NOT close it if the user clicks inside the floating panel. You must also check the dropdown ref:

```ts
const handleClickOutside = (event: MouseEvent) => {
  const inContainer = containerRef.value?.contains(event.target as Node);
  const inDropdown = dropdownRef.value?.contains(event.target as Node);
  if (!inContainer && !inDropdown) closeDropdown();
};
// Use capture phase so it fires first:
document.addEventListener("click", handleClickOutside, true);
```

### 8.5 Exporting Types from Base Components

When a Base Component defines reusable types (e.g. `TabItem`, `KanbanColumn`), **always export them** with the `export` keyword so consuming pages can import them:

```ts
// In BaseKanbanBoard.vue <script setup>
export interface KanbanColumn { ... }
export interface KanbanCard { ... }

// In consuming page
import BaseKanbanBoard, {
  type KanbanColumn,
} from '@/components/Base/BaseKanbanBoard.vue';
```

---

## 9. Performance Rules 🚀

### 9.1 Always Use Lazy Route Loading

`unplugin-vue-router` is configured with `importMode: 'async'` in `vite.config.ts`. Every page in `src/pages/` is automatically split into its own async chunk. **Do NOT override this per-route.** Never use synchronous page imports.

### 9.2 No console.log in Production Code

`console.*` and `debugger` are dropped at build time via `esbuild.drop` in `vite.config.ts`. Do not rely on console statements surviving the production build. For dev-only logging, wrap in a guard:

```ts
if (import.meta.env.DEV) {
  console.log('debug only:', data);
}
```

### 9.3 `background-attachment: fixed` is Forbidden

It forces a CPU repaint on every scroll frame. Use the `body::before` pattern instead:

```scss
// ❌ Repaint on every scroll
body { background: $bg-gradient; background-attachment: fixed; }

// ✅ GPU compositing — no scroll repaint cost
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

### 9.4 Hoist Long-Lived Object Constructors

If a constructor is called inside `computed()` or a render function and the result depends only on static config, hoist it to module scope so it is created once:

```ts
// ❌ New instance on every reactive update
const fmt = computed(() => new Intl.NumberFormat('id-ID').format(val.value));

// ✅ One instance per app lifetime
const _formatter = new Intl.NumberFormat('id-ID');
const fmt = computed(() => _formatter.format(val.value));
```

Applies to: `Intl.NumberFormat`, `Intl.DateTimeFormat`, regex with `/g` flag, static `Map`/`Set` lookups.

### 9.5 v-if for Modals, v-show for Frequent Toggles

- `<BaseModal>`, `<BaseDrawer>`, `<BasePopover>` → always controlled with `v-if` (their implementations enforce this). DOM is destroyed when hidden.
- **Tabs, accordion panels, content toggled many times per session** → prefer `v-show` to avoid repeated mount/unmount costs.

### 9.6 New Heavy Dependencies → Evaluate Chunk Placement

If adding an npm package larger than ~50 KB, check whether it should be extracted into a vendor chunk in `manualChunks` (`vite.config.ts`). Libraries that change less frequently than application code benefit from long-term browser caching when separated.

### 9.7 Deploy to Shared Hosting via `public/.htaccess`

`public/.htaccess` must always be present. It provides SPA routing (required for Vue Router history mode), 1-year immutable cache on fingerprinted assets, `no-cache` on `index.html`, gzip, and security headers. See `documentation/08_PERFORMANCE.md` for the full deployment checklist.
