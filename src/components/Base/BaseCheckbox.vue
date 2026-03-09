<template>
  <label class="base-checkbox" :class="{ disabled }">
    <input 
      type="checkbox" 
      class="hidden-input"
      :checked="isChecked"
      :disabled="disabled"
      @change="handleChange"
    />
    <div class="custom-box" :class="{ checked: isChecked }">
      <span class="material-symbols-outlined check-icon">check</span>
    </div>
    <span v-if="label || $slots.default" class="label-text">
        <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';

const props = defineProps({
  modelValue: { 
    type: [Boolean, Array] as PropType<boolean | any[]>, 
    default: false 
  },
  value: { 
    type: [String, Number, Object, Boolean] as PropType<any>, 
    default: undefined 
  },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value);
  }
  return props.modelValue;
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const isChecked = target.checked;

  if (Array.isArray(props.modelValue)) {
    const newValue = [...props.modelValue];
    if (isChecked) {
      newValue.push(props.value);
    } else {
      const index = newValue.indexOf(props.value);
      if (index !== -1) {
        newValue.splice(index, 1);
      }
    }
    emit('update:modelValue', newValue);
  } else {
    emit('update:modelValue', isChecked);
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.base-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .hidden-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    
    &:focus + .custom-box {
       box-shadow: 0 0 0 2px rgba($primary-hover, 0.2);
    }
  }

  .custom-box {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 0.25rem;
    border: 1px solid $neutral-300;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0; // Prevent shrinking

    .check-icon {
        font-size: 0.875rem;
        color: white;
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 700;
    }

    &.checked {
        background: $primary-hover;
        border-color: $primary-hover;

        .check-icon {
            opacity: 1;
            transform: scale(1);
        }
    }
  }

  .label-text {
      font-size: 0.875rem;
      color: $text-primary;
  }

  &:hover:not(.disabled) .custom-box:not(.checked) {
      border-color: $primary-color;
      background: rgba($primary-color, 0.05);
  }
}
</style>
