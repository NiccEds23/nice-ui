<template>
  <div class="base-input-wrapper" :class="{ 'has-error': error }">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="input-container">
      <span v-if="icon" class="material-symbols-outlined input-icon">{{ icon }}</span>
      
      <input
        :id="id"
        class="base-input"
        :class="{ 'with-icon': icon, 'has-error': error, 'with-toggle': isPasswordType }"
        :type="inputType"
        :value="modelValue"
        v-bind="$attrs"
        v-maska="maskOptions"
        @input="updateValue"
      />
      
      <button 
        v-if="isPasswordType" 
        type="button" 
        class="toggle-btn" 
        @click="togglePassword"
        tabindex="-1"
      >
        <span class="material-symbols-outlined icon">
            {{ showPassword ? 'visibility_off' : 'visibility' }}
        </span>
      </button>
      
      <span v-if="success && !isPasswordType" class="material-symbols-outlined status-icon success">check_circle</span>
      <span v-if="error && !isPasswordType" class="material-symbols-outlined status-icon error">error</span>
    </div>

    <span v-if="error" class="error-text">{{ error }}</span>
    <span v-else-if="hint" class="hint-text">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { vMaska } from 'maska/vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  icon: { type: String, default: '' },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  success: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  id: { type: String, default: () => `input-${Math.random().toString(36).substr(2, 9)}` },
  mask: { type: [String, Object], default: '' },
  currency: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

const showPassword = ref(false);

const isPasswordType = computed(() => props.type === 'password');
const inputType = computed(() => {
    if (isPasswordType.value) {
        return showPassword.value ? 'text' : 'password';
    }
    return props.type;
});

// Configure Maska options based on props
const maskOptions = computed((): any => {
    if (props.currency) {
        return {
            number: {
                locale: 'id-ID',
                fraction: 2, // Standard Accounting
                unsigned: false // Allow negative
            }
        };
    }
    return props.mask || undefined;
});

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  // If numeric mask is applied, we might want to ensure the parent gets the underlying number?
  // Standard BaseInput behavior is to emit the string value of the input.
  // Parsing should be handled by the parent or a custom modifier if needed.
  emit('update:modelValue', target.value);
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/component_mixins' as *;

.base-input-wrapper {
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

.input-container {
  position: relative;
  width: 100%;
}

.base-input {
  @include input-base;
  
  &.with-icon {
    padding-left: 3rem;
  }
  
  &.with-toggle {
    padding-right: 3rem;
  }
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: $text-muted;
  pointer-events: none;
}

.status-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  
  &.success { color: $status-success; }
  &.error { color: $status-danger; }
}

.toggle-btn {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%); // center vertically
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: $text-muted;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        color: $text-primary;
    }
    
    .icon {
        font-size: 1.25rem;
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
