<template>
  <div class="report-table-container">
    <div class="table-wrapper">
      <table
        class="report-table"
        :style="{ '--left-col-width': `${leftColumnWidth}px` }"
      >
        <thead>
          <tr>
            <!-- Left Axis Header (Resizable) -->
            <th class="left-axis-header sticky-col">
              <div class="th-content">
                {{ leftAxisTitle }}
              </div>
              <!-- Resize Handle -->
              <div class="resize-handle" @mousedown.prevent="startResize"></div>
            </th>

            <!-- Data Headers -->
            <th
              v-for="col in columns"
              :key="col.key"
              :class="`text-${col.align || 'right'}`"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in flattenedData" :key="row.id">
            <tr
              class="report-row"
              :class="{
                'is-parent': row.children && row.children.length > 0,
                expanded: row.expanded,
              }"
            >
              <!-- Left Axis Cell (Tree Control) -->
              <td class="left-axis-cell sticky-col">
                <div
                  class="cell-content"
                  :style="{ paddingLeft: `${row.level * 1.5}rem` }"
                >
                  <button
                    v-if="row.children && row.children.length > 0"
                    class="toggle-btn"
                    @click="toggleRow(row.id)"
                  >
                    <span class="material-symbols-outlined icon">
                      {{ row.expanded ? "expand_more" : "chevron_right" }}
                    </span>
                  </button>
                  <span v-else class="spacer"></span>
                  <span class="label-text">{{ row[labelKey] }}</span>
                </div>
              </td>

              <!-- Data Cells -->
              <td
                v-for="col in columns"
                :key="col.key"
                :class="`text-${col.align || 'right'}`"
              >
                <slot :name="`cell-${col.key}`" :row="row" :val="row[col.key]">
                  {{ row[col.key] }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

interface RowItem {
  id: string | number;
  expanded?: boolean;
  children?: RowItem[];
  [key: string]: any;
}

const props = defineProps({
  columns: { type: Array as () => Column[], default: () => [] },
  data: { type: Array as () => RowItem[], default: () => [] },
  leftAxisTitle: { type: String, default: "Account" },
  labelKey: { type: String, default: "label" }, // Key to show in left axis
  defaultExpanded: { type: Boolean, default: true },
});

// State
const leftColumnWidth = ref(300);
const expandedRows = ref<Set<string | number>>(new Set());

// Resize Logic
const isResizing = ref(false);
const startX = ref(0);
const startWidth = ref(0);

const startResize = (e: MouseEvent) => {
  isResizing.value = true;
  startX.value = e.pageX;
  startWidth.value = leftColumnWidth.value;

  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
};

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return;
  const diff = e.pageX - startX.value;
  // Min width 150px, Max width 600px
  leftColumnWidth.value = Math.max(150, Math.min(600, startWidth.value + diff));
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
};

// Tree Logic
const initExpanded = () => {
  if (props.defaultExpanded) {
    const expandAll = (items: RowItem[]) => {
      items.forEach((item) => {
        if (item.children) {
          expandedRows.value.add(item.id);
          expandAll(item.children);
        }
      });
    };
    expandAll(props.data);
  }
};

watch(() => props.data, initExpanded, { immediate: true });

const toggleRow = (id: string | number) => {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id);
  } else {
    expandedRows.value.add(id);
  }
};

// Flatten data for simple table rendering (while keeping tree sorting)
const flattenedData = computed(() => {
  const result: (RowItem & { level: number; expanded: boolean })[] = [];

  const flatten = (items: RowItem[], level: number) => {
    items.forEach((item) => {
      // Add current item
      result.push({
        ...item,
        level,
        expanded: expandedRows.value.has(item.id),
      });

      // If expanded, flatten children
      if (item.children && expandedRows.value.has(item.id)) {
        flatten(item.children, level + 1);
      }
    });
  };

  flatten(props.data, 0);
  return result;
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/component_mixins" as *;

.report-table-container {
  @include table-container;
  position: relative;
  background: var(
    --surface-white
  ); // Theme-aware: white in light, dark slate in dark
  height: 100%;
}

.table-wrapper {
  overflow: auto;
  width: 100%;
  flex: 1;
}

.report-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;

  --left-col-width: 300px;

  th,
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-light);
    white-space: nowrap;
    box-sizing: border-box;
  }

  // Header Styles
  thead {
    position: sticky;
    top: 0;
    z-index: 30;
    background: var(--neutral-50);

    th {
      position: sticky;
      top: 0;
      z-index: 30;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: $text-secondary;
      border-bottom: 2px solid var(--border-light);
      background: var(--neutral-50);

      &.sticky-col {
        position: sticky;
        left: 0;
        top: 0;
        z-index: 40;
        background: var(--neutral-50);
        width: var(--left-col-width);
        min-width: var(--left-col-width);
        max-width: var(--left-col-width);
        border-right: 1px solid var(--border-light);

        .th-content {
          display: flex;
          align-items: center;
          height: 100%;
        }
      }
    }
  }

  // Resize Handle
  .resize-handle {
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 100%;
    cursor: col-resize;
    transition: background 0.2s;

    &:hover {
      background: $primary-color;
    }

    &::after {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--border-light);
    }
  }

  // Body Styles
  tbody {
    tr {
      &:hover {
        background: var(--neutral-100);

        .sticky-col {
          background: var(--neutral-100);
        }
      }

      // Parent Row Styling
      &.is-parent {
        background: var(--neutral-50);

        .sticky-col {
          background: var(--neutral-50);
        }

        td {
          font-weight: 600;
          color: $text-primary;
        }

        &:hover {
          background: var(--neutral-100);
          .sticky-col {
            background: var(--neutral-100);
          }
        }
      }

      td {
        font-size: 0.875rem;
        color: $text-primary;

        &.sticky-col {
          position: sticky;
          left: 0;
          z-index: 5;
          background: var(--surface-white);
          border-right: 1px solid var(--border-light);
          width: var(--left-col-width);
          overflow: hidden;
        }

        &.text-right {
          text-align: right;
        }
        &.text-center {
          text-align: center;
        }
        &.text-left {
          text-align: left;
        }
      }
    }
  }

  // Tree Control Styles
  .cell-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden;

    .toggle-btn {
      width: 1.5rem;
      height: 1.5rem;
      border: 1px solid var(--border-light);
      background: var(--surface-white);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
      color: $text-secondary;

      &:hover {
        border-color: $primary-color;
        color: $primary-color;
      }

      .icon {
        font-size: 1.25rem;
      }
    }

    .spacer {
      width: 1.5rem;
      flex-shrink: 0;
    }

    .label-text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
