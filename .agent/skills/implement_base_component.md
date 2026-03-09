---
description: How to build or update a Base Component with proper dark mode support
---

# Skill: Implementing a Dark Mode-Safe Base Component

Follow this checklist every time you create or modify a `Base*.vue` component.

## Pre-Implementation Checklist

Before writing any code, answer these questions:

1. Does this component render any popover / dropdown / tooltip that floats outside its parent?
   → Yes: Use `<Teleport to="body">` + `position: fixed` + non-scoped `<style>`
2. Does this component use any background or border color?
   → Yes: Use CSS variables only (see Variable Map below)

---

## Step 1: Component Skeleton

```vue
<template>
  <!-- template here -->
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
// imports...

// Props — SINGLE withDefaults call (NEVER call defineProps twice)
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

defineEmits<{
  change: [value: string];
}>();
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/component_mixins" as *;

/* Component styles */
</style>
```

> ⚠️ If the component uses `<Teleport to="body">`, remove the `scoped` attribute from `<style>`.

---

## Step 2: Color Rules (CRITICAL)

### ✅ Allowed — CSS Variables

| Use Case                        | Variable                                               |
| ------------------------------- | ------------------------------------------------------ |
| White / page background         | `var(--surface-white)`                                 |
| Input field background          | `var(--surface-glass)`                                 |
| Input focused background        | `var(--surface-white)`                                 |
| Heavy glass (dropdown, popover) | `var(--surface-glass-heavy)`                           |
| Any border                      | `var(--border-light)`                                  |
| Glass border                    | `var(--border-glass)`                                  |
| Table header background         | `var(--neutral-50)`                                    |
| Table row hover                 | `var(--neutral-100)`                                   |
| Text                            | `$text-primary`, `$text-secondary`, `$text-muted`      |
| Primary action                  | `$primary-color`                                       |
| Status colors                   | `$status-success`, `$status-danger`, `$status-warning` |
| Arrow / triangle                | `rgba(var(--neutral-900-rgb), 0.85)`                   |

### ❌ Forbidden — Hardcoded Values

```scss
background: white; /* ❌ */
background: #ffffff; /* ❌ */
background: #f8fafc; /* ❌ */
background: rgba(255, 255, 255, 0.9); /* ❌ */
border: 1px solid #e2e8f0; /* ❌ */
border: 1px solid #cbd5e1; /* ❌ */
color: #334155; /* ❌ */
color: #1e293b; /* ❌ */
```

---

## Step 3: SCSS Lint Rules

### No Empty Rulesets

```scss
// ❌ Lint error
&:hover {
}

// ✅ Remove entirely, or comment out
// &:hover { ... }
```

### No Commented-Out Code Blocks

Remove dead code — don't leave large `/* ... */` blocks in production.

---

## Step 4: Dropdown / Floating Element Pattern — MANDATORY

**ALWAYS use Teleport** for any component that renders a dropdown, popover, or drawer. This prevents overflow clipping when the component is placed inside `BaseTable`, modals, or any scrollable container.

```ts
// ── in <script setup> ───────────────────────────────────────────────────────
const containerRef = ref<HTMLElement | null>(null); // the trigger
const dropdownRef = ref<HTMLElement | null>(null); // the floating panel
const floatingStyle = ref<Record<string, string>>({});

function calcPosition() {
  const rect = containerRef.value!.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const DROPDOWN_H = 280;
  const isUp = spaceBelow < DROPDOWN_H && rect.top > DROPDOWN_H;

  if (isUp) {
    floatingStyle.value = {
      position: "fixed",
      left: `${rect.left}px`,
      bottom: `${window.innerHeight - rect.top + 6}px`,
      width: `${rect.width}px`,
    };
  } else {
    floatingStyle.value = {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.bottom + 6}px`,
      width: `${rect.width}px`,
    };
  }
}

// close when clicking outside — MUST check BOTH refs
const handleClickOutside = (e: MouseEvent) => {
  const inTrigger = containerRef.value?.contains(e.target as Node);
  const inDropdown = dropdownRef.value?.contains(e.target as Node);
  if (!inTrigger && !inDropdown) closeDropdown();
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside, true); // capture phase
  window.addEventListener("scroll", calcPosition, true);
  window.addEventListener("resize", calcPosition);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside, true);
  window.removeEventListener("scroll", calcPosition, true);
  window.removeEventListener("resize", calcPosition);
});
```

```vue
<!-- ── in <template> ────────────────────────────────────────────────────── -->
<div ref="containerRef" @click="toggle">
  <!-- trigger -->
</div>

<Teleport to="body">
  <Transition name="my-dropdown">
    <div v-if="isOpen" ref="dropdownRef" :style="floatingStyle" class="my-dropdown">
      <!-- options -->
    </div>
  </Transition>
</Teleport>
```

```scss
/* Use a SECOND non-scoped <style> block for teleported classes */
/* <style lang="scss"> — NO scoped attribute */
.my-dropdown {
  z-index: 9999;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-glass);
  border-radius: 1rem;
  box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.15);
}
```

---

## Step 5: TypeScript Safety

```ts
// Record indexed access — always provide fallback
const MAP: Record<string, string> = { default: "icon" };
return MAP[key] ?? "icon"; // ✅ — not MAP[key] alone

// Boolean prop default — always explicit
const props = withDefaults(defineProps<{ visible?: boolean }>(), {
  visible: false,
});

// Export interfaces for consuming components
export interface MyItem {
  key: string;
  label: string;
}
```

---

## Step 6: After Implementation — Self-Review

Before marking work complete, verify:

- [ ] No `white`, `#ffffff`, `#f8fafc`, raw `rgba(255,...)` etc. in SCSS
- [ ] All borders use `var(--border-light)` or `var(--border-glass)`
- [ ] No empty SCSS rulesets `{}`
- [ ] Dropdown/popover uses `<Teleport to="body">` + `position: fixed`
- [ ] Teleported elements have a **separate non-scoped** `<style>` block
- [ ] Click-outside handler checks BOTH `containerRef` and `dropdownRef`
- [ ] Scroll & resize listeners reposition the floating element
- [ ] `defineProps` called exactly once (with `withDefaults`)
- [ ] All existing CSS classes are preserved after edits
- [ ] Reusable types (`interface`, `type`) are exported
