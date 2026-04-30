<template>
  <div class="base-calendar-view">
    <!-- ── HEADER ─────────────────────────────────────────────── -->
    <div class="cal-header">
      <div class="view-switcher">
        <BaseButton
          v-for="v in VIEW_MODES"
          :key="v.key"
          :variant="currentView === v.key ? 'primary' : 'ghost'"
          :icon="v.icon"
          size="sm"
          @click="setView(v.key)"
          >{{ v.label }}</BaseButton
        >
      </div>

      <div class="nav-controls">
        <BaseButton variant="ghost" icon="chevron_left" @click="navigatePrev" />
        <span class="nav-title">{{ navTitle }}</span>
        <BaseButton
          variant="ghost"
          icon="chevron_right"
          @click="navigateNext"
        />
        <BaseButton variant="secondary" size="sm" @click="goToToday"
          >Today</BaseButton
        >
      </div>

      <div v-if="currentView !== 'yearly'" class="cal-breadcrumb">
        <BaseButton
          variant="ghost"
          size="sm"
          class="bc-btn"
          @click="setView('yearly')"
          >{{ displayYear }}</BaseButton
        >
        <span class="material-symbols-outlined bc-arrow">chevron_right</span>
        <template v-if="currentView === 'daily'">
          <BaseButton
            variant="ghost"
            size="sm"
            class="bc-btn"
            @click="setView('monthly')"
            >{{ MONTH_NAMES[displayMonth] }}</BaseButton
          >
          <span class="material-symbols-outlined bc-arrow">chevron_right</span>
          <span>{{ formatDateShort(selectedDate) }}</span>
        </template>
        <template v-else>
          <span>{{ MONTH_NAMES[displayMonth] }}</span>
        </template>
      </div>
    </div>

    <!-- ── YEARLY VIEW ────────────────────────────────────────── -->
    <div v-if="currentView === 'yearly'" class="yearly-view">
      <div
        v-for="mIdx in 12"
        :key="mIdx"
        class="mini-month"
        @click="openMonthFromYear(mIdx - 1)"
      >
        <div class="mini-month-title">{{ MONTH_NAMES[mIdx - 1] }}</div>
        <div class="mini-grid">
          <span
            v-for="d in WEEK_DAYS_SHORT"
            :key="d + mIdx"
            class="mini-wday"
            >{{ d }}</span
          >
          <span
            v-for="(day, i) in getMiniMonthDays(displayYear, mIdx - 1)"
            :key="i"
            class="mini-day"
            :class="{
              blank: !day,
              today: day && isToday(day),
              selected: day && isDateSelected(day),
              'has-schedule': day && hasDaySchedules(toIso(day)),
            }"
            >{{ day ? day.getDate() : "" }}</span
          >
        </div>
      </div>
    </div>

    <!-- ── MONTHLY VIEW ───────────────────────────────────────── -->
    <div v-else-if="currentView === 'monthly'" class="monthly-view">
      <div class="month-weekday-header">
        <div v-for="d in WEEK_DAYS_FULL" :key="d" class="wday-cell">
          {{ d }}
        </div>
      </div>
      <div class="month-grid">
        <div
          v-for="(day, idx) in monthlyCalendarDays"
          :key="idx"
          class="month-cell"
          :class="{
            'outside-month': day && !isInDisplayMonth(day),
            today: day && isToday(day),
            selected: day && isDateSelected(day),
            empty: !day,
          }"
          @click="day && openDayFromMonth(day)"
        >
          <template v-if="day">
            <span
              class="cell-num"
              :class="{ today: isToday(day), selected: isDateSelected(day) }"
              >{{ day.getDate() }}</span
            >
            <div class="cell-chips">
              <div
                v-for="s in getVisibleChips(day)"
                :key="s.id"
                class="chip"
                :class="{
                  'chip-overlap': chipHasOverlap(s, day),
                  'chip-multiday': s.startDate !== s.endDate,
                }"
                :style="{ background: s.color || scheduleColor(s.id) }"
                :title="
                  s.title +
                  (s.startDate !== s.endDate
                    ? ` (${s.startDate} – ${s.endDate})`
                    : '') +
                  (chipHasOverlap(s, day) ? ' · overlaps another event' : '')
                "
                @click.stop="openEditModal(s)"
              >
                <span class="chip-title">{{ s.title }}</span>
                <span
                  v-if="s.startDate !== s.endDate"
                  class="material-symbols-outlined chip-multiday-icon"
                  >arrow_forward</span
                >
                <span
                  class="material-symbols-outlined chip-delete"
                  @click.stop="confirmDelete(s)"
                  >close</span
                >
              </div>
              <div
                v-if="getExtraChipCount(day) > 0"
                class="chip chip-more"
                @click.stop="openDayFromMonth(day)"
              >
                +{{ getExtraChipCount(day) }} more
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- ── DAILY VIEW ─────────────────────────────────────────── -->
    <div v-else class="daily-view">
      <div class="daily-bar">
        <span
          class="daily-bar-date"
          :class="{ today: isToday(parseDate(selectedDate)) }"
        >
          {{ formatDateFull(selectedDate) }}
        </span>
        <BaseButton
          v-if="!props.readonly"
          icon="add"
          size="sm"
          @click="openAddModal(selectedDate)"
        >
          Add Schedule
        </BaseButton>
      </div>

      <div class="timeline-scroll" ref="timelineRef">
        <div class="timeline-body" :style="{ height: `${timelineHeight}px` }">
          <!-- Hour rows (background grid + labels) -->
          <div
            v-for="hour in visibleHours"
            :key="hour"
            class="hour-row"
            :style="{
              top: `${(hour - props.startHour) * props.hourHeight}px`,
              height: `${props.hourHeight}px`,
            }"
            @click="onHourClick(hour)"
          >
            <span class="hour-label">{{ formatHour(hour) }}</span>
            <div class="hour-line" />
          </div>

          <!-- Now indicator -->
          <div
            v-if="isToday(parseDate(selectedDate)) && currentTimeTop >= 0"
            class="now-line"
            :style="{ top: `${currentTimeTop}px` }"
          >
            <span class="now-dot" />
          </div>

          <!-- Events layer -->
          <div class="events-layer">
            <div
              v-for="evt in dailyLayoutSchedules"
              :key="evt.id"
              class="event-block"
              :style="{
                top: `${evt.topPercent}%`,
                height: `${Math.max(evt.heightPercent, minBlockHeightPct)}%`,
                left: `calc(${(evt.columnIndex / evt.columnCount) * 100}% + 2px)`,
                width: `calc(${(1 / evt.columnCount) * 100}% - 4px)`,
                background: evt.color || scheduleColor(evt.id),
              }"
              @click.stop="openEditModal(evt)"
            >
              <span class="evt-title">{{ evt.title }}</span>
              <span class="evt-time"
                >{{ evt.startTime }}–{{ evt.endTime }}</span
              >
              <span
                class="material-symbols-outlined evt-delete"
                @click.stop="confirmDelete(evt)"
                >close</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── DELETE CONFIRMATION MODAL ───────────────────────────── -->
    <BaseModal
      v-model:visible="deleteConfirmVisible"
      title="Delete Schedule"
      icon="delete"
      icon-color="red"
      size="sm"
    >
      <p class="delete-confirm-text">
        Delete <strong>{{ scheduleToDelete?.title }}</strong
        >? This cannot be undone.
      </p>
      <template #footer>
        <BaseButton block variant="ghost" @click="deleteConfirmVisible = false"
          >Cancel</BaseButton
        >
        <BaseButton block variant="danger" @click="executeDelete"
          >Delete</BaseButton
        >
      </template>
    </BaseModal>

    <!-- ── SCHEDULE MODAL ─────────────────────────────────────── -->
    <BaseModal
      v-model:visible="modalVisible"
      :title="editingSchedule ? 'Edit Schedule' : 'Add Schedule'"
      icon="event"
      icon-color="blue"
      size="md"
      @close="closeModal"
    >
      <div class="schedule-form">
        <BaseInput
          v-model="form.title"
          label="Title"
          placeholder="Event title"
          :error="formErrors.title"
          required
        />
        <BaseDatepicker v-model="formDateRange" label="Date" :range="true" />
        <div class="form-row">
          <BaseTimePicker v-model="form.startTime" label="Start Time" />
          <BaseTimePicker v-model="form.endTime" label="End Time" />
        </div>
        <BaseTextarea
          v-model="form.description"
          label="Description"
          placeholder="Optional notes..."
          :rows="3"
          :resize="false"
        />
        <div class="form-color-section">
          <div class="color-label-row">
            <span class="color-label-text">
              Color <span class="color-optional">(optional)</span>
            </span>
            <BaseButton
              v-if="form.color"
              variant="ghost"
              size="sm"
              @click="form.color = ''"
              >Reset to Auto</BaseButton
            >
            <BaseButton
              v-else
              variant="ghost"
              size="sm"
              icon="colorize"
              @click="form.color = PALETTE[0]!"
              >Pick Color</BaseButton
            >
          </div>
          <BaseColorPicker v-if="form.color" v-model="form.color" />
          <div v-else class="color-auto-badge">
            <div class="auto-swatches">
              <span
                v-for="c in PALETTE"
                :key="c"
                class="auto-swatch"
                :style="{ background: c }"
              />
            </div>
            <span class="auto-badge-text"
              >Random color will be auto-assigned</span
            >
          </div>
        </div>
      </div>
      <template #footer>
        <BaseButton block variant="ghost" @click="closeModal"
          >Cancel</BaseButton
        >
        <BaseButton block v-if="!props.readonly" @click="saveSchedule">
          {{ editingSchedule ? "Save Changes" : "Add Schedule" }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script lang="ts">
// Module-scope helpers — must live here so defineProps() can reference them
function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayIso(): string {
  return toIso(new Date());
}
</script>

<script setup lang="ts">
// ── Exported Types ──────────────────────────────────────────────────────────
export interface CalendarSchedule {
  id: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD (same as startDate for single-day events)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color?: string;
}

export type CalendarViewMode = "yearly" | "monthly" | "daily";

// ── Internal Types ──────────────────────────────────────────────────────────
interface ScheduleLayout extends CalendarSchedule {
  columnIndex: number;
  columnCount: number;
  topPercent: number;
  heightPercent: number;
  startMin: number;
  endMin: number;
}

interface ScheduleForm {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  color: string;
}

// ── Constants ───────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEK_DAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK_DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const VIEW_MODES: { key: CalendarViewMode; label: string; icon: string }[] = [
  { key: "yearly", label: "Year", icon: "calendar_view_month" },
  { key: "monthly", label: "Month", icon: "calendar_view_week" },
  { key: "daily", label: "Day", icon: "calendar_view_day" },
];
const PALETTE = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#f97316",
];

