<template>
  <div class="base-color-picker" :class="{ 'picker-disabled': disabled }">
    <label v-if="label" class="picker-label">{{ label }}</label>

    <!-- Preview + Hex Input Row -->
    <div class="picker-row">
      <button
        class="color-swatch-trigger"
        :style="{ background: modelValue || '#6366f1' }"
        :disabled="disabled"
        @click="panelOpen = !panelOpen"
        aria-label="Open color picker"
      />
      <input
        class="hex-input"
        type="text"
        :value="modelValue"
        :disabled="disabled"
        placeholder="#000000"
        maxlength="7"
        @input="onHexInput"
      />
    </div>

    <!-- Panel -->
    <Transition name="color-panel">
      <div v-if="panelOpen && !disabled" class="picker-panel">
        <!-- Presets grid -->
        <div class="presets-grid">
          <button
            v-for="color in allPresets"
            :key="color"
            class="preset-swatch"
            :class="{ selected: modelValue === color }"
            :style="{ background: color }"
            :title="color"
            @click="selectColor(color)"
          />
        </div>

        <!-- Native color input -->
        <div class="picker-native-row">
          <label class="native-label">Custom</label>
          <input
            class="native-input"
            type="color"
            :value="modelValue || '#6366f1'"
            @input="onNativeInput"
          />
        </div>
      </div>
    </Transition>

    <p v-if="hint" class="picker-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const DEFAULT_PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#64748b",
  "#0f172a",
  "#ffffff",
  "#fafafa",
  "#e2e8f0",
];

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    presets?: string[];
    disabled?: boolean;
    label?: string;
    hint?: string;
  }>(),
  {
    modelValue: "#6366f1",
    disabled: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const panelOpen = ref(false);
const allPresets = props.presets?.length ? props.presets : DEFAULT_PRESETS;

function selectColor(color: string) {
  emit("update:modelValue", color);
  panelOpen.value = false;
}

function onHexInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    emit("update:modelValue", val);
  }
}

function onNativeInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  emit("update:modelValue", val);
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-color-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: fit-content;
  position: relative;
}

.picker-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: $text-secondary;
}

.picker-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-swatch-trigger {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  border: 2px solid var(--border-light);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    border-color 0.2s,
    transform 0.15s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

  &:hover {
    border-color: $primary-color;
    transform: scale(1.08);
  }
}

.hex-input {
  width: 8rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  border-radius: 0.625rem;
  border: 1.5px solid var(--border-light);
  background: var(--surface-glass);
  color: $text-primary;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "JetBrains Mono", "Cascadia Code", monospace;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba($primary-rgb, 0.12);
  }
}

.picker-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 200;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-glass);
  border-radius: 1.25rem;
  padding: 1rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  width: 16rem;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.preset-swatch {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition:
    transform 0.15s,
    border-color 0.15s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: scale(1.15);
  }

  &.selected {
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-rgb, 0.3);
  }
}

.picker-native-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-light);
}

.native-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: $text-muted;
}

.native-input {
  width: 2.5rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-light);
  cursor: pointer;
  background: none;
  padding: 0.125rem;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 0.375rem;
  }
  &::-webkit-color-swatch {
    border: none;
    border-radius: 0.375rem;
  }
}

.picker-hint {
  font-size: 0.75rem;
  color: $text-muted;
  margin: 0;
}

.picker-disabled {
  opacity: 0.45;
  pointer-events: none;
}

// Panel transition
.color-panel-enter-active,
.color-panel-leave-active {
  transition:
    opacity 0.18s,
    transform 0.18s;
}
.color-panel-enter-from,
.color-panel-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}
</style>
