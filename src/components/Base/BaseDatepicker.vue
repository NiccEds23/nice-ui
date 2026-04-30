<template>
  <div
    class="base-datepicker-wrapper"
    :class="{ disabled: disabled }"
    ref="containerRef"
  >
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <div class="input-display-wrapper" @click="toggleDropdown">
      <div class="input-content" :class="{ placeholder: !displayValue }">
        <span class="material-symbols-outlined calendar-icon"
          >calendar_today</span
        >
        {{ displayValue || placeholder || "Select date" }}
      </div>
      <span
        v-if="displayValue"
        class="material-symbols-outlined clear-icon"
        @click.stop="clearValue"
        >close</span
      >
    </div>

    <!-- Calendar Dropdown -->
    <Transition name="dropdown">
      <div v-if="isOpen" class="calendar-dropdown glass-panel">
        <!-- Header -->
        <div class="calendar-header">
          <button class="nav-btn" @click.stop="changeMonth(-1)">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>

          <div class="current-month">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </div>

          <button class="nav-btn" @click.stop="changeMonth(1)">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <!-- Weekdays -->
        <div class="calendar-grid weekdays">
          <div v-for="day in weekDays" :key="day" class="weekday">
            {{ day }}
          </div>
        </div>

        <!-- Days -->
        <div class="calendar-grid days" @mouseleave="hoveredDate = null">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="day-cell-wrapper"
            :class="{
              empty: !day,
              'in-range': day && (isInRange(day) || isInPreviewRange(day)),
              'range-start': day && isRangeStart(day),
              'range-end': day && (isRangeEnd(day) || isHoverEnd(day)),
            }"
            @mouseenter="day && setHoverDate(day)"
            @click.stop="day && selectDate(day)"
          >
            <span
              v-if="day"
              class="day-content"
              :class="{
                today: isToday(day),
                selected: isSelected(day),
              }"
            >
              {{ day.getDate() }}
            </span>
          </div>
        </div>

        <!-- DateTime time section -->
        <template v-if="mode === 'datetime'">
          <div class="time-section-divider">
            <span class="material-symbols-outlined">schedule</span>
            <span class="time-section-title">Select Time</span>
          </div>
          <div class="dt-time-columns">
            <div class="dt-time-col" ref="hourColRef">
              <div
                v-for="h in 24"
                :key="h"
                class="dt-time-item"
                :class="{ selected: selectedHour === h - 1 }"
                @click.stop="selectHour(h - 1)"
              >{{ String(h - 1).padStart(2, '0') }}</div>
            </div>
            <div class="dt-sep">:</div>
            <div class="dt-time-col" ref="minColRef">
              <div
                v-for="m in minuteOptions"
                :key="m"
                class="dt-time-item"
                :class="{ selected: selectedMinute === m }"
                @click.stop="selectMinute(m)"
              >{{ String(m).padStart(2, '0') }}</div>
            </div>
          </div>
          <div class="dt-confirm-row">
            <span class="dt-preview">
              {{ selectedStart ? formatDate(selectedStart) : 'Select a date' }}
              &middot; {{ String(selectedHour).padStart(2, '0') }}:{{ String(selectedMinute).padStart(2, '0') }}
            </span>
            <BaseButton
              size="sm"
              :disabled="!selectedStart"
              @click.stop="confirmDatetime"
            >Confirm</BaseButton>
          </div>
        </template>
      </div>
    </Transition>

    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  modelValue: { type: [String, Object, Array], default: null }, // String (ISO) or { start, end }
  range: { type: Boolean, default: false },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  error: { type: String, default: "" },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  mode: { type: String, default: "date" }, // 'date' | 'datetime'
});

const emit = defineEmits(["update:modelValue"]);

const containerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const hoveredDate = ref<Date | null>(null);