// ── Helpers ──────────────────────────────────────────────────────────────────
// toIso / todayIso are defined in the module <script> block above (needed by defineProps)

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 0, (m ?? 1) - 1, d ?? 1);
}

function timeToMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

function formatDateFull(iso: string): string {
  return parseDate(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(iso: string): string {
  return parseDate(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

// ── Props ───────────────────────────────────────────────────────────────────
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    schedules?: CalendarSchedule[];
    view?: CalendarViewMode;
    startHour?: number;
    endHour?: number;
    hourHeight?: number;
    readonly?: boolean;
  }>(),
  {
    modelValue: () => todayIso(),
    schedules: () => [],
    view: "monthly",
    startHour: 0,
    endHour: 24,
    hourHeight: 64,
    readonly: false,
  },
);

// ── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  "update:modelValue": [date: string];
  "update:schedules": [schedules: CalendarSchedule[]];
  "update:view": [view: CalendarViewMode];
}>();

// ── Reactive State ──────────────────────────────────────────────────────────
const _today = new Date();
const _initDate = props.modelValue ? parseDate(props.modelValue) : _today;

const currentView = ref<CalendarViewMode>(props.view);
const displayYear = ref(_initDate.getFullYear());
const displayMonth = ref(_initDate.getMonth());
const selectedDate = ref(props.modelValue || todayIso());
const modalVisible = ref(false);
const editingSchedule = ref<CalendarSchedule | null>(null);
const formErrors = ref({ title: "" });
const currentTimeTop = ref(-1);

const form = ref<ScheduleForm>({
  id: "",
  title: "",
  description: "",
  startDate: selectedDate.value,
  endDate: selectedDate.value,
  startTime: "09:00",
  endTime: "10:00",
  color: "",
});

let nowTimer: ReturnType<typeof setInterval> | null = null;

// ── Watchers ────────────────────────────────────────────────────────────────
watch(
  () => props.view,
  (v) => {
    if (v) currentView.value = v;
  },
);

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      selectedDate.value = v;
      const d = parseDate(v);
      displayYear.value = d.getFullYear();
      displayMonth.value = d.getMonth();
    }
  },
);

