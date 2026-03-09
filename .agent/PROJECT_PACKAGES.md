# Project Standard Packages

This document defines the **MANDATORY** packages and their usage rules.
**Agent Requirement**: You must use these packages for their respective purposes. Do not introduce alternatives without explicit user permission.

## 1. Core Framework
| Package | Version | Usage Rule |
|:---|:---|:---|
| **`vue`** | ^3.5.x | Use **Composition API** with `<script setup lang="ts">`. Options API is **FORBIDDEN**. |
| **`typescript`** | ~5.9.x | Strict typing is enforced. Avoid `any`. Define interfaces for all API responses. |
| **`vite`** | ^7.2.x | Use for dev server and build. Respect `vite.config.ts` alias (`@/`). |

## 2. Routing
| Package | Version | Usage Rule |
|:---|:---|:---|
| **`vue-router`** | ^4.6.x | Use `useRouter` and `useRoute` composables. |
| **`unplugin-vue-router`** | ^0.10.x | **File-based routing**. Create files in `src/pages/`. Do not manually configure routes. |

## 3. State Management & API
| Package | Version | Usage Rule |
|:---|:---|:---|
| **`pinia`** | ^3.0.x | Use for **Client-side State** (Auth, UI, Theme) ONLY. Do not store massive server data here. |
| **`swrv`** | ^1.1.x | **MANDATORY** for **GET** requests. Provides caching & revalidation. |
| **`axios`** | ^1.13.x | Use for **Mutations** (POST/PUT/DELETE) via `src/utils/http-helper.ts`. **DO NOT** use `fetch`. |

## 4. UI & Interaction
| Package | Version | Usage Rule |
|:---|:---|:---|
| **`sass`** | ^1.97.x | Use SCSS. Import mixins via `@use '@/assets/styles/component_mixins' as *;`. |
| **`maska`** | ^3.2.x | Use for Input Masking (Currency, Phone, etc.). Integrated into `<BaseInput>`. |

## 5. Developer Experience (Auto-Imports)
| Package | Version | Usage Rule |
|:---|:---|:---|
| **`unplugin-auto-import`** | ^21.0.x | `ref`, `computed`, `watch` are auto-imported. You don't *need* to import them, but explicit import is acceptable for clarity. |
| **`unplugin-vue-components`** | ^31.0.x | Components in `src/components` are auto-imported. **DO NOT** manually import `BaseButton`, `BaseInput`, etc. |

## 6. Forbidden Packages
The following are explicitly **BANNED** in this project:
- ❌ **Vuex** (Use Pinia)
- ❌ **Moment.js** (Use native `Intl` or `dayjs` if installed)
- ❌ **Bootstrap/Tailwind** (Unless explicitly requested. We use custom SCSS Design System)
- ❌ **jQuery** (Absolutely Not)
