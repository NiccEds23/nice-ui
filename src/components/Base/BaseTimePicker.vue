<template>
  <div class="base-timepicker-wrapper" :class="{ disabled }" ref="containerRef">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <div class="input-display-wrapper" @click="toggleDropdown">
      <div class="input-content" :class="{ placeholder: !modelValue }">
        <span class="material-symbols-outlined time-icon">schedule</span>
        {{ modelValue || placeholder || 'Select time' }}
      </div>
      <span
        v-if="modelValue"
        class="material-symbols-outlined clear-icon"
        @click.stop="clearValue"
      >close</span>
    </div>

    <Transition name="dropdown">
      <div v-if="isOpen" class="timepicker-dropdown">
        <div class="time-columns">
          <div class="time-col" ref="hourColRef">
            <div
              v-for="h in 24"
              :key="h"
              class="time-item"
              :class="{ selected: selectedHour === h - 1 }"
              @click.stop="selectHour(h - 1)"
            >{{ String(h - 1).padStart(2, '0') }}</div>
          </div>
          <div class="time-sep">:</div>
          <div class="time-col" ref="minColRef">
            <div
              v-for="m in minuteOptions"
              :key="m"
              class="time-item"
              :class="{ selected: selectedMinute === m }"
              @click.stop="selectMinute(m)"
            >{{ String(m).padStart(2, '0') }}</div>
          </div>
        </div>
      </div>
    </Transition>

    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  step: { type: Number, default: 5 },
});

const emit = defineEmits(['update:modelValue']);

const containerRef = ref<HTMLElement | null>(null);
const hourColRef = ref<HTMLElement | null>(null);
const minColRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const selectedHour = ref(9);
const selectedMinute = ref(0);

const minuteOptions = computed(() => {
  const opts: number[] = [];
  for (let m = 0; m < 60; m += props.step) opts.push(m);
  return opts;
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const parts = val.split(':').map(Number);
      selectedHour.value = parts[0] ?? 9;
      const rawMin = parts[1] ?? 0;
      const snapped = Math.round(rawMin / props.step) * props.step;
      selectedMinute.value = snapped >= 60 ? 60 - props.step : snapped;
    }
  },
  { immediate: true },
);

function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) nextTick(scrollToSelected);
}

function scrollToSelected() {
  scrollColTo(hourColRef.value, selectedHour.value);
  scrollColTo(minColRef.value, minuteOptions.value.indexOf(selectedMinute.value));
}

function scrollColTo(el: HTMLElement | null, idx: number) {
  if (!el || idx < 0) return;
  const item = el.children[idx] as HTMLElement | undefined;
  if (item) el.scrollTop = item.offsetTop - el.clientHeight / 2 + item.clientHeight / 2;
}

function selectHour(h: number) {
  selectedHour.value = h;
  emitValue();
  nextTick(() => scrollColTo(hourColRef.value, h));
}

function selectMinute(m: number) {
  selectedMinute.value = m;
  emitValue();
  nextTick(() => scrollColTo(minColRef.value, minuteOptions.value.indexOf(m)));
  setTimeout(() => { isOpen.value = false; }, 120);
}

function emitValue() {
  emit(
    'update:modelValue',
    `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`,
  );
}

function clearValue() {
  emit('update:modelValue', '');
}

function handleClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/component_mixins' as *;

.base-timepicker-wrapper {
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
  color: $text-secondary;
  margin-left: 0.25rem;

  .required-mark {
    color: $status-danger;
  }
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
}

.input-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: $text-primary;

  &.placeholder {
    color: $text-muted;
  }

  .time-icon {
    font-size: 1.25rem;
    color: $text-secondary;
  }
}

.clear-icon {
  font-size: 1.25rem;
  color: $text-muted;
  cursor: pointer;

  &:hover {
    color: $status-danger;
  }
}

.timepicker-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-glass);
  border-radius: 1.25rem;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.18);
  z-index: 100;
  overflow: hidden;
  width: 160px;
}

.time-columns {
  display: flex;
  align-items: stretch;
  height: 200px;
}

.time-col {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.time-sep {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: $text-muted;
  padding: 0 0.125rem;
  flex-shrink: 0;
  pointer-events: none;
}

.time-item {
  padding: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: $text-primary;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 0.5rem;
  margin: 1px 4px;
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

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.error-text {
  font-size: 0.75rem;
  color: $status-danger;
  margin-left: 0.25rem;
}
</style>