watch(modalVisible, (v) => {
  if (!v) {
    editingSchedule.value = null;
    formErrors.value.title = "";
  }
});

// ── Utility Functions ───────────────────────────────────────────────────────
function isToday(d: Date): boolean {
  return (
    d.getFullYear() === _today.getFullYear() &&
    d.getMonth() === _today.getMonth() &&
    d.getDate() === _today.getDate()
  );
}

function isDateSelected(d: Date): boolean {
  return toIso(d) === selectedDate.value;
}

function isInDisplayMonth(d: Date): boolean {
  return (
    d.getMonth() === displayMonth.value && d.getFullYear() === displayYear.value
  );
}

function scheduleColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length]!;
}

function isDateInRange(
  iso: string,
  startDate: string,
  endDate: string,
): boolean {
  return iso >= startDate && iso <= endDate;
}

function hasDaySchedules(iso: string): boolean {
  return props.schedules.some((s) =>
    isDateInRange(iso, s.startDate, s.endDate),
  );
}

function schedulesForDay(iso: string): CalendarSchedule[] {
  return props.schedules.filter((s) =>
    isDateInRange(iso, s.startDate, s.endDate),
  );
}

function getVisibleChips(d: Date): CalendarSchedule[] {
  return schedulesForDay(toIso(d)).slice(0, 3);
}

