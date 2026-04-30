<template>
  <div class="calendar-page">
    <!-- ── Page Header ──────────────────────────────────────────── -->
    <div class="page-header">
      <div class="page-header-text">
        <h1 class="page-title">Calendar</h1>
        <p class="page-subtitle">Manage your schedule and upcoming events</p>
      </div>
      <div class="page-header-actions">
        <BaseButton variant="secondary" icon="today" @click="goToToday"
          >Today</BaseButton
        >
        <BaseButton icon="add" @click="goToTodayDaily">New Event</BaseButton>
      </div>
    </div>

    <!-- ── Summary Strip ────────────────────────────────────────── -->
    <div class="summary-strip">
      <BaseStatCard
        :value="todayEventsCount"
        label="Today's Events"
        icon="today"
        variant="primary"
        :format-value="false"
      />
      <BaseStatCard
        :value="weekEventsCount"
        label="This Week"
        icon="date_range"
        variant="success"
        :format-value="false"
      />
      <BaseStatCard
        :value="nextEvent ? nextEvent.title : '—'"
        label="Next Event"
        icon="event_upcoming"
        variant="warning"
        :description="nextEvent ? nextEvent.startTime + ' · ' + nextEvent.startDate : 'No upcoming events'"
      />
      <BaseStatCard
        :value="schedules.length"
        label="Total Events"
        icon="event_note"
        variant="secondary"
        :format-value="false"
      />
    </div>

    <!-- ── Calendar View ────────────────────────────────────────── -->
    <BaseCalendarView
      v-model="selectedDate"
      v-model:schedules="schedules"
      v-model:view="calendarView"
      :start-hour="7"
      :end-hour="22"
      :hour-height="68"
    />
  </div>
</template>

<script setup lang="ts">
import type { CalendarSchedule, CalendarViewMode } from "@/components/Base/BaseCalendarView.vue";

// ── Date helpers ─────────────────────────────────────────────────────────────
const _now = new Date();

function _iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function _offset(days: number): string {
  const d = new Date(_now);
  d.setDate(d.getDate() + days);
  return _iso(d);
}

// ── Page State ───────────────────────────────────────────────────────────────
const calendarView = ref<CalendarViewMode>("monthly");
const selectedDate = ref(_iso(_now));

