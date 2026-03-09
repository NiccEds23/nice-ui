<template>
  <nav class="base-pagination" aria-label="Pagination" v-if="totalPages > 1">
    <!-- Prev -->
    <button
      class="page-btn nav-btn"
      :disabled="currentPage <= 1"
      aria-label="Previous page"
      @click="go(currentPage - 1)"
    >
      <span class="material-symbols-outlined">chevron_left</span>
    </button>

    <!-- Page Numbers -->
    <template v-for="item in pageItems" :key="item.key">
      <span v-if="item.type === 'ellipsis'" class="page-ellipsis">…</span>
      <button
        v-else
        class="page-btn"
        :class="{ active: item.value === currentPage }"
        :aria-label="`Page ${item.value}`"
        :aria-current="item.value === currentPage ? 'page' : undefined"
        @click="go(item.value!)"
      >
        {{ item.value }}
      </button>
    </template>

    <!-- Next -->
    <button
      class="page-btn nav-btn"
      :disabled="currentPage >= totalPages"
      aria-label="Next page"
      @click="go(currentPage + 1)"
    >
      <span class="material-symbols-outlined">chevron_right</span>
    </button>

    <!-- Jump to page -->
    <div v-if="showJump && totalPages > 5" class="page-jump">
      <span class="jump-label">Go to</span>
      <input
        v-model.number="jumpInput"
        class="jump-input"
        type="number"
        :min="1"
        :max="totalPages"
        @keyup.enter="jumpTo"
      />
    </div>

    <!-- Info -->
    <span v-if="totalItems != null" class="page-info">
      {{ totalItems.toLocaleString() }} items
    </span>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    showJump?: boolean;
    siblingCount?: number;
  }>(),
  {
    showJump: false,
    siblingCount: 1,
  },
);

const emit = defineEmits<{
  "update:currentPage": [page: number];
}>();

const jumpInput = ref(props.currentPage);

interface PageItem {
  key: string;
  type: "page" | "ellipsis";
  value?: number;
}

const pageItems = computed((): PageItem[] => {
  const { currentPage, totalPages, siblingCount } = props;
  const pages: PageItem[] = [];

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const left = Math.max(2, currentPage - siblingCount);
  const right = Math.min(totalPages - 1, currentPage + siblingCount);

  pages.push({ key: "1", type: "page", value: 1 });

  if (left > 2) pages.push({ key: "el-left", type: "ellipsis" });

  range(left, right).forEach((p) =>
    pages.push({ key: `p-${p}`, type: "page", value: p }),
  );

  if (right < totalPages - 1) pages.push({ key: "el-right", type: "ellipsis" });

  if (totalPages > 1)
    pages.push({ key: `${totalPages}`, type: "page", value: totalPages });

  return pages;
});

function go(page: number) {
  const clamped = Math.max(1, Math.min(props.totalPages, page));
  if (clamped !== props.currentPage) emit("update:currentPage", clamped);
}

function jumpTo() {
  go(jumpInput.value);
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-pagination {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  border-radius: 0.625rem;
  border: 1px solid var(--border-light);
  background: var(--surface-glass);
  color: $text-primary;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled):not(.active) {
    background: var(--surface-white);
    border-color: $primary-color;
    color: $primary-color;
  }

  &.active {
    background: $primary-color;
    border-color: $primary-color;
    color: #fff;
    box-shadow: 0 2px 8px rgba($primary-rgb, 0.3);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .material-symbols-outlined {
    font-size: 1.1rem;
  }
}

.nav-btn {
  background: var(--surface-glass);
}

.page-ellipsis {
  min-width: 2.25rem;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $text-muted;
  font-size: 0.875rem;
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: 0.5rem;
}

.jump-label {
  font-size: 0.75rem;
  color: $text-muted;
}

.jump-input {
  width: 3rem;
  height: 2.25rem;
  border-radius: 0.625rem;
  border: 1px solid var(--border-light);
  background: var(--surface-glass);
  color: $text-primary;
  text-align: center;
  font-size: 0.8125rem;
  font-weight: 600;
  outline: none;
  appearance: none;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
  }

  &:focus {
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba($primary-rgb, 0.12);
  }
}

.page-info {
  margin-left: 0.75rem;
  font-size: 0.75rem;
  color: $text-muted;
}
</style>