function getExtraChipCount(d: Date): number {
  return Math.max(0, schedulesForDay(toIso(d)).length - 3);
}

function chipHasOverlap(s: CalendarSchedule, day: Date): boolean {
  const iso = toIso(day);
  const sStart = timeToMin(s.startTime);
  const sEnd = timeToMin(s.endTime);
  return schedulesForDay(iso).some(
    (other) =>
      other.id !== s.id &&
      timeToMin(other.startTime) < sEnd &&
      timeToMin(other.endTime) > sStart,
  );
}

// ── Calendar Grid Generators ────────────────────────────────────────────────
function getMiniMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

const monthlyCalendarDays = computed((): (Date | null)[] => {
  const y = displayYear.value;
  const m = displayMonth.value;
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevMonthDays = new Date(y, m, 0).getDate();
  const cells: (Date | null)[] = [];

  // Leading days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push(new Date(y, m - 1, prevMonthDays - i));
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(y, m, d));
  }

  // Trailing days to fill 6 rows (42 cells)
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push(new Date(y, m + 1, d));
  }

  return cells;
});

// ── Daily View Computeds ─────────────────────────────────────────────────────
const visibleHours = computed((): number[] => {
  const hours: number[] = [];
  for (let h = props.startHour; h < props.endHour; h++) hours.push(h);
  return hours;
});

const timelineHeight = computed(
  () => (props.endHour - props.startHour) * props.hourHeight,
);

const minBlockHeightPct = computed(
  () => (15 / ((props.endHour - props.startHour) * 60)) * 100,
);