// Time state (used in datetime mode)
const selectedHour = ref(9);
const selectedMinute = ref(0);
const hourColRef = ref<HTMLElement | null>(null);
const minColRef = ref<HTMLElement | null>(null);
const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthNames = [
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

// Internal selection state
const selectedStart = ref<Date | null>(null);
const selectedEnd = ref<Date | null>(null);

// Helper to parse YYYY-MM-DD to Local Midnight
const parseLocalDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Initialize from props
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      selectedStart.value = null;
      selectedEnd.value = null;
      return;
    }

    if (props.range) {
      if (typeof val === "object" && val !== null && !Array.isArray(val)) {
        // @ts-ignore
        selectedStart.value = parseLocalDate(val.start);
        // @ts-ignore
        selectedEnd.value = parseLocalDate(val.end);
      }
    } else {
      // Single mode
      if (typeof val === "string") {
        if (props.mode === "datetime" && val.includes(" ")) {
          const [datePart, timePart] = val.split(" ");
          selectedStart.value = parseLocalDate(datePart ?? "");
          if (timePart) {
            const parts = timePart.split(":").map(Number);
            selectedHour.value = parts[0] ?? 9;
            selectedMinute.value = parts[1] ?? 0;
          }
        } else {
          selectedStart.value = parseLocalDate(val);
        }
      }
    }
  },
  { immediate: true },
);

const displayValue = computed(() => {
  if (props.range) {
    if (selectedStart.value && selectedEnd.value) {
      return `${formatDate(selectedStart.value)} - ${formatDate(selectedEnd.value)}`;
    } else if (selectedStart.value) {
      return `${formatDate(selectedStart.value)} - Select end date`;
    }
  } else {
    if (selectedStart.value) {
      if (props.mode === "datetime") {
        return `${formatDate(selectedStart.value)} · ${String(selectedHour.value).padStart(2, "0")}:${String(selectedMinute.value).padStart(2, "0")}`;
      }
      return formatDate(selectedStart.value);
    }
  }
  return "";
});

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Calendar Generation Logic
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (Date | null)[] = [];

  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  return days;
});

// Logic
const toggleDropdown = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value && props.mode === "datetime") {
    nextTick(() => {
      scrollColTo(hourColRef.value, selectedHour.value);
      scrollColTo(minColRef.value, minuteOptions.indexOf(selectedMinute.value));
    });
  }
};

const closeDropdown = () => {
  isOpen.value = false;
  hoveredDate.value = null;
};

const changeMonth = (delta: number) => {
  let newMonth = currentMonth.value + delta;
  let newYear = currentYear.value;

  if (newMonth > 11) {
    newMonth = 0;
    newYear++;
  } else if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  }

  currentMonth.value = newMonth;
  currentYear.value = newYear;
};

const setHoverDate = (date: Date) => {
  if (props.range && selectedStart.value && !selectedEnd.value) {
    hoveredDate.value = date;
  }
};

const selectDate = (date: Date) => {
  if (props.range) {
    if (!selectedStart.value || (selectedStart.value && selectedEnd.value)) {
      // Start new selection
      selectedStart.value = date;
      selectedEnd.value = null;
      hoveredDate.value = null;
    } else {
      // Complete selection
      if (date < selectedStart.value) {
        selectedEnd.value = selectedStart.value;
        selectedStart.value = date;
      } else {
        selectedEnd.value = date;
      }
      emitUpdate();
      closeDropdown();
    }
  } else {
    // Single mode
    selectedStart.value = date;
    if (props.mode !== "datetime") {
      emitUpdate();
      closeDropdown();
    }
  }
};

// Helper to format Date to YYYY-MM-DD Local
const formatToIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const emitUpdate = () => {
  if (props.range) {
    emit("update:modelValue", {
      start: selectedStart.value ? formatToIsoDate(selectedStart.value) : "",
      end: selectedEnd.value ? formatToIsoDate(selectedEnd.value) : "",
    });
  } else if (props.mode === "datetime") {
    if (selectedStart.value) {
      const timeStr = `${String(selectedHour.value).padStart(2, "0")}:${String(selectedMinute.value).padStart(2, "0")}`;
      emit("update:modelValue", `${formatToIsoDate(selectedStart.value)} ${timeStr}`);
    } else {
      emit("update:modelValue", "");
    }
  } else {
    emit(
      "update:modelValue",
      selectedStart.value ? formatToIsoDate(selectedStart.value) : "",
    );
  }
};

