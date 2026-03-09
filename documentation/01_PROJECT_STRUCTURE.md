# 01. Project Structure

Magic ERP Frontend is built with **Vue 3**, **TypeScript**, **Vite**, and **Pinia**.
It follows a scalable, modular architecture designed for ease of maintenance and clear separation of concerns.

## 📂 Directory Overview

```
src/
├── assets/             # Static assets (fonts, images)
│   └── styles/         # Global SCSS, Variables, and Mixins
├── components/
│   ├── Base/           # Generic, atomic UI components (Button, Input, Table, etc.)
│   └── [Feature]/      # Feature-specific components (e.g., Auth, Dashboard)
├── composables/        # Reusable stateful logic (Vue Composables)
├── layouts/            # Page layout wrappers (DashboardLayout, etc.)
├── pages/              # Vue Router views (File-based routing structure)
├── stores/             # Pinia Global State Modules
├── utils/              # Helper functions & core utilities (Axios, Validators)
├── App.vue             # Root component
└── main.ts             # Application entry point
```

## 🔑 Key Conventions

### 1. Atomic Design (Base Components)

All reusable UI elements reside in `components/Base/` and are prefixed with `Base`.

- **Do not** use raw HTML tags like `<button>` or `<input>`.
- **Always** use `<BaseButton>`, `<BaseInput>`, etc.
- See `02_BASE_COMPONENTS.md` and `06_DATA_VISUALIZATION.md` for details.

### 2. File Naming

- **Components**: PascalCase (e.g., `BaseTable.vue`, `UserProfile.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useTableHelper.ts`)
- **Stores**: camelCase (e.g., `auth.ts`, `ui.ts`)
- **Pages**: lowercase/kebab-case (matches URL structure)

### 3. Styling Strategy

- **SCSS**: We use SCSS with a focus on **BEM** (optional but encouraged) or scoped styles.
- **Variables**: Defined in `src/assets/styles/_variables.scss`.
- **Mixins**: Common patterns (flexbox, buttons) in `src/assets/styles/_component_mixins.scss`.
- **Avoid**: Hardcoded hex colors. Use variables like `$primary-500`, `$text-secondary`.

### 4. Technical Stack

- **Build Tool**: Vite (Fast HMR)
- **State**: Pinia (Store pattern)
- **Routing**: Vue Router
- **API**: Axios (Transport) + SWRV (Caching/Read)

## 🤖 Agent Resources

Located in `.agent/`. Contains strict rules (`CODING_RULES.md`) and component maps used by AI agents to maintain consistency.
