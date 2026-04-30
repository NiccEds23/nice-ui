<template>
  <div class="table-outer-container" @click="closeContextMenu">
    <!-- Header Section (Title & Actions) -->
    <div class="table-header-section" v-if="title || $slots['header-actions']">
      <div class="header-content">
        <h2 v-if="title" class="table-title">
          {{ title }}
          <span v-if="subtitle" class="table-subtitle">{{ subtitle }}</span>
        </h2>
        <div class="header-actions">
          <slot name="header-actions"></slot>
        </div>
      </div>
    </div>

    <!-- Toolbar Section (Filters & Search) -->
    <div class="table-toolbar">
      <div class="toolbar-left">
        <div v-if="searchable" class="search-wrapper">
          <BaseInput
            :model-value="searchQuery"
            @update:model-value="handleSearch"
            placeholder="Search..."
            icon="search"
            class="search-input-component"
          />
        </div>
      </div>
      <div class="toolbar-right">
        <!-- Filter Button Trigger -->
        <BaseButton
          v-if="$slots['filter-content']"
          variant="ghost"
          icon="filter_list"
          @click="showFilterModal = true"
        >
          Filters
        </BaseButton>

        <slot name="filters"></slot>
        <slot name="toolbar-actions"></slot>
      </div>
    </div>

    <!-- Table Container -->
    <div class="base-table-container">
      <div class="table-wrapper">
        <table class="base-table">
          <thead @contextmenu.prevent="handleHeaderConfirm">
            <tr>
              <th v-if="selectable" class="checkbox-cell">
                <BaseCheckbox
                  :model-value="isAllSelected"
                  @change="toggleSelectAll"
                />
              </th>
              <th
                v-for="col in visibleColumns"
                :key="col.key"
                :class="[
                  col.align ? `text-${col.align}` : 'text-left',
                  { sortable: col.sortable },
                  { 'active-sort': sortBy === col.key },
                ]"
                @click="col.sortable ? handleSort(col.key) : null"
                @contextmenu.prevent.stop="handleHeaderContextMenu($event)"
              >
                <div class="th-content">
                  {{ col.label }}
                  <span
                    v-if="col.sortable"
                    class="material-symbols-outlined sort-icon"
                  >
                    {{ getSortIcon(col.key) }}
                  </span>
                </div>
              </th>
              <th v-if="$slots.actions" class="actions-cell"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in data"
              :key="rowIndex"
              class="glass-table-row"
              :class="{ selected: isSelected(row) }"
            >
              <td v-if="selectable" class="checkbox-cell">
                <BaseCheckbox
                  :model-value="isSelected(row)"
                  @change="toggleSelectRow(row)"
                />
              </td>
              <td
                v-for="col in visibleColumns"
                :key="col.key"
                :class="col.align ? `text-${col.align}` : 'text-left'"
              >
                <slot
                  :name="`cell-${col.key}`"
                  :row="row"
                  :val="row[col.key]"
                  :index="rowIndex"
                >
                  {{ row[col.key] }}
                </slot>
              </td>
              <td v-if="$slots.actions" class="actions-cell">
                <slot name="actions" :row="row" :index="rowIndex"></slot>
              </td>
            </tr>

            <tr v-if="data.length === 0 && !loading">
              <td :colspan="columnCount" class="empty-state">
                <slot name="empty">
                  <div class="empty-content">
                    <span class="material-symbols-outlined icon">inbox</span>
                    <p>No records found</p>
                  </div>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Context Menu for Column Visibility -->
      <Teleport to="body">
        <div
          v-if="contextMenu.show"
          class="context-menu-backdrop"
          @click="closeContextMenu"
        ></div>
        <div
          v-if="contextMenu.show"
          class="column-context-menu"
          :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
          @click.stop
        >
          <div class="menu-header">Show columns</div>
          <div
            v-for="col in columns"
            :key="col.key"
            class="menu-item"
            @click="toggleColumnVisibility(col.key)"
          >
            <span class="material-symbols-outlined check-icon">
              {{ isColumnVisible(col.key) ? "check" : "" }}
            </span>
            <span>{{ col.label }}</span>
          </div>
        </div>
      </Teleport>

      <!-- Advanced Filter Modal -->
      <BaseFilterModal
        v-if="$slots['filter-content']"
        v-model:visible="showFilterModal"
        @apply="$emit('apply-filters')"
        @reset="$emit('reset-filters')"
      >
        <slot name="filter-content"></slot>
      </BaseFilterModal>

      <!-- Footer / Pagination -->
      <div class="table-footer" v-if="pagination">
        <div class="d-flex items-center gap-4">
          <div class="footer-info">
            Showing
            <span class="highlight"
              >{{ paginationStart }}-{{ paginationEnd }}</span
            >
            of <span class="highlight">{{ pagination.total }}</span> results
          </div>
          <div class="per-page-selector" style="width: 80px">
            <BaseSelect
              :model-value="pagination.perPage"
              :options="showOptions"
              @update:model-value="handlePerPageChange"
              :disabled="loading"
              class="sm-select"
            />
          </div>
        </div>

        <div class="pagination-controls">
          <button
            class="page-btn nav-btn"
            :disabled="pagination.currentPage === 1 || loading"
            @click="changePage(pagination.currentPage - 1)"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            class="page-btn"
            :class="{ active: page === pagination.currentPage }"
            @click="changePage(page)"
            :disabled="loading"
          >
            {{ page }}
          </button>

          <button
            class="page-btn nav-btn"
            :disabled="pagination.currentPage === totalPages || loading"
            @click="changePage(pagination.currentPage + 1)"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BaseInput from "@/components/Base/BaseInput.vue";
