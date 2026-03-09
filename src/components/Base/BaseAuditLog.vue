<template>
  <div class="base-audit-log" :class="{ compact: compact }">
    <!-- Header -->
    <div v-if="title || showSearch" class="audit-header">
      <h3 v-if="title" class="audit-title">
        <span class="material-symbols-outlined">history</span>
        {{ title }}
      </h3>
      <div v-if="showSearch" class="audit-search">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search logs..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="audit-loading">
      <span class="material-symbols-outlined spin">autorenew</span>
      <span>Loading logs...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredLogs.length === 0" class="audit-empty">
      <span class="material-symbols-outlined">manage_search</span>
      <p>No activity logs found.</p>
    </div>

    <!-- Timeline -->
    <div v-else class="audit-timeline">
      <!-- Date Group -->
      <template v-for="(group, date) in groupedLogs" :key="date">
        <div v-if="groupByDate" class="timeline-date-label">
          <span>{{ date }}</span>
        </div>

        <div
          v-for="(entry, idx) in group"
          :key="entry.id ?? idx"
          class="timeline-item"
          :class="{ 'last-in-group': idx === group.length - 1 && groupByDate }"
        >
          <!-- Connector line -->
          <div class="timeline-connector">
            <div
              class="timeline-dot"
              :class="`dot-${entry.action ?? 'default'}`"
            >
              <span class="material-symbols-outlined">{{
                getActionIcon(entry.action)
              }}</span>
            </div>
            <div class="timeline-line"></div>
          </div>

          <!-- Content -->
          <div class="timeline-content">
            <div class="log-header">
              <div class="log-meta">
                <span class="actor-name">{{ entry.actor }}</span>
                <span
                  class="action-badge"
                  :class="`badge-${entry.action ?? 'default'}`"
                >
                  {{ formatAction(entry.action) }}
                </span>
                <span class="resource-name" v-if="entry.resource">
                  <span
                    class="material-symbols-outlined text-muted"
                    style="font-size: 0.875rem"
                    >arrow_forward</span
                  >
                  {{ entry.resource }}
                </span>
              </div>
              <div class="log-time">
                <BaseTooltip
                  :text="formatFullDate(entry.timestamp)"
                  position="left"
                >
                  <span class="time-relative">{{
                    formatRelativeTime(entry.timestamp)
                  }}</span>
                </BaseTooltip>
              </div>
            </div>

            <!-- Description -->
            <p v-if="entry.description" class="log-description">
              {{ entry.description }}
            </p>

            <!-- Changes diff -->
            <div
              v-if="entry.changes && entry.changes.length > 0"
              class="log-changes"
            >
              <button
                class="changes-toggle"
                @click="toggleChanges(entry.id ?? idx)"
              >
                <span class="material-symbols-outlined">{{
                  expandedIds.has(entry.id ?? idx)
                    ? "expand_less"
                    : "expand_more"
                }}</span>
                {{ entry.changes.length }} field{{
                  entry.changes.length > 1 ? "s" : ""
                }}
                changed
              </button>
              <div
                v-show="expandedIds.has(entry.id ?? idx)"
                class="changes-table"
              >
                <div class="changes-row header-row">
                  <span>Field</span>
                  <span>Before</span>
                  <span>After</span>
                </div>
                <div
                  v-for="change in entry.changes"
                  :key="change.field"
                  class="changes-row"
                >
                  <span class="change-field">{{ change.field }}</span>
                  <span class="change-old">{{ change.oldValue ?? "—" }}</span>
                  <span class="change-new">{{ change.newValue ?? "—" }}</span>
                </div>
              </div>
            </div>

            <!-- IP / Device metadata -->
            <div v-if="entry.metadata && showMetadata" class="log-metadata">
              <span v-if="entry.metadata.ip" class="meta-chip">
                <span class="material-symbols-outlined">router</span>
                {{ entry.metadata.ip }}
              </span>
              <span v-if="entry.metadata.device" class="meta-chip">
                <span class="material-symbols-outlined">devices</span>
                {{ entry.metadata.device }}
              </span>
              <span v-if="entry.metadata.location" class="meta-chip">
                <span class="material-symbols-outlined">location_on</span>
                {{ entry.metadata.location }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Pagination / Load More -->
    <div v-if="hasMore && !loading" class="audit-load-more">
      <BaseButton
        variant="ghost"
        size="sm"
        icon="expand_more"
        @click="$emit('loadMore')"
      >
        Load older logs
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuditChange {
  field: string;
  oldValue?: string | null;
  newValue?: string | null;
}

export interface AuditLogEntry {
  id?: string | number;
  actor: string; // Who did the action  (e.g. "John Doe")
  action: string; // What happened       (e.g. "create", "update", "delete", "login", "export")
  resource?: string; // On what             (e.g. "Invoice #INV-001")
  description?: string; // Human-readable desc (e.g. "Updated payment method")
  timestamp: string; // ISO 8601 date string
  changes?: AuditChange[];
  metadata?: {
    ip?: string;
    device?: string;
    location?: string;
  };
}

// ─── Props ───────────────────────────────────────────────────────────────────

const props = withDefaults(
  defineProps<{
    logs: AuditLogEntry[];
    title?: string;
    loading?: boolean;
    hasMore?: boolean;
    compact?: boolean;
    showSearch?: boolean;
    showMetadata?: boolean;
    groupByDate?: boolean;
  }>(),
  {
    title: "",
    loading: false,
    hasMore: false,
    compact: false,
    showSearch: true,
    showMetadata: true,
    groupByDate: true,
  },
);

defineEmits<{
  loadMore: [];
}>();

// ─── State ───────────────────────────────────────────────────────────────────

const searchQuery = ref("");
const expandedIds = ref<Set<string | number>>(new Set());

// ─── Computed ────────────────────────────────────────────────────────────────

const filteredLogs = computed(() => {
  if (!searchQuery.value) return props.logs;
  const q = searchQuery.value.toLowerCase();
  return props.logs.filter(
    (e) =>
      e.actor.toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q) ||
      (e.resource ?? "").toLowerCase().includes(q) ||
      (e.description ?? "").toLowerCase().includes(q),
  );
});

