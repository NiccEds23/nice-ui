# 03. Layouts & Pages

## 📐 Layouts
Layouts wrap our pages and provide consistent structure (Sidebar, Header, Footer).
**Location**: `src/layouts/`

### DashboardLayout.vue
The main layout for the authenticated application.
*   **Sidebar**: Controlled by `src/stores/sidebar.ts`.
*   **Header**: `DashboardNavbar.vue`.
    *   Uses `DashboardNavbarActions.vue` for User Profile, Logout, and `DashboardNotifications.vue`.
*   **Slots**: `<router-view>` renders the page content.

**Usage**:
Usually configured in `router/index.ts` (Meta fields) or directly in `App.vue` based on route meta.

---

## 📄 Pages
Pages are Vue components mapped to routes.
**Location**: `src/pages/`

### Creating a New Page
1.  **Create File**: `src/pages/[feature]/[index].vue`
2.  **Scaffold**:
    ```vue
    <template>
      <div class="page-container">
        <BaseBreadcrumb :items="breadcrumbs" />
        <BaseCard class="mt-4">
           <!-- Content -->
        </BaseCard>
      </div>
    </template>
    
    <script setup lang="ts">
    const breadcrumbs = [
      { label: 'Home', to: '/' },
      { label: 'My Page', to: '' } // Current page has empty 'to'
    ];
    </script>
    ```

### CRUD Page Pattern
For data-heavy pages (Lists), we use `useTableHelper` to manage state.

**Standard Pattern**:
1.  **Header**: Title + "Create New" Button.
2.  **Table**: `<BaseTable>` with bound states.
3.  **Search/Filter**: Bound to `tableRequest`.
4.  **Modals**: For Create/Edit/Delete confirmation.

**(See `05_API_HANDLING.md` for fetching data)**

### Sidebar Configuration
To add your page to the sidebar:
1.  Open `src/stores/sidebar.ts`
2.  Add an entry to `menuItems`:
    ```ts
    {
      label: 'My Feature',
      icon: 'star',
      to: '/my-feature'
    }
    ```