const dailyLayoutSchedules = computed((): ScheduleLayout[] => {
  const daySched = schedulesForDay(selectedDate.value);
  if (!daySched.length) return [];

  const totalMin = (props.endHour - props.startHour) * 60;

  // Clamp times to visible range; for multi-day events span full timeline on non-boundary days
  const items = daySched
    .map((s) => {
      const isFirstDay = s.startDate === selectedDate.value;
      const isLastDay = s.endDate === selectedDate.value;
      const rawStart = isFirstDay
        ? timeToMin(s.startTime)
        : props.startHour * 60;
      const rawEnd = isLastDay ? timeToMin(s.endTime) : props.endHour * 60;
      return {
        ...s,
        startMin: Math.max(rawStart, props.startHour * 60),
        endMin: Math.min(rawEnd, props.endHour * 60),
      };
    })
    .filter((s) => s.endMin > s.startMin)
    .sort((a, b) => a.startMin - b.startMin);

  if (!items.length) return [];

  // Greedy column packing
  const colEnds: number[] = [];
  const colAssigned = new Map<string, number>();

  for (const item of items) {
    let col = colEnds.findIndex((end) => end <= item.startMin);
    if (col === -1) {
      col = colEnds.length;
      colEnds.push(0);
    }
    colEnds[col] = item.endMin;
    colAssigned.set(item.id, col);
  }

  // Union-Find for overlap clusters
  const n = items.length;
  const parent = Array.from({ length: n }, (_, i) => i);

  function find(i: number): number {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]!]!;
      i = parent[i]!;
    }
    return i;
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = items[i]!;
      const b = items[j]!;
      if (a.endMin > b.startMin && b.endMin > a.startMin) {
        parent[find(i)] = find(j);
      }
    }
  }

  // Max column index per cluster → columnCount
  const clusterMaxCol = new Map<number, number>();
  items.forEach((item, i) => {
    const root = find(i);
    const col = colAssigned.get(item.id)!;
    clusterMaxCol.set(root, Math.max(clusterMaxCol.get(root) ?? 0, col));
  });

  return items.map((item, i) => {
    const colIdx = colAssigned.get(item.id)!;
    const colCount = (clusterMaxCol.get(find(i)) ?? 0) + 1;
    const topPct = ((item.startMin - props.startHour * 60) / totalMin) * 100;
    const heightPct = ((item.endMin - item.startMin) / totalMin) * 100;

    return {
      ...item,
      columnIndex: colIdx,
      columnCount: colCount,
      topPercent: topPct,
      heightPercent: heightPct,
    };
  });
});

// ── Nav Title ────────────────────────────────────────────────────────────────
const navTitle = computed(() => {
  if (currentView.value === "yearly") return String(displayYear.value);
  if (currentView.value === "monthly")
    return `${MONTH_NAMES[displayMonth.value]} ${displayYear.value}`;
  return formatDateFull(selectedDate.value);
});

// ── Navigation ────────────────────────────────────────────────────────────────
function setView(v: CalendarViewMode) {
  currentView.value = v;
  emit("update:view", v);
}

function changeMonth(delta: number) {
  let m = displayMonth.value + delta;
  let y = displayYear.value;
  if (m < 0) {
    m = 11;
    y--;
  } else if (m > 11) {
    m = 0;
    y++;
  }
  displayMonth.value = m;
  displayYear.value = y;
}

function setSelectedDate(iso: string) {
  selectedDate.value = iso;
  emit("update:modelValue", iso);
  const d = parseDate(iso);
  displayYear.value = d.getFullYear();
  displayMonth.value = d.getMonth();
}

function navigatePrev() {
  if (currentView.value === "yearly") {
    displayYear.value--;
  } else if (currentView.value === "monthly") {
    changeMonth(-1);
  } else {
    const d = parseDate(selectedDate.value);
    d.setDate(d.getDate() - 1);
    setSelectedDate(toIso(d));
  }
}