const clearValue = () => {
  selectedStart.value = null;
  selectedEnd.value = null;
  selectedHour.value = 9;
  selectedMinute.value = 0;
  emit("update:modelValue", null);
};

// Helpers for Classes
const isToday = (date: Date) => date.toDateString() === today.toDateString();

const isSelected = (date: Date) => {
  if (props.range) {
    return (
      (selectedStart.value &&
        date.toDateString() === selectedStart.value.toDateString()) ||
      (selectedEnd.value &&
        date.toDateString() === selectedEnd.value.toDateString())
    );
  }
  return (
    selectedStart.value &&
    date.toDateString() === selectedStart.value.toDateString()
  );
};

const isSameDay = (d1: Date, d2: Date) =>
  d1.toDateString() === d2.toDateString();

const isInRange = (date: Date) => {
  if (props.range && selectedStart.value && selectedEnd.value) {
    return date > selectedStart.value && date < selectedEnd.value;
  }
  return false;
};

const isInPreviewRange = (date: Date) => {
  // Show preview if we have start but no end, and hovering
  if (
    props.range &&
    selectedStart.value &&
    !selectedEnd.value &&
    hoveredDate.value
  ) {
    const start = selectedStart.value;
    const end = hoveredDate.value;

    // Handle reverse selection preview (hovering before start)
    if (end < start) {
      return date > end && date < start;
    }
    return date > start && date < end;
  }
  return false;
};

const isRangeStart = (date: Date) => {
  if (!props.range || !selectedStart.value) return false;

  // If previewing reverse range (hover < start)
  if (
    !selectedEnd.value &&
    hoveredDate.value &&
    hoveredDate.value < selectedStart.value
  ) {
    return isSameDay(date, hoveredDate.value);
  }

  // Normal start
  return isSameDay(date, selectedStart.value);
};

const isRangeEnd = (date: Date) => {
  return props.range && selectedEnd.value && isSameDay(date, selectedEnd.value);
};

const isHoverEnd = (date: Date) => {
  // If selecting range, hovering ahead of start
  return (
    props.range &&
    selectedStart.value &&
    !selectedEnd.value &&
    hoveredDate.value &&
    isSameDay(date, hoveredDate.value) &&
    hoveredDate.value > selectedStart.value
  );
};

// DateTime helpers
function scrollColTo(el: HTMLElement | null, idx: number) {
  if (!el || idx < 0) return;
  const item = el.children[idx] as HTMLElement | undefined;
  if (item) el.scrollTop = item.offsetTop - el.clientHeight / 2 + item.clientHeight / 2;
}

function selectHour(h: number) {
  selectedHour.value = h;
  nextTick(() => scrollColTo(hourColRef.value, h));
}

function selectMinute(m: number) {
  selectedMinute.value = m;
  nextTick(() => scrollColTo(minColRef.value, minuteOptions.indexOf(m)));
}

function confirmDatetime() {
  emitUpdate();
  closeDropdown();
}

// Outside Click
const handleClickOutside = (event: MouseEvent) => {
  if (
    containerRef.value &&
    !containerRef.value.contains(event.target as Node)
  ) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/component_mixins" as *;

.base-datepicker-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  position: relative;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.input-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $text-secondary; // #64748b
  margin-left: 0.25rem;

  .required-mark {
    color: $status-danger;
  } // #ef4444
}

.input-display-wrapper {
  @include input-base;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  height: 2.75rem;
  transition: all 0.2s;

  &:hover {
    // background: rgba(255, 255, 255, 0.9);
  }
}

