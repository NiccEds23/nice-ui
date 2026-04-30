<template>
  <div class="kanban-page">
    <!-- ── Page Header ──────────────────────────────────────────────────── -->
    <div class="page-header">
      <div class="page-header-text">
        <h1 class="page-title">Kanban Board</h1>
        <p class="page-subtitle">
          Track and manage project tasks across stages
        </p>
      </div>
      <div class="page-header-actions">
        <BaseButton
          variant="secondary"
          icon="view_column"
          @click="columnModalVisible = true"
        >
          New Column
        </BaseButton>
        <BaseButton icon="add" @click="openAddCard()">New Card</BaseButton>
      </div>
    </div>

    <!-- ── Stats Strip ──────────────────────────────────────────────────── -->
    <div class="stats-strip">
      <BaseStatCard
        :value="totalCards"
        label="Total Cards"
        icon="dashboard"
        variant="primary"
        :format-value="false"
      />
      <BaseStatCard
        :value="urgentCount"
        label="Urgent"
        icon="priority_high"
        variant="danger"
        :format-value="false"
      />
      <BaseStatCard
        :value="inProgressCount"
        label="In Progress"
        icon="pending_actions"
        variant="warning"
        :format-value="false"
      />
      <BaseStatCard
        :value="doneCount"
        label="Completed"
        icon="task_alt"
        variant="success"
        :format-value="false"
      />
    </div>

    <!-- ── Board ────────────────────────────────────────────────────────── -->
    <BaseKanbanBoard v-model:columns="columns">
      <!-- Per-column action buttons in header -->
      <template #column-actions="{ col }">
        <div class="col-header-btns">
          <button
            class="col-btn"
            title="Add card"
            @click.stop="openAddCard(col.key)"
          >
            <span class="material-symbols-outlined">add</span>
          </button>
          <button
            class="col-btn col-btn--del"
            title="Delete column"
            @click.stop="confirmDeleteColumn(col)"
          >
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </template>

      <!-- Custom card layout with edit / delete -->
      <template #card="{ card, col }">
        <div class="kcard-head">
          <span class="kcard-title">{{ card.title }}</span>
          <div class="kcard-actions">
            <BaseBadge
              v-if="card.priority"
              :variant="priorityVariant(card.priority)"
              size="xs"
              pill
              >{{ card.priority }}</BaseBadge
            >
          </div>
        </div>
        <p v-if="card.description" class="kcard-desc">{{ card.description }}</p>
        <div v-if="card.tags?.length" class="kcard-tags">
          <BaseBadge
            v-for="tag in card.tags"
            :key="tag"
            variant="neutral"
            size="xs"
          >
            {{ tag }}
          </BaseBadge>
        </div>
        <div v-if="card.assignee || card.dueDate" class="kcard-foot">
          <span v-if="card.assignee" class="kcard-meta">
            <span class="material-symbols-outlined">person</span
            >{{ card.assignee }}
          </span>
          <span v-if="card.dueDate" class="kcard-meta">
            <span class="material-symbols-outlined">calendar_today</span
            >{{ card.dueDate }}
          </span>
        </div>
        <div class="kcard-btn-group">
          <button
            class="kcard-btn"
            title="Edit"
            @click.stop="openEditCard(card, col.key)"
          >
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button
            class="kcard-btn kcard-btn--del"
            title="Delete"
            @click.stop="confirmDeleteCard(card, col.key)"
          >
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </template>
    </BaseKanbanBoard>

    <!-- ── Add / Edit Card Modal ────────────────────────────────────────── -->
    <BaseModal
      v-model:visible="cardModalVisible"
      :title="editingCard ? 'Edit Card' : 'New Card'"
      size="md"
    >
      <div class="modal-form">
        <BaseInput
          v-model="cardForm.title"
          label="Title"
          placeholder="Card title"
          required
          :error="cardErrors.title"
        />
        <BaseTextarea
          v-model="cardForm.description"
          label="Description"
          placeholder="Optional description..."
          :rows="3"
        />
        <div class="form-row">
          <BaseSelect
            v-model="cardForm.columnKey"
            label="Column"
            :options="columnOptions"
            required
          />
          <BaseSelect
            v-model="cardForm.priority"
            label="Priority"
            :options="PRIORITY_OPTIONS"
          />
        </div>
        <div class="form-row">
          <BaseInput
            v-model="cardForm.assignee"
            label="Assignee"
            placeholder="Name"
            icon="person"
          />
          <BaseDatepicker v-model="cardForm.dueDate" label="Due Date" />
        </div>
        <!-- Tags -->
        <div>
          <label class="field-label">Tags</label>
          <div class="tag-input-row">
            <BaseInput
              v-model="tagInput"
              placeholder="Type and press Enter or click Add"
              @keydown.enter.prevent="addTag"
            />
            <BaseButton
              variant="secondary"
              size="sm"
              icon="add"
              @click="addTag"
            />
          </div>
          <div v-if="cardForm.tags.length" class="tag-list">
            <span v-for="t in cardForm.tags" :key="t" class="tag-chip">
              {{ t }}
              <button @click="removeTag(t)">
                <span class="material-symbols-outlined">close</span>
              </button>
            </span>
          </div>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="ghost" block @click="cardModalVisible = false"
          >Cancel</BaseButton
        >
        <BaseButton block @click="saveCard">
          {{ editingCard ? "Save Changes" : "Create Card" }}
        </BaseButton>
      </template>
    </BaseModal>

    <!-- ── Add Column Modal ─────────────────────────────────────────────── -->
    <BaseModal
      v-model:visible="columnModalVisible"
      title="New Column"
      size="sm"
    >
      <div class="modal-form">
        <BaseInput
          v-model="columnForm.title"
          label="Column Title"
          placeholder="e.g. In Review"
          required
          :error="columnErrors.title"
        />
        <div>
          <label class="field-label">Color</label>
          <div class="color-swatches">
            <button
              v-for="c in COLUMN_COLORS"
              :key="c"
              class="swatch"
              :class="{ 'swatch--active': columnForm.color === c }"
              :style="{ background: c }"
              @click="columnForm.color = c"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="ghost" block @click="columnModalVisible = false"
          >Cancel</BaseButton
        >
        <BaseButton block @click="saveColumn">Create Column</BaseButton>
      </template>
    </BaseModal>

    <!-- ── Delete Card Confirm ──────────────────────────────────────────── -->
    <BaseModal
      v-model:visible="deleteCardVisible"
      title="Delete Card"
      size="sm"
    >
      <p class="confirm-text">
        Delete <strong>{{ cardToDelete?.card.title }}</strong
        >? This cannot be undone.
      </p>
      <template #footer>
        <BaseButton variant="ghost" block @click="deleteCardVisible = false"
          >Cancel</BaseButton
        >
        <BaseButton variant="danger" block @click="executeDeleteCard"
          >Delete</BaseButton
        >
      </template>
    </BaseModal>

    <!-- ── Delete Column Confirm ────────────────────────────────────────── -->
    <BaseModal
      v-model:visible="deleteColVisible"
      title="Delete Column"
      size="sm"
    >
      <p class="confirm-text">
        Delete column <strong>{{ colToDelete?.title }}</strong
        >?
        <template v-if="colToDeleteCardCount > 0">
          This will also remove
          <strong>{{ colToDeleteCardCount }} card(s)</strong>.
        </template>
      </p>
      <template #footer>
        <BaseButton variant="ghost" block @click="deleteColVisible = false"
          >Cancel</BaseButton
        >
        <BaseButton variant="danger" block @click="executeDeleteColumn"
          >Delete</BaseButton
        >
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type {
  KanbanCard,
  KanbanColumn,
} from "@/components/Base/BaseKanbanBoard.vue";

