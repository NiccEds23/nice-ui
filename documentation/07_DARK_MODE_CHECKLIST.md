# 07. Dark Mode Checklist for Developers

> Reference this checklist before finalizing any component or page that will run in dark mode.

---

## Before Submitting Code — Component Checklist

### 🎨 Colors

- [ ] No hardcoded `white`, hex colors (`#f8fafc`, `#1e293b`, etc.), or fixed `rgba(255,255,255,...)` in SCSS
- [ ] Backgrounds use `var(--surface-white)`, `var(--surface-glass)`, or `var(--surface-glass-heavy)`
- [ ] Borders use `var(--border-light)` or `var(--border-glass)`
- [ ] Text colors use `$text-primary`, `$text-secondary`, or `$text-muted`
- [ ] Arrow/triangle colors use `rgba(var(--neutral-900-rgb), 0.85)` — NOT hardcoded values

### 🏗️ SCSS Structure

- [ ] No empty CSS rulesets (`&:hover {}`)
- [ ] No commented-out code blocks left in production
- [ ] When replacing a section, the **full** CSS rule block is output — no partial replacements that silently delete other classes

### 🛠️ Vue 3 / TypeScript

- [ ] `defineProps` called exactly **once** (inside `withDefaults`)
- [ ] If using `<Teleport to="body">`: `<style>` has **no** `scoped` attribute
- [ ] `Record<string, T>` indexed values have `?? 'fallback'` to avoid `T | undefined`

---

## Variable Quick Reference

### Backgrounds

```scss
background: var(--surface-white); /* Cards, tables, form inputs (focused) */
background: var(--surface-glass); /* Inputs, sidebars */
background: var(--surface-glass-heavy); /* Dropdowns, modals, popovers */
background: var(--neutral-50); /* Table headers, subtle section backgrounds */
background: var(--neutral-100); /* Hover states for rows */
```

### Borders

```scss
border: 1px solid var(--border-light); /* Standard borders */
border: 1px solid var(--border-glass); /* Glass panel borders */
```

### Text Colors

```scss
color: $text-primary; /* Primary content */
color: $text-secondary; /* Labels, secondary content */
color: $text-muted; /* Placeholders, hints, timestamps */
color: $text-inverted; /* Text on dark/colored backgrounds */
```

### Status Colors (dark mode aware)

```scss
color: $status-success; /* Green text/icons */
color: $status-success-hover; /* Darker green (light) / lighter green (dark) */
color: $status-warning; /* Amber text/icons */
color: $status-warning-hover;
color: $status-danger; /* Red text/icons */
color: $status-danger-hover;
```

### Special Patterns

```scss
/* Tooltip/caret arrow — adapts automatically */
border-color: rgba(var(--neutral-900-rgb), 0.85) transparent transparent
  transparent;

/* Action color opacity tinting */
background: rgba($primary-rgb, 0.1);
background: rgba($status-success-rgb, 0.12);
```

---

## Common Mistakes & Fixes

| Mistake                                   | Fix                                         |
| ----------------------------------------- | ------------------------------------------- |
| `background: white`                       | `background: var(--surface-white)`          |
| `background: #f8fafc`                     | `background: var(--neutral-50)`             |
| `background: #f1f5f9`                     | `background: var(--neutral-50)`             |
| `background: #e2e8f0`                     | `background: var(--neutral-100)`            |
| `background: rgba(255,255,255,0.9)`       | `background: var(--surface-glass-heavy)`    |
| `border: 1px solid #e2e8f0`               | `border: 1px solid var(--border-light)`     |
| `border: 1px solid rgba(255,255,255,0.6)` | `border: 1px solid var(--border-glass)`     |
| `color: #334155`                          | `color: $text-primary`                      |
| Arrow: `rgba(15,23,42,0.85)`              | Arrow: `rgba(var(--neutral-900-rgb), 0.85)` |
