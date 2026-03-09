# 04. State Management (Pinia)

We use **Pinia** for global client-side state management.
**Location**: `src/stores/`

## 🧠 Core Concept: Client vs Server State

*   **Client State (Pinia)**: Data that is not persisted on the server (e.g., Sidebar open/close, Dark mode, Toast notifications, User Session Token).
*   **Server State (SWRV/Axios)**: Data fetched from the API (e.g., User List, Product Details). **Do not store this in Pinia unless absolutely necessary** (e.g., for complex cross-component manipulation without re-fetching).

## 🗄️ Available Stores

### 1. Auth Store (`auth.ts`)
Manages the user's session.
*   `token`: The JWT token (persisted in `localStorage`).
*   `user`: Current user profile data.
*   `setToken(token)`: Updates token (and localStorage).

```ts
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
console.log(auth.token);
```

### 2. UI Store (`ui.ts`)
Manages global UI feedback.
*   `isLoading`: Global loading overlay.
*   `toasts`: Array of active toast notifications.
*   `showToast({ title, message, variant })`: Trigger a notification.

```ts
import { useUIStore } from '@/stores/ui';
const ui = useUIStore();
ui.showToast({ title: 'Success', message: 'Saved!', variant: 'success' });
```

### 3. Sidebar Store (`sidebar.ts`)
Manages the navigation menu state.
*   `isOpen`: Boolean for mobile sidebar toggle.
*   `menuItems`: Configuration of links in the sidebar.

## 🛠️ Creating a New Store

Use the **Setup Store** syntax (similar to Composables):

```ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMyStore = defineStore('myStore', () => {
    // State
    const count = ref(0);
    
    // Actions
    const increment = () => count.value++;
    
    // Getters (Computed)
    // const double = computed(() => count.value * 2);

    return { count, increment };
});
```