const groupedLogs = computed<Record<string, AuditLogEntry[]>>(() => {
  if (!props.groupByDate) return { all: filteredLogs.value };
  return filteredLogs.value.reduce(
    (acc, entry) => {
      const dateKey = formatGroupDate(entry.timestamp);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(entry);
      return acc;
    },
    {} as Record<string, AuditLogEntry[]>,
  );
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ACTION_ICONS: Record<string, string> = {
  create: "add_circle",
  update: "edit",
  delete: "delete",
  login: "login",
  logout: "logout",
  export: "download",
  import: "upload",
  approve: "check_circle",
  reject: "cancel",
  view: "visibility",
  default: "radio_button_unchecked",
};

const getActionIcon = (action?: string): string =>
  ACTION_ICONS[action ?? "default"] ?? "radio_button_unchecked";

const formatAction = (action?: string): string => {
  if (!action) return "Action";
  return action.charAt(0).toUpperCase() + action.slice(1);
};

const formatRelativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatFullDate(iso);
};

const formatFullDate = (iso: string): string =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatGroupDate = (iso: string): string => {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const toggleChanges = (id: string | number) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id);
  } else {
    expandedIds.value.add(id);
  }
  // Trigger reactivity
  expandedIds.value = new Set(expandedIds.value);
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/component_mixins" as *;

// ── Wrapper ────────────────────────────────────────────────────────────────
.base-audit-log {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
}

// ── Header ─────────────────────────────────────────────────────────────────
.audit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.audit-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: $text-primary;
  margin: 0;

  .material-symbols-outlined {
    font-size: 1.25rem;
    color: $primary-color;
  }
}

.audit-search {
  position: relative;
  flex: 0 0 220px;

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
    color: $text-muted;
    pointer-events: none;
  }

  .search-input {
    @include input-base;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    font-size: 0.8125rem;
    height: 2.25rem;
  }
}

// ── States ─────────────────────────────────────────────────────────────────
.audit-loading,
.audit-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: $text-muted;
  font-size: 0.875rem;

  .material-symbols-outlined {
    font-size: 2.5rem;
    opacity: 0.4;
  }

  p {
    margin: 0;
  }
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// ── Date label ─────────────────────────────────────────────────────────────
.timeline-date-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0 0.75rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: $text-muted;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--border-light);
  }

  &:first-child {
    margin-top: 0;
  }
}

// ── Timeline ───────────────────────────────────────────────────────────────
.audit-timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  position: relative;

  &.last-in-group {
    .timeline-line {
      display: none;
    }
  }

  &:last-child {
    .timeline-line {
      display: none;
    }
  }
}

// ── Connector ──────────────────────────────────────────────────────────────
.timeline-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 2rem;
}

