<div align="center">

# NiceUI

**A Vue 3 component library and dashboard starter kit**  
Built with TypeScript · SCSS Design System · Dark Mode · Glassmorphism

</div>

---

## ✨ Overview

NiceUI is an enterprise-grade UI Kit built as the foundation for all projects. It provides **45 ready-to-use Base Components** with full dark mode support, a consistent glassmorphism design language, and zero external UI framework dependencies (no Bootstrap, no Tailwind — pure SCSS).

**Live Component Preview** → run the dev server and open `/design-system`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 8

### Install & Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
# → http://localhost:5173

# Build for production
pnpm run build
```

---

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── _variables.scss        # Design tokens (colors, spacing, typography)
│   │       ├── _component_mixins.scss # Reusable SCSS mixins for components
│   │       └── main.scss              # Global styles & CSS custom properties
│   │
│   ├── components/
│   │   ├── Base/                      # ← 45 Base UI Components (NiceUI)
│   │   └── Layout/                    # App shell (Sidebar, Navbar, DashboardLayout)
│   │
│   ├── composables/                   # Reusable logic (useTableHelper, etc.)
│   ├── pages/                         # File-based routes (unplugin-vue-router)
│   │   └── design-system.vue          # ← Live component demos
│   ├── stores/                        # Pinia stores (auth, ui, dashboard)
│   └── utils/                         # Helpers (formatter, http-helper, fetcher)
│
├── documentation/                     # Developer documentation
│   ├── 02_BASE_COMPONENTS.md          # ← Component API reference (start here)
│   └── ...
│
└── .agent/                            # AI Agent context & coding rules
    ├── CODING_RULES.md                # ← Coding standards (read first)
    └── BASE_COMPONENTS_MAP.md         # Component quick-reference
```

---

## 🧩 Base Components

All 45 Base Components live in `src/components/Base/` and are **globally auto-imported** — no manual import needed.

> Full API reference → [`documentation/02_BASE_COMPONENTS.md`](./documentation/02_BASE_COMPONENTS.md)

| Category         | Components                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Core UI**      | Button · Card · Loader · Tooltip · Divider                                                                                     |
| **Forms**        | Input · Textarea · Select · Checkbox · Radio · Switch · Datepicker · Upload · UploadMultiple · Rating · OtpInput · ColorPicker |
| **Data Display** | Table · ReportTable · Badge · HighlightCard · StatCard · EmptyState · SkeletonLoader · Accordion · Timeline · KanbanBoard      |
| **Charts**       | LineChart · BarChart · PieChart · Chart                                                                                        |
| **Navigation**   | Breadcrumb · Tabs · Stepper · Pagination                                                                                       |
| **Feedback**     | Progress · Alert · AlertBanner · Toast                                                                                         |
| **Overlays**     | Modal · Drawer · Popover                                                                                                       |
| **Layout**       | DashboardGrid                                                                                                                  |
| **Audit**        | AuditLog                                                                                                                       |

### Quick Example

```vue
<template>
  <BaseCard title="Users">
    <BaseTable
      :columns="columns"
      :data="users"
      :pagination="meta"
      @page-change="fetchUsers"
    >
      <template #cell-status="{ val }">
        <BaseBadge :variant="val === 'active' ? 'success' : 'neutral'">
          {{ val }}
        </BaseBadge>
      </template>
    </BaseTable>
  </BaseCard>
</template>

<script setup lang="ts">
const { data: users } = useSWRV("/api/users", fetcher);
</script>
```

---

## 🛠️ Tech Stack

| Package                | Purpose                                                  |
| ---------------------- | -------------------------------------------------------- |
| `vue` 3.5 + `vite` 7   | Framework + build tool                                   |
| `typescript` 5.9       | Type safety                                              |
| `sass`                 | SCSS styling (no Tailwind / Bootstrap)                   |
| `pinia`                | Client-side state (auth, UI, theme)                      |
| `swrv`                 | GET requests with auto-caching                           |
| `axios`                | POST / PUT / DELETE mutations                            |
| `unplugin-vue-router`  | File-based routing (`src/pages/`)                        |
| `unplugin-auto-import` | Auto-imports for Vue + composables                       |
| `echarts`              | Charts (`BaseLineChart`, `BaseBarChart`, `BasePieChart`) |
| `v-calendar`           | Date picker                                              |
| `maska`                | Input masking (currency, phone, etc.)                    |

---

## 🌗 Dark Mode

Dark mode is controlled via `uiStore.toggleTheme()` which sets `data-theme="dark"` on `<html>`. All components respond automatically via CSS custom properties.

**Cardinal rule** — never hardcode colors:

```scss
/* ✅ Always use CSS variables */
background: var(--surface-white);
border: 1px solid var(--border-light);
color: $text-primary;

/* ❌ Breaks dark mode */
background: #ffffff;
border: 1px solid #e2e8f0;
```

> Full guide → [`documentation/DARK_MODE.md`](./documentation/DARK_MODE.md)

---

## 📐 Key Coding Rules

> Full standards → [`.agent/CODING_RULES.md`](./.agent/CODING_RULES.md)

- Always use `<script setup lang="ts">` — Options API is **forbidden**
- Base Components are **auto-imported** — do not manually import them
- Dropdowns / popovers **must** use `<Teleport to="body">` + `position: fixed`
- Use **SWRV** for GET requests, **Axios** for mutations — never raw `fetch()`
- `BaseModal` requires `v-model:visible` — **not** `v-model`
- `BaseTable` has integrated pagination — do not add `<BasePagination>` inside it

---

## 📚 Documentation Index

| File                                                                                 | Description                               |
| ------------------------------------------------------------------------------------ | ----------------------------------------- |
| [`documentation/02_BASE_COMPONENTS.md`](./documentation/02_BASE_COMPONENTS.md)       | Component API reference (props, examples) |
| [`documentation/01_PROJECT_STRUCTURE.md`](./documentation/01_PROJECT_STRUCTURE.md)   | Folder structure & conventions            |
| [`documentation/03_LAYOUTS_AND_PAGES.md`](./documentation/03_LAYOUTS_AND_PAGES.md)   | Layout system & routing                   |
| [`documentation/04_STATE_MANAGEMENT.md`](./documentation/04_STATE_MANAGEMENT.md)     | Pinia stores reference                    |
| [`documentation/05_API_HANDLING.md`](./documentation/05_API_HANDLING.md)             | SWRV + Axios patterns                     |
| [`documentation/06_DATA_VISUALIZATION.md`](./documentation/06_DATA_VISUALIZATION.md) | Chart components guide                    |
| [`documentation/DARK_MODE.md`](./documentation/DARK_MODE.md)                         | Dark mode implementation guide            |
| [`.agent/CODING_RULES.md`](./.agent/CODING_RULES.md)                                 | Coding standards & constraints            |
| [`.agent/BASE_COMPONENTS_MAP.md`](./.agent/BASE_COMPONENTS_MAP.md)                   | Quick component map (for AI agents)       |