// ── Constants ─────────────────────────────────────────────────────────────────
const COLUMN_COLORS = [
  "#94a3b8",
  "#3b82f6",
  "#f59e0b",
  "#22c55e",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#f97316",
];

const PRIORITY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

// ── Data ──────────────────────────────────────────────────────────────────────
const columns = ref<KanbanColumn[]>([
  {
    key: "backlog",
    title: "Backlog",
    color: "#94a3b8",
    cards: [
      {
        id: "c1",
        title: "Research competitor UX",
        priority: "low",
        tags: ["research"],
        assignee: "Alice",
      },
      {
        id: "c2",
        title: "Update design tokens",
        description: "Align color scales with new brand guidelines.",
        priority: "medium",
        tags: ["design"],
      },
      {
        id: "c3",
        title: "Write API documentation",
        priority: "low",
        assignee: "Bob",
        dueDate: "2026-05-20",
      },
    ],
  },
  {
    key: "in-progress",
    title: "In Progress",
    color: "#3b82f6",
    cards: [
      {
        id: "c4",
        title: "Implement BaseCalendarView",
        description:
          "Multi-day events, CRUD modal, overlap detection in daily view.",
        priority: "high",
        tags: ["frontend", "component"],
        assignee: "Alice",
        dueDate: "2026-05-05",
      },
      {
        id: "c5",
        title: "Fix auth token refresh",
        priority: "urgent",
        tags: ["backend", "bug"],
        assignee: "Charlie",
        dueDate: "2026-05-02",
      },
      {
        id: "c6",
        title: "Dashboard performance audit",
        priority: "medium",
        assignee: "Bob",
      },
    ],
  },
  {
    key: "review",
    title: "In Review",
    color: "#f59e0b",
    cards: [
      {
        id: "c7",
        title: "BaseStatCard overflow fix",
        priority: "medium",
        tags: ["ui", "bug"],
        assignee: "Alice",
      },
      {
        id: "c8",
        title: "Kanban drag & drop",
        description: "Cross-column card movement with visual feedback.",
        priority: "high",
        tags: ["frontend"],
        assignee: "Charlie",
        dueDate: "2026-05-01",
      },
    ],
  },
  {
    key: "done",
    title: "Done",
    color: "#22c55e",
    cards: [
      {
        id: "c9",
        title: "BaseDatepicker datetime mode",
        priority: "medium",
        tags: ["component"],
        assignee: "Alice",
      },
      {
        id: "c10",
        title: "Setup CI/CD pipeline",
        priority: "high",
        assignee: "Bob",
        dueDate: "2026-04-25",
      },
      {
        id: "c11",
        title: "User authentication flow",
        description: "Login, register, forgot password pages.",
        priority: "high",
        tags: ["auth"],
        assignee: "Charlie",
      },
    ],
  },
]);