function navigateNext() {
  if (currentView.value === "yearly") {
    displayYear.value++;
  } else if (currentView.value === "monthly") {
    changeMonth(1);
  } else {
    const d = parseDate(selectedDate.value);
    d.setDate(d.getDate() + 1);
    setSelectedDate(toIso(d));
  }
}

function goToToday() {
  const d = new Date();
  displayYear.value = d.getFullYear();
  displayMonth.value = d.getMonth();
  setSelectedDate(toIso(d));
}

function openMonthFromYear(mIdx: number) {
  displayMonth.value = mIdx;
  setView("monthly");
}

function openDayFromMonth(d: Date) {
  setSelectedDate(toIso(d));
  setView("daily");
}

// ── Modal / CRUD ──────────────────────────────────────────────────────────────
function openAddModal(date: string, startHour = 9) {
  if (props.readonly) return;
  editingSchedule.value = null;
  const endH = Math.min(startHour + 1, props.endHour);
  form.value = {
    id: "",
    title: "",
    description: "",
    startDate: date,
    endDate: date,
    startTime: `${String(startHour).padStart(2, "0")}:00`,
    endTime: `${String(endH).padStart(2, "0")}:00`,
    color: "",
  };
  formErrors.value.title = "";
  modalVisible.value = true;
}

function openEditModal(s: CalendarSchedule) {
  editingSchedule.value = s;
  form.value = { ...s, description: s.description || "", color: s.color || "" };
  formErrors.value.title = "";
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
}

function saveSchedule() {
  if (!form.value.title.trim()) {
    formErrors.value.title = "Title is required.";
    return;
  }
  if (!form.value.endDate) form.value.endDate = form.value.startDate;
  const payload: CalendarSchedule = {
    ...form.value,
    color: form.value.color || undefined,
  };

  if (editingSchedule.value) {
    if (!payload.color) payload.color = scheduleColor(payload.id);
    emit(
      "update:schedules",
      props.schedules.map((s) => (s.id === payload.id ? payload : s)),
    );
  } else {
    const newId = crypto.randomUUID();
    const color = payload.color || scheduleColor(newId);
    emit("update:schedules", [
      ...props.schedules,
      { ...payload, id: newId, color },
    ]);
  }

  closeModal();
}

const formDateRange = computed({
  get: (): { start: string; end: string } | undefined =>
    form.value.startDate
      ? {
          start: form.value.startDate,
          end: form.value.endDate || form.value.startDate,
        }
      : undefined,
  set: (val: any) => {
    if (val && val.start) {
      form.value.startDate = val.start;
      form.value.endDate = val.end || val.start;
    } else {
      form.value.startDate = "";
      form.value.endDate = "";
    }
  },
});

const deleteConfirmVisible = ref(false);
const scheduleToDelete = ref<CalendarSchedule | null>(null);

function confirmDelete(s: CalendarSchedule) {
  scheduleToDelete.value = s;
  deleteConfirmVisible.value = true;
}

function executeDelete() {
  if (!scheduleToDelete.value) return;
  emit(
    "update:schedules",
    props.schedules.filter((s) => s.id !== scheduleToDelete.value!.id),
  );
  deleteConfirmVisible.value = false;
  scheduleToDelete.value = null;
  if (modalVisible.value) closeModal();
}

function onHourClick(hour: number) {
  if (props.readonly) return;
  openAddModal(selectedDate.value, hour);
}

// ── Now Indicator ──────────────────────────────────────────────────────────────
function updateNowLine() {
  const now = new Date();
  const totalMin = (props.endHour - props.startHour) * 60;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  if (nowMin >= props.startHour * 60 && nowMin < props.endHour * 60) {
    currentTimeTop.value =
      ((nowMin - props.startHour * 60) / totalMin) * timelineHeight.value;
  } else {
    currentTimeTop.value = -1;
  }
}

onMounted(() => {
  updateNowLine();
  nowTimer = setInterval(updateNowLine, 60_000);
});

