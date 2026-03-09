# Dark Mode Documentation

## Overview

The dark mode implementation uses **CSS Custom Properties (Variables)** to allow runtime theme switching without page reloads. The system is designed to be fully reactive and persists the user's preference in `localStorage`.

## How It Works

### 1. Theme Variables (`src/assets/styles/_theme.scss`)

We define semantic color variables (e.g., `--bg-primary`, `--text-main`) instead of fixed hex codes.

- **:root**: Contains the default (Light Mode) values.
- **[data-theme="dark"]**: Contains the Dark Mode overrides.

### 2. SCSS Integration

Legacy SCSS variables in `_variables.scss` now map to these CSS variables:

```scss
$primary-color: var(--primary-color);
$bg-light: var(--bg-light);
```

### 3. Toggling Logic (`src/composables/useTheme.ts`)

A Vue composable `useTheme` handles:

- Checking user preference (`localStorage` or System Preference).
- Toggling the class/attribute on the `<html>` tag (using `data-theme="dark"`).

## Adding New Colors

To add a new color that supports dark mode:

1.  Open `src/assets/styles/_theme.scss`.
2.  Add the variable to `:root` with the light mode hex value:
    ```css
    --new-color: #ffffff;
    --new-color-rgb: 255, 255, 255; /* Required for opacity usage */
    ```
3.  Add the variable to `[data-theme="dark"]` with the dark mode hex value:
    ```css
    --new-color: #000000;
    --new-color-rgb: 0, 0, 0;
    ```
4.  Use it in your components:
    ```css
    .my-component {
      background-color: var(--new-color);
      /* With opacity */
      background-color: rgba(var(--new-color-rgb), 0.5);
    }
    ```

## Glassmorphism

Glass effects automatically adapt. In dark mode, the glass backgrounds become darker and more transparent to ensure contrast against the dark background, while maintaining the blur effect.

---

## Complete Variable Reference

The following variables are defined in both `:root` and `[data-theme="dark"]`:

### Brand & Semantic

| Variable                 | Light     | Dark      |
| ------------------------ | --------- | --------- |
| `--primary-color`        | `#3b82f6` | `#60a5fa` |
| `--primary-hover`        | `#2563eb` | `#3b82f6` |
| `--secondary-color`      | `#06b6d4` | `#22d3ee` |
| `--secondary-hover`      | `#0891b2` | `#06b6d4` |
| `--accent-color`         | `#8b5cf6` | `#a78bfa` |
| `--status-success`       | `#22c55e` | _(same)_  |
| `--status-success-hover` | `#16a34a` | `#4ade80` |
| `--status-warning`       | `#f59e0b` | _(same)_  |
| `--status-warning-hover` | `#d97706` | `#fbbf24` |
| `--status-danger`        | `#ef4444` | _(same)_  |
| `--status-danger-hover`  | `#dc2626` | `#f87171` |

> **Pattern**: Light mode hover = darker shade (600). Dark mode hover = lighter shade (400) for better contrast.

### Surface & UI

| Variable                | Light                   | Dark                    |
| ----------------------- | ----------------------- | ----------------------- |
| `--surface-glass`       | `rgba(255,255,255,0.4)` | `rgba(30,41,59,0.6)`    |
| `--surface-glass-heavy` | `rgba(255,255,255,0.8)` | `rgba(30,41,59,0.9)`    |
| `--border-glass`        | `rgba(255,255,255,0.5)` | `rgba(255,255,255,0.1)` |
| `--border-light`        | `#e2e8f0`               | `#334155`               |

---

## Component Dark Mode Rules

### Dropdowns & Floating Panels

Always use CSS variables — **never hardcode `rgba(255,255,255,...)`**:

```scss
// ✅ Correct
background: var(--surface-glass-heavy);
border: 1px solid var(--border-glass);

// ❌ Wrong — breaks dark mode
background: rgba(255, 255, 255, 0.9);
```

### Arrow / Triangle Colors (e.g. Tooltip)

Use `rgba(var(--neutral-900-rgb), 0.85)` so the arrow matches the tooltip background in both modes:

```scss
// ✅ Adapts: dark in light mode, white in dark mode
border-color: rgba(var(--neutral-900-rgb), 0.85) transparent transparent
  transparent;
```

### Teleported Components (BaseTooltip)

`BaseTooltip` renders outside the component tree via `<Teleport to="body">`. Its `<style>` block must **NOT** be `scoped`. The CSS is still in the component file but applies globally:

```vue
<!-- BaseTooltip.vue -->
<style lang="scss">
  <!-- No "scoped" attribute -->
.base-tooltip { ... }
</style>
```
