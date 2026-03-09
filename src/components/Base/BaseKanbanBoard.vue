<template>
  <div class="base-kanban" :class="{ 'kanban-compact': compact }">
    <div
      v-for="col in columns"
      :key="col.key"
      class="kanban-column"
      @dragover.prevent
      @drop="onDrop($event, col.key)"
    >
      <!-- Column Header -->
      <div class="column-header">
        <div class="column-header-left">
          <span
            v-if="col.color"
            class="column-dot"
            :style="{ background: col.color }"
          />
          <span class="column-title">{{ col.title }}</span>
          <BaseBadge variant="neutral" size="xs" pill>{{
            col.cards.length
          }}</BaseBadge>
        </div>
        <slot name="column-actions" :col="col" />
      </div>

      <!-- Cards -->
      <div class="column-body">
        <div
          v-for="card in col.cards"
          :key="card.id"
          class="kanban-card"
          :class="[
            `card-priority-${card.priority ?? 'medium'}`,
            { 'card-dragging': dragging === card.id },
          ]"
          draggable="true"
          @dragstart="onDragStart($event, card.id, col.key)"
          @dragend="dragging = null"
        >
          <slot name="card" :card="card" :col="col">
            <!-- Default card layout -->
            <div class="card-header">
              <span class="card-title">{{ card.title }}</span>
              <BaseBadge
                v-if="card.priority"
                :variant="priorityVariant(card.priority)"
                size="xs"
                pill
              >
                {{ card.priority }}
              </BaseBadge>
            </div>
            <p v-if="card.description" class="card-desc">
              {{ card.description }}
            </p>
            <div v-if="card.tags?.length" class="card-tags">
              <BaseBadge
                v-for="tag in card.tags"
                :key="tag"
                variant="neutral"
                size="xs"
                >{{ tag }}</BaseBadge
              >
            </div>
            <div v-if="card.assignee || card.dueDate" class="card-footer">
              <span v-if="card.assignee" class="card-assignee">
                <span class="material-symbols-outlined">person</span>
                {{ card.assignee }}
              </span>
              <span v-if="card.dueDate" class="card-due">
                <span class="material-symbols-outlined">calendar_today</span>
                {{ card.dueDate }}
              </span>
            </div>
          </slot>
        </div>

        <!-- Empty drop zone -->
        <div v-if="col.cards.length === 0" class="column-empty">
          <span class="material-symbols-outlined">inbox</span>
          <p>Drag cards here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseBadge from "./BaseBadge.vue";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  tags?: string[];
  assignee?: string;
  dueDate?: string;
}

export interface KanbanColumn {
  key: string;
  title: string;
  color?: string;
  cards: KanbanCard[];
}

const props = withDefaults(
  defineProps<{
    columns: KanbanColumn[];
    compact?: boolean;
  }>(),
  {
    compact: false,
  },
);

const emit = defineEmits<{
  "move-card": [cardId: string, fromCol: string, toCol: string];
  "update:columns": [columns: KanbanColumn[]];
}>();

const dragging = ref<string | null>(null);
let dragSource = { cardId: "", colKey: "" };

function onDragStart(e: DragEvent, cardId: string, colKey: string) {
  dragging.value = cardId;
  dragSource = { cardId, colKey };
  e.dataTransfer?.setData("text/plain", cardId);
}

function onDrop(e: DragEvent, targetCol: string) {
  e.preventDefault();
  const { cardId, colKey: fromCol } = dragSource;
  if (!cardId || fromCol === targetCol) return;

  const updated = props.columns.map((col) => ({
    ...col,
    cards:
      col.key === fromCol
        ? col.cards.filter((c) => c.id !== cardId)
        : col.key === targetCol
          ? [
              ...col.cards,
              props.columns
                .find((c) => c.key === fromCol)!
                .cards.find((c) => c.id === cardId)!,
            ]
          : col.cards,
  }));

  emit("update:columns", updated);
  emit("move-card", cardId, fromCol, targetCol);
  dragging.value = null;
}

function priorityVariant(p: string): "danger" | "warning" | "info" | "neutral" {
  const map: Record<string, "danger" | "warning" | "info" | "neutral"> = {
    urgent: "danger",
    high: "warning",
    medium: "info",
    low: "neutral",
  };
  return map[p] ?? "neutral";
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-kanban {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.kanban-column {
  min-width: 16rem;
  width: 16rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  background: var(--neutral-50);
  border: 1px solid var(--border-light);
  border-radius: 1.25rem;
  padding: 0.875rem;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-light);
}

.column-header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.column-dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.column-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: $text-primary;
}

.column-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 4rem;
}

.kanban-card {
  background: var(--surface-white);
  border: 1px solid var(--border-light);
  border-radius: 0.875rem;
  padding: 0.875rem;
  cursor: grab;
  transition: all 0.18s;
  user-select: none;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &.card-dragging {
    opacity: 0.45;
    transform: rotate(2deg) scale(0.97);
  }

  &.card-priority-urgent {
    border-left: 3px solid $status-danger;
  }

  &.card-priority-high {
    border-left: 3px solid $status-warning;
  }
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
}

.card-desc {
  font-size: 0.75rem;
  color: $text-secondary;
  margin: 0 0 0.5rem;
  line-height: 1.5;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-light);
  font-size: 0.6875rem;
  color: $text-muted;
}

.card-assignee,
.card-due {
  display: flex;
  align-items: center;
  gap: 0.25rem;

  .material-symbols-outlined {
    font-size: 0.875rem;
  }
}

.column-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;
  color: $text-muted;
  gap: 0.25rem;

  .material-symbols-outlined {
    font-size: 1.5rem;
    opacity: 0.4;
  }

  p {
    font-size: 0.75rem;
    margin: 0;
  }
}

.kanban-compact {
  .kanban-column {
    min-width: 13rem;
    width: 13rem;
    padding: 0.625rem;
  }

  .kanban-card {
    padding: 0.625rem;
  }
}
</style>