import BaseSelect from "@/components/Base/BaseSelect.vue";
import BaseCheckbox from "@/components/Base/BaseCheckbox.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseFilterModal from "@/components/Base/BaseFilterModal.vue";

const props = defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  columns: { type: Array as () => any[], default: () => [] },
  data: { type: Array as () => any[], default: () => [] },
  searchable: { type: Boolean, default: true },
  selectable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  pagination: {
    type: Object as () => {
      currentPage: number;
      total: number;
      perPage: number;
      lastPage?: number;
    } | null,
    default: null,
  },
  searchQuery: { type: String, default: "" },
  selectedRows: { type: Array as () => any[], default: () => [] },
  showOptions: {
    type: Array as () => number[],
    default: () => [5, 10, 25, 50, 100],
  },
  enableColumnVisibility: { type: Boolean, default: false },
  sortBy: { type: String, default: "" },
  sortDirection: { type: String, default: "asc" },
});

const emit = defineEmits([
  "update:searchQuery",
  "update:selectedRows",
  "page-change",
  "update:page",
  "update:show",
  "sort",
  "apply-filters",
  "reset-filters",
]);

// Internal State for Column Visibility
const hiddenColumns = ref<string[]>([]);
const showFilterModal = ref(false);
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
});

// Initialize logic
watch(
  () => props.columns,
  () => {
    // Validate hidden columns still exist
    hiddenColumns.value = hiddenColumns.value.filter((k) =>
      props.columns.find((c) => c.key === k),
    );
  },
  { deep: true },
);

const visibleColumns = computed(() => {
  return props.columns.filter((col) => !hiddenColumns.value.includes(col.key));
});

const isColumnVisible = (key: string) => !hiddenColumns.value.includes(key);

const getSortIcon = (key: string) => {
  if (props.sortBy !== key) return "unfold_more";
  return props.sortDirection === "asc" ? "arrow_upward" : "arrow_downward";
};

const columnCount = computed(() => {
  let count = visibleColumns.value.length;
  if (props.selectable) count++;
  return count + 1;
});

// Context Menu Logic
const handleHeaderConfirm = (e: MouseEvent) => {
  if (!props.enableColumnVisibility) return;
  handleHeaderContextMenu(e);
};

const handleHeaderContextMenu = (e: MouseEvent) => {
  if (!props.enableColumnVisibility) return;
  contextMenu.value = {
    show: true,
    x: e.clientX,
    y: e.clientY,
  };
};

const closeContextMenu = () => {
  contextMenu.value.show = false;
};

const toggleColumnVisibility = (key: string) => {
  if (hiddenColumns.value.includes(key)) {
    hiddenColumns.value = hiddenColumns.value.filter((k) => k !== key);
  } else {
    // Prevent hiding the last visible column
    if (visibleColumns.value.length <= 1) return;
    hiddenColumns.value.push(key);
  }
};

// Selection Logic
const isAllSelected = computed(() => {
  return (
    props.data.length > 0 && props.selectedRows.length === props.data.length
  );
});

const isSelected = (row: any) => {
  return props.selectedRows.includes(row);
};

const toggleSelectAll = (checked: boolean) => {
  if (checked && !isAllSelected.value) {
    emit("update:selectedRows", [...props.data]);
  } else {
    emit("update:selectedRows", []);
  }
};