.timeline-dot {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;

  .material-symbols-outlined {
    font-size: 1rem;
  }

  &.dot-create {
    background: rgba(34, 197, 94, 0.15);
    color: $status-success;
  }
  &.dot-update {
    background: rgba(59, 130, 246, 0.15);
    color: $primary-color;
  }
  &.dot-delete {
    background: rgba(239, 68, 68, 0.15);
    color: $status-danger;
  }
  &.dot-login {
    background: rgba(139, 92, 246, 0.15);
    color: $accent-color;
  }
  &.dot-logout {
    background: rgba(100, 116, 139, 0.15);
    color: $text-secondary;
  }
  &.dot-export {
    background: rgba(245, 158, 11, 0.15);
    color: $status-warning;
  }
  &.dot-import {
    background: rgba(6, 182, 212, 0.15);
    color: $secondary-color;
  }
  &.dot-approve {
    background: rgba(34, 197, 94, 0.15);
    color: $status-success;
  }
  &.dot-reject {
    background: rgba(239, 68, 68, 0.15);
    color: $status-danger;
  }
  &.dot-view {
    background: rgba(100, 116, 139, 0.1);
    color: $text-muted;
  }
  &.dot-default {
    background: var(--surface-glass);
    color: $text-muted;
  }
}

.timeline-line {
  width: 2px;
  flex: 1;
  min-height: 1.5rem;
  background: var(--border-light);
  margin-top: 2px;
  border-radius: 1px;
}

// ── Content ────────────────────────────────────────────────────────────────
.timeline-content {
  flex: 1;
  padding-bottom: 1.5rem;
  min-width: 0;
}

.log-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.375rem;
}

.log-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.actor-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: $text-primary;
}

.resource-name {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: $text-secondary;
  font-weight: 500;
}

.action-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &.badge-create {
    background: rgba(34, 197, 94, 0.12);
    color: $status-success;
  }
  &.badge-update {
    background: rgba(59, 130, 246, 0.12);
    color: $primary-color;
  }
  &.badge-delete {
    background: rgba(239, 68, 68, 0.12);
    color: $status-danger;
  }
  &.badge-login {
    background: rgba(139, 92, 246, 0.12);
    color: $accent-color;
  }
  &.badge-logout {
    background: rgba(100, 116, 139, 0.12);
    color: $text-secondary;
  }
  &.badge-export {
    background: rgba(245, 158, 11, 0.12);
    color: $status-warning;
  }
  &.badge-import {
    background: rgba(6, 182, 212, 0.12);
    color: $secondary-color;
  }
  &.badge-approve {
    background: rgba(34, 197, 94, 0.12);
    color: $status-success;
  }
  &.badge-reject {
    background: rgba(239, 68, 68, 0.12);
    color: $status-danger;
  }
  &.badge-default {
    background: var(--surface-glass);
    color: $text-muted;
  }
}

.log-time {
  flex-shrink: 0;

  .time-relative {
    font-size: 0.75rem;
    color: $text-muted;
    cursor: default;
    white-space: nowrap;
  }
}

// ── Description ────────────────────────────────────────────────────────────
.log-description {
  font-size: 0.8125rem;
  color: $text-secondary;
  margin: 0 0 0.5rem;
  line-height: 1.5;
}

// ── Changes Diff ───────────────────────────────────────────────────────────
.log-changes {
  margin-top: 0.5rem;
}

.changes-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: $primary-color;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  .material-symbols-outlined {
    font-size: 1rem;
  }
}

.changes-table {
  margin-top: 0.5rem;
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  overflow: hidden;
  font-size: 0.75rem;

  .changes-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0;

    > span {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--border-light);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:last-child > span {
      border-bottom: none;
    }

    &.header-row > span {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: $text-muted;
      font-size: 0.625rem;
      background: var(--surface-glass);
    }
  }

  .change-field {
    color: $text-secondary;
    font-weight: 600;
  }
  .change-old {
    color: $status-danger;
    background: rgba(239, 68, 68, 0.04);
  }
  .change-new {
    color: $status-success;
    background: rgba(34, 197, 94, 0.04);
  }
}

// ── Metadata chips ─────────────────────────────────────────────────────────
.log-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.625rem;
  background: var(--surface-glass);
  border: 1px solid var(--border-glass);
  border-radius: 9999px;
  font-size: 0.6875rem;
  color: $text-muted;
  font-weight: 500;

  .material-symbols-outlined {
    font-size: 0.875rem;
  }
}

// ── Load More ──────────────────────────────────────────────────────────────
.audit-load-more {
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

// ── Compact Mode ───────────────────────────────────────────────────────────
.compact {
  .timeline-content {
    padding-bottom: 1rem;
  }

  .timeline-dot {
    width: 1.5rem;
    height: 1.5rem;

    .material-symbols-outlined {
      font-size: 0.875rem;
    }
  }

  .timeline-connector {
    width: 1.5rem;
  }

  .log-description {
    display: none;
  }

  .log-metadata {
    display: none;
  }
}
</style>
