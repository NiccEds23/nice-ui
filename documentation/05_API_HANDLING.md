# 05. API Handling

We use a hybrid approach for Data Fetching:
1.  **SWRV (Stale-While-Revalidate)**: For **Reading** (GET) data.
2.  **Axios (Helper)**: For **Mutating** (POST, PUT, DELETE) data.

## ⚙️ Configuration
## ⚙️ Configuration
The core configuration is split into specialized utilities in `src/utils/`:
*   `axios-client.ts`: Singleton HttpClient with Auth interceptors.
*   `http-helper.ts`: Generic CRUD functions (`getData`, `postData`, etc.).
*   `fetcher.ts`: Adapter for SWRV using `getData` (supports dynamic config).
*   `formatter.ts`: Number and Currency formatter.

## 📖 Strategy

### 1. Fetching Data (GET)
**Always** use `useSWRV`. It handles caching, deduplication, and auto-revalidation.

```ts
import useSWRV from 'swrv'; // npm i swrv
import fetcher from '@/utils/fetcher';

// Standard
const { data, error, isValidating } = useSWRV('/api/endpoint', fetcher);

// With Parameters (Search, Filter)
// Pass an array: [Endpoint, Config]
const { data } = useSWRV(['/api/users', { params: { role: 'admin' } }], fetcher);

// With Type Safety
const { data } = useSWRV<User[]>('/api/users', fetcher);
```

### 2. Mutating Data (POST/PUT/DELETE)
Use the generic helpers from `@/utils/http-helper`.
**Crucial**: After mutation, you often need to invalidate the SWRV cache so the UI updates automatically.

```ts
import { postData, destroyData } from '@/utils/http-helper';
import { mutate } from 'swrv';

const handleCreate = async (formData) => {
  try {
    const response = await postData('/api/users', formData);
    
    // Trigger re-fetch of the list
    mutate('/api/users'); 
    
    // Or Trigger re-fetch of list with specific params
    mutate(['/api/users', { params: ... }]);
    
  } catch (err) {
    console.error(err);
  }
};
```

## 🛠️ Helpers Reference

Import from `@/utils/http-helper`:

| Function | Usage |
|----------|-------|
| `getData<T>(...)` | Low-level GET. Use `fetcher` instead for components. |
| `postData<T>(type, url, data)` | Create resource. |
| `putData<T>(type, url, data)` | Replace resource. |
| `patchData<T>(type, url, data)` | Update resource partially. |
| `destroyData<T>(type, url)` | Delete resource. |
| `uploadData<T>(type, url, fileData)`| Multipart upload. |
| `downloadFile(type, url)` | Download blob. |

**Note**: `type` argument for helpers is usually `'api_url'` (default environment).

## ⚠️ Error Handling
The helpers return the Axios Promise. Use `try/catch` or `.catch()`.
Validation errors from server (422) should be handled to display form errors.

```ts
try {
  await postData(...)
} catch (err) {
    const { message, success } = errorHelper(err); // Utility to parse error
    uiStore.showToast({ variant: 'danger', message });
}
```