const toggleSelectRow = (row: any) => {
  const selected = [...props.selectedRows];
  const index = selected.indexOf(row);

  if (index === -1) {
    selected.push(row);
  } else {
    selected.splice(index, 1);
  }
  emit("update:selectedRows", selected);
};

// Search Logic
const handleSearch = (val: string) => {
  emit("update:searchQuery", val);
};

// Pagination Logic
const totalPages = computed(() => {
  if (!props.pagination) return 0;
  return (
    props.pagination.lastPage ||
    Math.ceil(props.pagination.total / props.pagination.perPage)
  );
});

const paginationStart = computed(() => {
  if (!props.pagination) return 0;
  return (props.pagination.currentPage - 1) * props.pagination.perPage + 1;
});

const paginationEnd = computed(() => {
  if (!props.pagination) return 0;
  return Math.min(
    props.pagination.currentPage * props.pagination.perPage,
    props.pagination.total,
  );
});

const visiblePages = computed(() => {
  if (!totalPages.value) return [];
  const pages = [];
  const start = Math.max(1, (props.pagination?.currentPage || 1) - 2);
  const end = Math.min(totalPages.value, start + 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  emit("page-change", page);
  emit("update:page", page);
};

const handlePerPageChange = (val: number) => {
  emit("update:show", val);
};

const handleSort = (key: string) => {
  emit("sort", key);
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/component_mixins" as *;

.table-outer-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.table-header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
  }

  .table-title {
    font-size: 2.25rem;
    font-weight: 300;
    color: $text-primary;
    margin: 0;
    letter-spacing: -0.025em;

    .table-subtitle {
      display: block;
      font-size: 0.875rem;
      color: $text-secondary;
      font-weight: 500;
      margin-top: 0.5rem;
      letter-spacing: normal;
    }
  }
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    max-width: 400px;
    justify-content: flex-end;
  }
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 300px;

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: $text-muted;
    pointer-events: none;
  }

  .search-input {
    @include search-input-glass;
  }
}

.base-table-container {
  @include table-container;
}

.table-wrapper {
  overflow-x: auto;
  width: 100%;
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;

  thead {
    th {
      @include table-header-cell;

      .th-content {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      &.checkbox-cell {
        width: 3rem;
        text-align: center;
        padding-left: 2rem;
      }
      &.actions-cell {
        width: 3rem;
      }

      &.sortable {
        cursor: pointer;
        transition: color 0.2s;
        &:hover {
          color: $text-primary;
        }
      }

      &.active-sort {
        color: $text-primary;
        font-weight: 700;
        background: rgba($primary-color, 0.05);

        .sort-icon {
          opacity: 1;
          color: $primary-color;
        }
      }

      .sort-icon {
        font-size: 1rem;
        opacity: 0.5;
      }

      &.text-right {
        text-align: right;
        .th-content {
          justify-content: flex-end;
        }
      }
      &.text-center {
        text-align: center;
        .th-content {
          justify-content: center;
        }
      }
    }
  }

  tbody {
    .glass-table-row {
      @include table-row-hover;
      border-bottom: 1px solid rgba($neutral-200, 0.4);

      &.selected {
        background-color: rgba($primary-hover, 0.05);
      }
    }

    td {
      padding: 1rem 1rem;
      font-size: 0.875rem;
      color: $neutral-700;
      font-weight: 500;

      &.checkbox-cell {
        width: 3rem;
        text-align: center;
        padding-left: 2rem;
      }
      &.actions-cell {
        width: 3rem;
        text-align: right;
        padding-right: 2rem;
      }

      &.text-right {
        text-align: right;
      }
      &.text-center {
        text-align: center;
      }
    }
  }
}

.table-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba($neutral-200, 0.4);
  background: rgba($surface-white, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .footer-info {
    font-size: 0.75rem;
    color: $text-secondary;
    font-weight: 500;

    .highlight {
      color: $text-primary;
      font-weight: 700;
    }
  }

  .pagination-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .page-btn {
    @include pagination-btn;
  }
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;

  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: $text-muted;

    .icon {
      font-size: 3rem;
      opacity: 0.5;
    }
    p {
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0;
    }
  }
}

.context-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background: transparent;
}

.column-context-menu {
  position: fixed;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  min-width: 200px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .menu-header {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    color: $text-secondary;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin-bottom: 0.25rem;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
    color: $text-primary;
    font-size: 0.875rem;

    &:hover {
      background: rgba($primary-color, 0.05);
      color: $primary-color;
    }

    .check-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      color: $primary-color;
    }
  }
}
</style>
