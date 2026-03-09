# Skill: Implement CRUD Table Page

Follow this workflow to create a standard data management page.

## 1. Setup API & Store
Ensure backend API exists and modify/create the Pinia store to fetch data.

## 2. Page Structure (`src/pages/[feature]/[name].vue`)
Use the following template:

```vue
<template>
  <div class="page-container">
    <!-- Header -->
    <div class="mb-6 d-flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-bold text-primary">Feature Name</h1>
            <BaseBreadcrumb :items="breadcrumbs" />
        </div>
        <BaseButton icon="add" @click="openCreateModal">Create New</BaseButton>
    </div>

    <!-- Table -->
    <BaseCard>
        <BaseTable
            :columns="columns"
            :data="tableData"
            :loading="loading"
            :pagination="pagination"
            v-model:selectedRows="selectedRows"
            v-model:searchQuery="tableRequest.search"
            :sort-by="tableRequest.sortBy"
            :sort-direction="tableRequest.sortDirection"
            @page-change="handlePageChange"
            @update:show="handleShowChange"
            @update:query="handleSearchChange"
            @sort="handleSortChange"
            selectable
            enable-column-visibility
        >
            <!-- Custom Cells -->
            <template #cell-status="{ val }">
                <span class="badge">{{ val }}</span>
            </template>

            <!-- Actions -->
            <template #actions="{ row }">
                 <BaseButton icon="edit" size="sm" variant="ghost" @click="handleEdit(row)" />
                 <BaseButton icon="delete" size="sm" variant="ghost" class="text-danger" @click="handleDelete(row)" />
            </template>

            <!-- Filters (Optional) -->
            <template #filter-content>
                <BaseSelect label="Status" v-model="tableRequest.filters.status" :options="['Active', 'Inactive']" />
                <BaseDatepicker label="Date Range" v-model="tableRequest.filters.date" range />
            </template>
        </BaseTable>
    </BaseCard>

    <!-- Modals (Create/Edit) -->
    <!-- ... -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import useSWRV from 'swrv';
import { tableHelper } from '@/composables/useTableHelper';
import { fetcher } from '@/utils/fetcher';

// 1. Definition
const breadcrumbs = [{ label: 'Home', to: '/' }, { label: 'Feature', to: '' }];
const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: '', align: 'right' }
];

// 2. Reactive State
const selectedRows = ref([]);
const tableRequest = reactive({
    page: 1,
    show: 10,
    sortBy: 'created_at',
    sortDirection: 'desc',
    search: '',
    filters: {
        status: '',
        date: null
    }
});

// 3. SWRV Integration (Reactive Fetching)
// Key is a computed function/array. When tableRequest changes, SWRV auto-fetches.
const { data, isValidating, mutate } = useSWRV(
    () => ['/api/features', { params: tableRequest }], 
    fetcher
);

// 4. Helper Integration
// We pass 'mutate' as the callback so helper methods can trigger re-validation if needed,
// although SWRV reactivity handles most cases automatically.
const helper = tableHelper(tableRequest, () => mutate());

const { 
    setPage: handlePageChange,
    setShow: handleShowChange,
    setSearch: handleSearchChange,
    setSort: handleSortChange
} = helper;

// 5. Computed Data for Table
const tableData = computed(() => data.value?.data || []);
const loading = computed(() => isValidating.value && !data.value); // Initial loading state
const pagination = computed(() => ({
    currentPage: tableRequest.page,
    perPage: tableRequest.show,
    total: data.value?.meta?.total || 0,
    lastPage: data.value?.meta?.last_page || 1
}));
</script>
```
