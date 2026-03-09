<template>
  <div
    class="base-otp"
    :class="[`otp-${size}`, { 'otp-error': error, 'otp-disabled': disabled }]"
  >
    <label v-if="label" class="otp-label">{{ label }}</label>
    <div class="otp-fields" :style="{ gap: gapSize }">
      <input
        v-for="(_, idx) in length"
        :key="idx"
        :ref="
          (el) => {
            if (el) inputs[idx] = el as HTMLInputElement;
          }
        "
        class="otp-cell"
        :type="masked ? 'password' : inputType === 'number' ? 'tel' : 'text'"
        inputmode="numeric"
        maxlength="1"
        :value="digits[idx]"
        :disabled="disabled"
        :aria-label="`OTP digit ${idx + 1}`"
        autocomplete="one-time-code"
        @input="onInput(idx, $event)"
        @keydown="onKeydown(idx, $event)"
        @paste="onPaste($event)"
        @focus="(e) => (e.target as HTMLInputElement).select()"
      />
    </div>
    <p v-if="error" class="otp-error-msg">{{ error }}</p>
    <p v-else-if="hint" class="otp-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    length?: number;
    inputType?: "text" | "number";
    size?: "sm" | "md" | "lg";
    masked?: boolean;
    disabled?: boolean;
    label?: string;
    hint?: string;
    error?: string;
  }>(),
  {
    modelValue: "",
    length: 6,
    inputType: "number",
    size: "md",
    masked: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  complete: [value: string];
}>();

const inputs = ref<HTMLInputElement[]>([]);
const digits = ref<string[]>(Array(props.length).fill(""));

// Sync from v-model
watch(
  () => props.modelValue,
  (val) => {
    const chars = (val ?? "").split("");
    digits.value = Array(props.length)
      .fill("")
      .map((_, i) => chars[i] ?? "");
  },
  { immediate: true },
);

const gapSize = computed(() => {
  const map: Record<string, string> = {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
  };
  return map[props.size] ?? "0.5rem";
});

function emit_value() {
  const val = digits.value.join("");
  emit("update:modelValue", val);
  if (val.length === props.length && !val.includes("")) {
    emit("complete", val);
  }
}

function onInput(idx: number, e: Event) {
  const input = e.target as HTMLInputElement;
  const char = input.value.replace(/[^0-9]/g, "").slice(-1);
  digits.value[idx] = char;
  emit_value();
  if (char && idx < props.length - 1) {
    inputs.value[idx + 1]?.focus();
  }
}

function onKeydown(idx: number, e: KeyboardEvent) {
  if (e.key === "Backspace") {
    if (digits.value[idx]) {
      digits.value[idx] = "";
      emit_value();
    } else if (idx > 0) {
      digits.value[idx - 1] = "";
      inputs.value[idx - 1]?.focus();
      emit_value();
    }
  } else if (e.key === "ArrowLeft" && idx > 0) {
    inputs.value[idx - 1]?.focus();
  } else if (e.key === "ArrowRight" && idx < props.length - 1) {
    inputs.value[idx + 1]?.focus();
  }
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault();
  const pasted = (e.clipboardData?.getData("text") ?? "").replace(/\D/g, "");
  pasted
    .split("")
    .slice(0, props.length)
    .forEach((char, i) => {
      digits.value[i] = char;
    });
  emit_value();
  const next = Math.min(pasted.length, props.length - 1);
  inputs.value[next]?.focus();
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.base-otp {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: fit-content;
}

.otp-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: $text-secondary;
}

.otp-fields {
  display: flex;
  align-items: center;
}

.otp-cell {
  border: 1.5px solid var(--border-light);
  background: var(--surface-glass);
  color: $text-primary;
  text-align: center;
  font-weight: 700;
  border-radius: 0.75rem;
  outline: none;
  transition: all 0.2s;
  appearance: none;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
  }

  &:focus {
    border-color: $primary-color;
    background: var(--surface-white);
    box-shadow: 0 0 0 3px rgba($primary-rgb, 0.15);
  }
}

// Sizes
.otp-sm .otp-cell {
  width: 2.25rem;
  height: 2.75rem;
  font-size: 1rem;
}
.otp-md .otp-cell {
  width: 2.75rem;
  height: 3.25rem;
  font-size: 1.25rem;
}
.otp-lg .otp-cell {
  width: 3.5rem;
  height: 4rem;
  font-size: 1.5rem;
}

// Error state
.otp-error .otp-cell {
  border-color: $status-danger;

  &:focus {
    box-shadow: 0 0 0 3px rgba($status-danger-rgb, 0.15);
  }
}

.otp-disabled .otp-cell {
  opacity: 0.5;
  cursor: not-allowed;
}

.otp-error-msg {
  font-size: 0.75rem;
  color: $status-danger;
  margin: 0;
}

.otp-hint {
  font-size: 0.75rem;
  color: $text-muted;
  margin: 0;
}
</style>
