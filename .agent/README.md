# Agent Resources

This directory contains essential context, rules, and skills for AI agents working on the **Magic ERP Frontend**.

## 📂 Directory Structure

- **`CODING_RULES.md`**: Strict coding standards. **READ THIS FIRST**.
- **`BASE_COMPONENTS_MAP.md`**: Catalog of available UI components and usage.
- **`skills/`**: Specific workflows for common tasks.
  - `implement_crud.md`: How to build data tables.

## 🚀 Quick Start for Agents

1. **Read `CODING_RULES.md`** to understand the tech stack and constraints.
2. **Check `BASE_COMPONENTS_MAP.md`** before creating any new UI element. Reuse existing components!
3. **Use `skills/`** if your task matches a known workflow.

## ⚠️ Critical Reminders

- **Data Fetching**: Use SWRV for GET, Axios for POST/PUT/DELETE. See `CODING_RULES.md` Section 4.
- **BaseModal**: Always use `v-model:visible="isOpen"`. DO NOT use `v-model`.
- **BaseTable**: Use `useTableHelper` for state management.
- **Styling**: Use SCSS variables from `@/assets/styles/variables`.
