<template>
  <div class="base-textarea-wrapper" :class="{ 'has-error': error }">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <div class="textarea-container">
      <textarea
        :id="id"
        class="base-textarea"
        :class="{ 'has-error': error, resizable: resize }"
        :value="modelValue"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength || undefined"
        v-bind="$attrs"
        @input="onInput"
      />
      <span
        v-if="maxlength"
        class="char-count"
        :class="{ 'near-limit': isNearLimit, 'at-limit': isAtLimit }"
      >
        {{ charCount }} / {{ maxlength }}
      </span>
    </div>

    <span v-if="error" class="error-text">{{ error }}</span>
    <span v-else-if="hint" class="hint-text">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    placeholder?: string;
    rows?: number;
    error?: string;
    hint?: string;
    required?: boolean;
    disabled?: boolean;
    maxlength?: number;
    resize?: boolean;
    id?: string;
  }>(),
  {
    modelValue: "",
    rows: 4,
    resize: false,
    id: () => `textarea-${Math.random().toString(36).substr(2, 9)}`,
  },
);

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const charCount = computed(() => (props.modelValue ?? "").length);
const isNearLimit = computed(() =>
  props.maxlength ? charCount.value >= props.maxlength * 0.85 : false,
);
const isAtLimit = computed(() =>
  props.maxlength ? charCount.value >= props.maxlength : false,
);

const onInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/component_mixins" as *;

.base-textarea-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
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
    margin-left: 0.25rem;
  }
}

.textarea-container {
  position: relative;
}

.base-textarea {
  @include input-base;
  height: auto;
  resize: none;
  line-height: 1.6;
  padding: 0.875rem 1rem;
  width: 100%;
  box-sizing: border-box;

  &.resizable {
    resize: vertical;
  }

  &.has-error {
    border-color: $status-danger;
  }
}

.char-count {
  position: absolute;
  bottom: 0.625rem;
  right: 0.875rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: $text-muted;
  pointer-events: none;
  transition: color 0.2s;

  &.near-limit {
    color: $status-warning;
  }
  &.at-limit {
    color: $status-danger;
  }
}

.error-text {
  font-size: 0.75rem;
  color: $status-danger;
  margin-left: 0.25rem;
}

.hint-text {
  font-size: 0.75rem;
  color: $text-muted;
  margin-left: 0.25rem;
}
</style>