onUnmounted(() => {
  if (nowTimer) clearInterval(nowTimer);
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/component_mixins" as *;

// ─── Root ──────────────────────────────────────────────────────
.base-calendar-view {
  display: flex;
  flex-direction: column;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-glass);
  border-radius: 2rem;
  overflow: hidden;
  min-height: 420px;
}

// ─── Header ────────────────────────────────────────────────────
.cal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-light);
  flex-wrap: wrap;
  background: var(--surface-glass);
}

.view-switcher {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--surface-glass-heavy);
  border: 1px solid var(--border-light);
  border-radius: 0.875rem;
  padding: 0.25rem;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;

  .nav-title {
    font-size: 1rem;
    font-weight: 700;
    color: $text-primary;
    min-width: 11rem;
    text-align: center;
  }
}

.cal-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  font-size: 0.8125rem;
  color: $text-muted;
  padding-top: 0.25rem;

  :deep(.bc-btn) {
    padding: 0 0.125rem;
    height: auto;
    min-height: unset;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $primary-color;
    background: none;
    border: none;
    line-height: 1.4;
    box-shadow: none;

    &:hover {
      text-decoration: underline;
      background: none;
    }
  }

  .bc-arrow {
    font-size: 0.875rem;
    color: $text-muted;
  }
}

// ─── Yearly View ───────────────────────────────────────────────
.yearly-view {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.mini-month {
  padding: 1rem;
  cursor: pointer;
  border-right: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  transition: background 0.18s;

  &:hover {
    background: color-mix(in srgb, var(--primary-color) 5%, transparent);
  }

  .mini-month-title {
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $text-secondary;
    margin-bottom: 0.5rem;
  }

  .mini-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    text-align: center;

    .mini-wday {
      font-size: 0.5625rem;
      font-weight: 700;
      color: $text-muted;
      padding-bottom: 0.25rem;
    }

    .mini-day {
      font-size: 0.5625rem;
      color: $text-secondary;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 1.125rem;
      border-radius: 50%;
      position: relative;

      &.blank {
        visibility: hidden;
      }

      &.today {
        background: $primary-color;
        color: white;
        font-weight: 700;
      }

      &.selected:not(.today) {
        outline: 2px solid $primary-color;
        color: $primary-color;
        font-weight: 700;
      }

      &.has-schedule::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: $primary-color;
      }
    }
  }
}

// ─── Monthly View ──────────────────────────────────────────────
.monthly-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.month-weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--border-light);

  .wday-cell {
    padding: 0.625rem 0.5rem;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $text-muted;
    text-align: center;
  }
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(6rem, 1fr);
  flex: 1;
  border-left: 1px solid var(--border-light);
}

.month-cell {
  border-right: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  padding: 0.375rem;
  cursor: pointer;
  overflow: hidden;
  transition: background 0.15s;
  min-height: 6rem;

  &:hover {
    background: color-mix(in srgb, var(--primary-color) 4%, transparent);
  }

  &.outside-month {
    opacity: 0.4;
  }

  &.today {
    background: color-mix(in srgb, var(--primary-color) 6%, transparent);
  }

  &.empty {
    cursor: default;
    pointer-events: none;
  }

  .cell-num {
    display: inline-flex;
    width: 1.75rem;
    height: 1.75rem;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $text-secondary;
    margin-bottom: 0.25rem;

    &.today {
      background: $primary-color;
      color: white;
    }

    &.selected:not(.today) {
      outline: 2px solid $primary-color;
      color: $primary-color;
    }
  }

  .cell-chips {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .chip {
    font-size: 0.6875rem;
    font-weight: 600;
    color: white;
    padding: 0.125rem 0.375rem;
    border-radius: 0.3125rem;
    cursor: pointer;
    transition: opacity 0.15s;
    display: flex;
    align-items: center;
    gap: 0.125rem;
    overflow: hidden;

    &:hover {
      opacity: 0.85;

      .chip-delete {
        opacity: 1;
      }
    }

    &.chip-overlap {
      opacity: 0.8;
      border-left: 3px solid var(--border-glass);
    }

    &.chip-more {
      background: var(--surface-glass);
      color: $text-secondary;
      border: 1px solid var(--border-light);
    }

    .chip-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }

    .chip-multiday-icon {
      font-size: 0.625rem;
      flex-shrink: 0;
      line-height: 1;
      opacity: 0.8;
    }

    .chip-delete {
      font-size: 0.625rem;
      opacity: 0;
      flex-shrink: 0;
      line-height: 1;
      transition: opacity 0.15s;
      border-radius: 50%;
      padding: 1px;

      &:hover {
        background: rgba(0, 0, 0, 0.25);
        opacity: 1;
      }
    }
  }
}