// ── Sample Schedules (dates relative to today) ───────────────────────────────
const schedules = ref<CalendarSchedule[]>([
  // Today — morning block (overlapping pair to demo the feature)
  {
    id: "ev-1",
    title: "Morning Standup",
    startDate: _offset(0),
    endDate: _offset(0),
    startTime: "08:00",
    endTime: "08:30",
    color: "#3b82f6",
    description: "Daily sync with the engineering team.",
  },
  {
    id: "ev-2",
    title: "Design Handoff",
    startDate: _offset(0),
    endDate: _offset(0),
    startTime: "08:15",
    endTime: "09:15",
    color: "#8b5cf6",
    description: "Review new component specs from design team.",
  },
  // Today — afternoon
  {
    id: "ev-3",
    title: "Sprint Review",
    startDate: _offset(0),
    endDate: _offset(0),
    startTime: "14:00",
    endTime: "15:30",
    color: "#22c55e",
    description: "End-of-sprint demo and retrospective.",
  },
  // Tomorrow
  {
    id: "ev-4",
    title: "Client Presentation",
    startDate: _offset(1),
    endDate: _offset(1),
    startTime: "10:00",
    endTime: "11:00",
    color: "#f59e0b",
    description: "Q2 roadmap presentation to stakeholders.",
  },
  {
    id: "ev-5",
    title: "Lunch with Team",
    startDate: _offset(1),
    endDate: _offset(1),
    startTime: "12:30",
    endTime: "13:30",
    color: "#ec4899",
  },
  // Day +2
  {
    id: "ev-6",
    title: "Architecture Review",
    startDate: _offset(2),
    endDate: _offset(2),
    startTime: "09:00",
    endTime: "10:30",
    color: "#06b6d4",
    description: "Discuss database schema changes and API versioning.",
  },
  {
    id: "ev-7",
    title: "1:1 with Manager",
    startDate: _offset(2),
    endDate: _offset(2),
    startTime: "15:00",
    endTime: "15:30",
    color: "#f97316",
  },
  // Day +3
  {
    id: "ev-8",
    title: "Sprint Planning",
    startDate: _offset(3),
    endDate: _offset(3),
    startTime: "10:00",
    endTime: "12:00",
    color: "#22c55e",
    description: "Plan stories and tasks for next sprint.",
  },
  // Day +4 to +6 — multi-day event demo
  {
    id: "ev-9",
    title: "Tech Conference",
    startDate: _offset(4),
    endDate: _offset(6),
    startTime: "09:00",
    endTime: "18:00",
    color: "#06b6d4",
    description: "Annual tech conference — all three days.",
  },
  // Day +7
  {
    id: "ev-10",
    title: "Weekly All-Hands",
    startDate: _offset(7),
    endDate: _offset(7),
    startTime: "09:00",
    endTime: "10:00",
    color: "#3b82f6",
    description: "Company-wide weekly sync.",
  },
  {
    id: "ev-11",
    title: "Performance Reviews",
    startDate: _offset(7),
    endDate: _offset(9),
    startTime: "13:00",
    endTime: "17:00",
    color: "#8b5cf6",
    description: "Mid-year performance review sessions — three-day cycle.",
  },
  // Day +10
  {
    id: "ev-12",
    title: "Security Audit",
    startDate: _offset(10),
    endDate: _offset(10),
    startTime: "09:30",
    endTime: "11:30",
    color: "#ef4444",
    description: "Quarterly security and compliance review.",
  },
  // Day +14
  {
    id: "ev-13",
    title: "Board Meeting",
    startDate: _offset(14),
    endDate: _offset(14),
    startTime: "14:00",
    endTime: "16:00",
    color: "#6366f1",
    description: "Quarterly board of directors meeting.",
  },
]);

// ── Computed Stats ───────────────────────────────────────────────────────────
const todayIsoStr = _iso(_now);

const todayEventsCount = computed(
  () => schedules.value.filter((s) => s.startDate <= todayIsoStr && s.endDate >= todayIsoStr).length,
);

const weekEventsCount = computed(() => {
  const weekEnd = new Date(_now);
  weekEnd.setDate(_now.getDate() + 6);
  const weekEndStr = _iso(weekEnd);
  return schedules.value.filter((s) => s.startDate <= weekEndStr && s.endDate >= todayIsoStr).length;
});

const nextEvent = computed((): CalendarSchedule | null => {
  const nowTime = `${String(_now.getHours()).padStart(2, "0")}:${String(_now.getMinutes()).padStart(2, "0")}`;
  const upcoming = schedules.value
    .filter(
      (s) =>
        s.startDate > todayIsoStr ||
        (s.startDate === todayIsoStr && s.startTime > nowTime),
    )
    .sort((a, b) => {
      if (a.startDate !== b.startDate) return a.startDate.localeCompare(b.startDate);
      return a.startTime.localeCompare(b.startTime);
    });
  return upcoming[0] ?? null;
});

// ── Actions ──────────────────────────────────────────────────────────────────
function goToToday() {
  selectedDate.value = todayIsoStr;
  calendarView.value = "monthly";
}

function goToTodayDaily() {
  selectedDate.value = todayIsoStr;
  calendarView.value = "daily";
}
</script>

<route lang="yaml">
meta:
  layout: dashboard
  breadcrumb:
    - name: Home
      route: /
    - name: Calendar
      route: null
</route>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.calendar-page {
  // padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 100vh;
  // background: var(--bg-gradient);
}

// ─── Header ────────────────────────────────────────────────────
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

// ─── Summary Strip ─────────────────────────────────────────────
.summary-strip {
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
</style>