.input-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: $text-primary; // #1e293b

  &.placeholder {
    color: $text-muted;
  } // #94a3b8

  .calendar-icon {
    font-size: 1.25rem;
    color: $text-secondary; // #64748b
  }
}

.clear-icon {
  font-size: 1.25rem;
  color: $text-muted; // #94a3b8
  cursor: pointer;
  &:hover {
    color: $status-danger;
  } // #ef4444
}

// Calendar Dropdown
.calendar-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 320px;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-glass);
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  z-index: 50;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  .current-month {
    font-weight: 700;
    color: $text-primary; // #1e293b
    font-size: 1rem;
  }

  .nav-btn {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: $text-secondary; // #64748b
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: color-mix(in srgb, #{$primary-color}, transparent 90%);
      color: $primary-hover;
    }
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px; // Small gap, grid cells cover the rest
  text-align: center;

  &.weekdays {
    margin-bottom: 0.5rem;
    .weekday {
      font-size: 0.75rem;
      font-weight: 700;
      color: $text-muted; // #94a3b8
      text-transform: uppercase;
    }
  }

  &.days {
    .day-cell-wrapper {
      position: relative;
      height: 2.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.1s ease; // Smooth range addition

      &.empty {
        cursor: default;
        pointer-events: none;
      }

      // Range Background Strip Logic
      &.in-range {
        background: color-mix(in srgb, #{$primary-color}, transparent 90%);
        // No border radius for middle items
      }

      &.range-start {
        background: linear-gradient(
          90deg,
          transparent 50%,
          color-mix(in srgb, #{$primary-color}, transparent 90%) 50%
        );
      }

      &.range-end {
        background: linear-gradient(
          90deg,
          color-mix(in srgb, #{$primary-color}, transparent 90%) 50%,
          transparent 50%
        );
      }

      // Handle Start AND End same day (single selection in range mode)
      &.range-start.range-end {
        background: transparent;
      }

      .day-content {
        position: relative;
        z-index: 2;
        width: 2.25rem;
        height: 2.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 0.875rem;
        color: $neutral-700; // #334155
        transition: all 0.2s;

        &:hover {
          background: color-mix(in srgb, #{$primary-color}, transparent 90%);
          color: $primary-hover;
        }

        &.selected {
          background: $primary-hover;
          color: white;
          font-weight: 700;
          box-shadow: 0 4px 10px 0
            color-mix(in srgb, #{$primary-color}, transparent 70%);
        }

        &.today {
          font-weight: 700;
          color: $primary-hover;

          &.selected {
            color: white;
          }
        }
      }
    }
  }
}

// Transitions
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.error-text {
  font-size: 0.75rem;
  color: $status-danger;
  margin-left: 0.25rem;
}

// ── DateTime extras ──────────────────────────────────────────────
.time-section-divider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0 0.5rem;
  border-top: 1px solid var(--border-light);
  margin-top: 0.75rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: $text-muted;

  .material-symbols-outlined {
    font-size: 0.875rem;
  }

  .time-section-title {
    flex: 1;
  }
}

.dt-time-columns {
  display: flex;
  align-items: stretch;
  height: 148px;
  border: 1px solid var(--border-light);
  border-radius: 0.875rem;
  overflow: hidden;
  background: color-mix(in srgb, var(--surface-glass) 40%, transparent);
}

.dt-time-col {
  flex: 1;
  overflow-y: auto;
  padding: 0.25rem 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.dt-sep {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;
  color: $text-muted;
  padding: 0 0.25rem;
  flex-shrink: 0;
  pointer-events: none;
}

.dt-time-item {
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: $text-primary;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 0.375rem;
  margin: 1px 3px;
  line-height: 1;

  &:hover {
    background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    color: $primary-color;
  }

  &.selected {
    background: $primary-color;
    color: white;
    font-weight: 700;
  }
}

.dt-confirm-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.75rem;
}

.dt-preview {
  font-size: 0.75rem;
  color: $text-secondary;
  font-weight: 600;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