// ─── Daily View ────────────────────────────────────────────────
.daily-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.daily-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--border-light);

  .daily-bar-date {
    font-size: 0.9375rem;
    font-weight: 700;
    color: $text-primary;

    &.today {
      color: $primary-color;
    }
  }
}

.timeline-scroll {
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: var(--border-light) transparent;
}

.timeline-body {
  position: relative;
  padding-left: 4.5rem;
  padding-right: 0.5rem;
}

.hour-row {
  position: absolute;
  left: 0;
  right: 0;
  cursor: pointer;
  display: flex;
  align-items: flex-start;

  &:hover .hour-line {
    border-color: color-mix(in srgb, var(--primary-color) 35%, transparent);
  }

  .hour-label {
    position: absolute;
    left: 0;
    width: 4rem;
    text-align: right;
    padding-right: 0.625rem;
    font-size: 0.6875rem;
    font-weight: 600;
    color: $text-muted;
    transform: translateY(-0.55em);
    user-select: none;
    pointer-events: none;
  }

  .hour-line {
    position: absolute;
    left: 4.5rem;
    right: 0;
    top: 0;
    border-top: 1px solid var(--border-light);
    pointer-events: none;
    transition: border-color 0.15s;
  }
}

.now-line {
  position: absolute;
  left: 4.5rem;
  right: 0;
  height: 2px;
  background: $status-danger;
  z-index: 10;
  pointer-events: none;

  .now-dot {
    position: absolute;
    left: -5px;
    top: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: $status-danger;
  }
}

.events-layer {
  position: absolute;
  left: 4.5rem;
  right: 0.5rem;
  top: 0;
  bottom: 0;
  pointer-events: none;
}

.event-block {
  position: absolute;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  overflow: hidden;
  cursor: pointer;
  pointer-events: all;
  transition:
    opacity 0.15s,
    filter 0.15s;
  min-height: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);

  &:hover {
    opacity: 0.88;
    filter: brightness(1.05);
    z-index: 5;
  }

  .evt-title {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .evt-time {
    display: block;
    font-size: 0.6875rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .evt-delete {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    font-size: 0.875rem;
    opacity: 0;
    transition: opacity 0.15s;
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;
    border-radius: 50%;
    padding: 1px;
    line-height: 1;

    &:hover {
      background: rgba(0, 0, 0, 0.25);
    }
  }

  &:hover .evt-delete {
    opacity: 1;
  }
}

// ─── Schedule Form ─────────────────────────────────────────────
.schedule-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
  padding: 0.25rem 0;

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
}

.form-color-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.color-label-text {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $text-secondary;
  margin-left: 0.25rem;

  .color-optional {
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    color: $text-muted;
    font-size: 0.6875rem;
  }
}

.color-auto-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border: 1px dashed var(--border-light);
  border-radius: 0.875rem;
  background: color-mix(in srgb, var(--surface-glass) 50%, transparent);
  cursor: default;
}

.auto-swatches {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.auto-swatch {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.auto-badge-text {
  font-size: 0.75rem;
  color: $text-muted;
  font-style: italic;
}

.delete-confirm-text {
  font-size: 0.9375rem;
  color: $text-secondary;
  padding: 0.5rem 0;
  text-align: center;
  line-height: 1.6;

  strong {
    color: $text-primary;
  }
}
</style>