// ── Stats ─────────────────────────────────────────────────────────────────────
const allCards = computed(() => columns.value.flatMap((c) => c.cards));
const totalCards = computed(() => allCards.value.length);
const urgentCount = computed(
  () => allCards.value.filter((c) => c.priority === "urgent").length,
);
const inProgressCount = computed(
  () => columns.value.find((c) => c.key === "in-progress")?.cards.length ?? 0,
);
const doneCount = computed(
  () => columns.value.find((c) => c.key === "done")?.cards.length ?? 0,
);

const columnOptions = computed(() =>
  columns.value.map((c) => ({ label: c.title, value: c.key })),
);

// ── Helpers ───────────────────────────────────────────────────────────────────
function priorityVariant(p: string): "danger" | "warning" | "info" | "neutral" {
  const map: Record<string, "danger" | "warning" | "info" | "neutral"> = {
    urgent: "danger",
    high: "warning",
    medium: "info",
    low: "neutral",
  };
  return map[p] ?? "neutral";
}

function genId() {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Card Form ─────────────────────────────────────────────────────────────────
interface CardForm {
  title: string;
  description: string;
  priority: string;
  assignee: string;
  dueDate: string;
  tags: string[];
  columnKey: string;
}

const cardModalVisible = ref(false);
const editingCard = ref<KanbanCard | null>(null);
const editingCardOriginalColumn = ref("");
const tagInput = ref("");
const cardErrors = ref({ title: "" });

function emptyCardForm(colKey?: string): CardForm {
  return {
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    dueDate: "",
    tags: [],
    columnKey: colKey ?? columns.value[0]?.key ?? "",
  };
}

const cardForm = ref<CardForm>(emptyCardForm());

function openAddCard(colKey?: string) {
  editingCard.value = null;
  editingCardOriginalColumn.value = "";
  cardForm.value = emptyCardForm(colKey);
  cardErrors.value.title = "";
  cardModalVisible.value = true;
}

function openEditCard(card: KanbanCard, colKey: string) {
  editingCard.value = card;
  editingCardOriginalColumn.value = colKey;
  cardForm.value = {
    title: card.title,
    description: card.description ?? "",
    priority: card.priority ?? "medium",
    assignee: card.assignee ?? "",
    dueDate: card.dueDate ?? "",
    tags: [...(card.tags ?? [])],
    columnKey: colKey,
  };
  cardErrors.value.title = "";
  cardModalVisible.value = true;
}

function addTag() {
  const t = tagInput.value.trim();
  if (t && !cardForm.value.tags.includes(t)) cardForm.value.tags.push(t);
  tagInput.value = "";
}

function removeTag(tag: string) {
  cardForm.value.tags = cardForm.value.tags.filter((t) => t !== tag);
}

function buildCard(id: string): KanbanCard {
  const c: KanbanCard = { id, title: cardForm.value.title.trim() };
  if (cardForm.value.description.trim())
    c.description = cardForm.value.description.trim();
  if (cardForm.value.priority)
    c.priority = cardForm.value.priority as KanbanCard["priority"];
  if (cardForm.value.assignee.trim())
    c.assignee = cardForm.value.assignee.trim();
  if (cardForm.value.dueDate) c.dueDate = cardForm.value.dueDate;
  if (cardForm.value.tags.length) c.tags = [...cardForm.value.tags];
  return c;
}

function saveCard() {
  if (!cardForm.value.title.trim()) {
    cardErrors.value.title = "Title is required.";
    return;
  }
  cardErrors.value.title = "";

  const cardId = editingCard.value?.id ?? genId();
  const newCard = buildCard(cardId);
  const targetCol = cardForm.value.columnKey;
  const sourceCol = editingCardOriginalColumn.value;

  columns.value = columns.value.map((col) => {
    if (editingCard.value) {
      if (col.key === sourceCol && col.key === targetCol) {
        return {
          ...col,
          cards: col.cards.map((c) => (c.id === cardId ? newCard : c)),
        };
      }
      if (col.key === sourceCol) {
        return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
      }
      if (col.key === targetCol) {
        return { ...col, cards: [...col.cards, newCard] };
      }
    } else {
      if (col.key === targetCol) {
        return { ...col, cards: [...col.cards, newCard] };
      }
    }
    return col;
  });

  cardModalVisible.value = false;
}

// ── Delete Card ───────────────────────────────────────────────────────────────
const deleteCardVisible = ref(false);
const cardToDelete = ref<{ card: KanbanCard; colKey: string } | null>(null);

function confirmDeleteCard(card: KanbanCard, colKey: string) {
  cardToDelete.value = { card, colKey };
  deleteCardVisible.value = true;
}

function executeDeleteCard() {
  if (!cardToDelete.value) return;
  const { card, colKey } = cardToDelete.value;
  columns.value = columns.value.map((col) =>
    col.key === colKey
      ? { ...col, cards: col.cards.filter((c) => c.id !== card.id) }
      : col,
  );
  deleteCardVisible.value = false;
  cardToDelete.value = null;
}

// ── Column Form ───────────────────────────────────────────────────────────────
const columnModalVisible = ref(false);
const columnForm = ref({ title: "", color: COLUMN_COLORS[0] });
const columnErrors = ref({ title: "" });

function saveColumn() {
  if (!columnForm.value.title.trim()) {
    columnErrors.value.title = "Title is required.";
    return;
  }
  columnErrors.value.title = "";
  const key = `${columnForm.value.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
  columns.value.push({
    key,
    title: columnForm.value.title.trim(),
    color: columnForm.value.color,
    cards: [],
  });
  columnForm.value = { title: "", color: COLUMN_COLORS[0] };
  columnModalVisible.value = false;
}

// ── Delete Column ─────────────────────────────────────────────────────────────
const deleteColVisible = ref(false);
const colToDelete = ref<KanbanColumn | null>(null);
const colToDeleteCardCount = computed(
  () => colToDelete.value?.cards.length ?? 0,
);

function confirmDeleteColumn(col: KanbanColumn) {
  colToDelete.value = col;
  deleteColVisible.value = true;
}

function executeDeleteColumn() {
  if (!colToDelete.value) return;
  columns.value = columns.value.filter((c) => c.key !== colToDelete.value!.key);
  deleteColVisible.value = false;
  colToDelete.value = null;
}
</script>

<route lang="yaml">
meta:
  layout: dashboard
  breadcrumb:
    - name: Home
      route: /
    - name: Kanban
      route: null
</route>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.kanban-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

// ─── Header ────────────────────────────────────────────────────────────────
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  .page-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: $text-primary;
    letter-spacing: -0.02em;
    margin: 0 0 0.25rem;
  }

  .page-subtitle {
    font-size: 0.9375rem;
    color: $text-secondary;
    margin: 0;
  }

  .page-header-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-shrink: 0;
  }
}

// ─── Stats ──────────────────────────────────────────────────────────────────
.stats-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

// ─── Column header action buttons ───────────────────────────────────────────
.col-header-btns {
  display: flex;
  gap: 0.25rem;
}

.col-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.625rem;
  height: 1.625rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: $text-muted;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;

  .material-symbols-outlined {
    font-size: 1rem;
  }

  &:hover {
    background: var(--surface-glass);
    color: $text-primary;
  }

  &.col-btn--del:hover {
    background: rgba($status-danger-rgb, 0.1);
    color: $status-danger;
  }
}

// ─── Card slot styles ────────────────────────────────────────────────────────
.kcard-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.kcard-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
  flex: 1;
  min-width: 0;
}

.kcard-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.kcard-btn-group {
  display: none;
  gap: 0.25rem;
  justify-content: flex-end;
}

.kanban-card:hover .kcard-btn-group {
  display: flex;
}

.kcard-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.375rem;
  height: 1.375rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  color: $text-muted;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  opacity: 0;

  .material-symbols-outlined {
    font-size: 0.875rem;
  }

  &:hover {
    background: var(--surface-glass);
    color: $text-secondary;
  }
  &.kcard-btn--del:hover {
    background: rgba($status-danger-rgb, 0.1);
    color: $status-danger;
  }
}

// Show action buttons on card hover
:deep(.kanban-card:hover) .kcard-btn {
  opacity: 1;
}

.kcard-desc {
  font-size: 0.75rem;
  color: $text-secondary;
  margin: 0 0 0.5rem;
  line-height: 1.5;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.kcard-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.kcard-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-light);
}

.kcard-meta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  color: $text-muted;

  .material-symbols-outlined {
    font-size: 0.875rem;
  }
}

// ─── Modal form ──────────────────────────────────────────────────────────────
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $text-secondary;
  margin-bottom: 0.5rem;
}

.tag-input-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.625rem 0.125rem 0.75rem;
  background: color-mix(in srgb, var(--primary-color) 12%, transparent);
  color: $primary-color;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;

  button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
    padding: 0;

    &:hover {
      opacity: 1;
    }

    .material-symbols-outlined {
      font-size: 0.875rem;
    }
  }
}

// ─── Column color swatches ───────────────────────────────────────────────────
.color-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.swatch {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition:
    transform 0.15s,
    border-color 0.15s;

  &:hover {
    transform: scale(1.15);
  }
  &.swatch--active {
    border-color: $text-primary;
    transform: scale(1.15);
  }
}

// ─── Confirm text ────────────────────────────────────────────────────────────
.confirm-text {
  font-size: 0.9375rem;
  color: $text-secondary;
  line-height: 1.6;
  margin: 0;

  strong {
    color: $text-primary;
  }
}
</style>
