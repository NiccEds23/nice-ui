<template>
  <div
    class="base-select-wrapper"
    :class="{ 'has-error': error, disabled: disabled }"
    v-bind="$attrs"
    ref="containerRef"
  >
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <div class="select-container" @click="toggleDropdown">
      <div class="input-display-wrapper" :class="{ 'has-error': error }">
        <input
          v-if="searchable"
          ref="inputRef"
          :id="id"
          type="text"
          class="base-select-input"
          :value="displayValue"
          :placeholder="computedPlaceholder"
          :disabled="disabled"
          @input="handleInput"
          autocomplete="off"
        />
        <div
          v-else
          class="base-select-display"
          :class="{ placeholder: isPlaceholderVisible }"
        >
          {{ displayValue || computedPlaceholder }}
        </div>

        <div class="icon-wrapper">
          <span
            class="material-symbols-outlined arrow-icon"
            :class="{ rotated: isOpen }"
          >
            expand_more
          </span>
        </div>
      </div>
    </div>

    <!-- Selected Items Tags (Multi-select) -->
    <div
      v-if="multiple && Array.isArray(modelValue) && modelValue.length > 0"
      class="selected-tags"
    >
      <span v-for="(value, index) in modelValue" :key="index" class="tag-chip">
        {{ getLabelForValue(value) }}
        <button class="remove-tag-btn" @click.stop="removeTag(value)">
          <span class="material-symbols-outlined">close</span>
        </button>
      </span>
    </div>

    <span v-if="error" class="error-text">{{ error }}</span>
    <span v-else-if="hint" class="hint-text">{{ hint }}</span>
  </div>

  <!-- ── Teleported Dropdown ─────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="bs-dropdown">
      <div
        v-if="isOpen"
        class="bs-dropdown-menu"
        :class="{ 'bs-drop-up': isDropUp }"
        :style="dropdownStyle"
        ref="dropdownRef"
      >
        <ul class="bs-options-list">
          <li v-if="loading" class="bs-option-item bs-loading">
            <span class="bs-spinner"></span> Loading...
          </li>

          <li
            v-else-if="filteredOptions.length === 0"
            class="bs-option-item bs-no-results"
          >
            No results found
          </li>

          <li
            v-else
            v-for="(option, index) in filteredOptions"
            :key="index"
            class="bs-option-item"
            :class="{ selected: isSelected(option) }"
            @click.stop="selectOption(option)"
          >
            {{ getLabel(option) }}
            <span
              v-if="isSelected(option)"
              class="material-symbols-outlined bs-check-icon"
              >check</span
            >
          </li>
        </ul>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

// The template has two root nodes (wrapper div + Teleport), so Vue cannot
// auto-inherit attrs. We disable auto-inheritance and manually bind $attrs
// to the visible root div so that class/style from parents work correctly.
defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [String, Number, Object, Array], default: "" },
  options: {
    type: Array as () => (string | number | { label: string; value: any })[],
    default: () => [],
  },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  searchable: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  error: { type: String, default: "" },
  hint: { type: String, default: "" },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  id: {
    type: String,
    default: () => `select-${Math.random().toString(36).substr(2, 9)}`,
  },
});

const emit = defineEmits(["update:modelValue", "search", "change"]);

const containerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const isDropUp = ref(false);
const searchQuery = ref("");
const dropdownStyle = ref<Record<string, string>>({});

// ── Options normalization ────────────────────────────────────────────────────

const normalizedOptions = computed(() => {
  return props.options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return opt as { label: string; value: any };
    }
    return { label: String(opt), value: opt };
  });
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return normalizedOptions.value;
  }
  const query = searchQuery.value.toLowerCase();
  return normalizedOptions.value.filter((opt) =>
    opt.label.toLowerCase().includes(query),
  );
});

const displayValue = computed(() => {
  if (isOpen.value && props.searchable) {
    return searchQuery.value;
  }
  if (props.multiple) {
    return "";
  }
  const selected = normalizedOptions.value.find(
    (opt) => opt.value === props.modelValue,
  );
  return selected ? selected.label : "";
});

const computedPlaceholder = computed(() => {
  if (
    props.multiple &&
    Array.isArray(props.modelValue) &&
    props.modelValue.length > 0
  ) {
    return props.searchable ? "Add more..." : "Select items...";
  }
  return props.placeholder;
});

const isPlaceholderVisible = computed(() => {
  if (props.multiple) return true;
  return !props.modelValue && !displayValue.value;
});

// ── Helpers ─────────────────────────────────────────────────────────────────

const isSelected = (option: { value: any }) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(option.value);
  }
  return option.value === props.modelValue;
};

const getLabel = (option: { label: string }) => option.label;

const getLabelForValue = (val: any) => {
  const option = normalizedOptions.value.find((opt) => opt.value === val);
  return option ? option.label : String(val);
};

// ── Positioning (Teleport-aware) ─────────────────────────────────────────────

const DROPDOWN_HEIGHT = 280; // estimated max height + buffer
const DROPDOWN_OFFSET = 6; // gap between trigger and dropdown

function calcDropdownStyle() {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;

  isDropUp.value = spaceBelow < DROPDOWN_HEIGHT && rect.top > DROPDOWN_HEIGHT;

  const width = `${rect.width}px`;
  const left = `${rect.left + window.scrollX}px`;

  if (isDropUp.value) {
    // Open upward
    dropdownStyle.value = {
      position: "fixed",
      left: `${rect.left}px`,
      bottom: `${window.innerHeight - rect.top + DROPDOWN_OFFSET}px`,
      width,
      "transform-origin": "bottom center",
    };
  } else {
    // Open downward
    dropdownStyle.value = {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.bottom + DROPDOWN_OFFSET}px`,
      width,
      "transform-origin": "top center",
    };
  }
  // suppress unused warning
  void left;
}

// ── Actions ─────────────────────────────────────────────────────────────────

const toggleDropdown = () => {
  if (props.disabled) return;

  if (!isOpen.value) {
    calcDropdownStyle();
    isOpen.value = true;
  } else {
    isOpen.value = false;
  }

  if (isOpen.value && props.searchable) {
    searchQuery.value = "";
    nextTick(() => inputRef.value?.focus());
  }
};

const closeDropdown = () => {
  isOpen.value = false;
  searchQuery.value = "";
};

const selectOption = (option: { label: string; value: any }) => {
  if (props.multiple) {
    let newValue: any[] = [];
    if (Array.isArray(props.modelValue)) {
      if (props.modelValue.includes(option.value)) {
        newValue = props.modelValue.filter((v) => v !== option.value);
      } else {
        newValue = [...props.modelValue, option.value];
      }
    } else {
      newValue = [option.value];
    }
    emit("update:modelValue", newValue);
    emit("change", newValue);
    searchQuery.value = "";
    if (props.searchable) {
      inputRef.value?.focus();
    }
  } else {
    emit("update:modelValue", option.value);
    emit("change", option.value);
    closeDropdown();
  }
};

const removeTag = (val: any) => {
  if (Array.isArray(props.modelValue)) {
    const newValue = props.modelValue.filter((v) => v !== val);
    emit("update:modelValue", newValue);
    emit("change", newValue);
  }
};

const handleInput = (event: Event) => {
  const val = (event.target as HTMLInputElement).value;
  searchQuery.value = val;
  emit("search", val);
  if (!isOpen.value) {
    isOpen.value = true;
  }
};

// Close on outside click — need to handle dropdown ref too since it's teleported
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  const inContainer = containerRef.value?.contains(target);
  const inDropdown = dropdownRef.value?.contains(target);
  if (!inContainer && !inDropdown) {
    closeDropdown();
  }
};

// Reposition on scroll/resize so the dropdown follows the trigger
const handleScrollResize = () => {
  if (isOpen.value) {
    calcDropdownStyle();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside, true);
  window.addEventListener("scroll", handleScrollResize, true);
  window.addEventListener("resize", handleScrollResize);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside, true);
  window.removeEventListener("scroll", handleScrollResize, true);
  window.removeEventListener("resize", handleScrollResize);
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/component_mixins" as *;

.base-select-wrapper {
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
    margin-left: 0.25rem;
  }
}

.select-container {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.input-display-wrapper {
  @include input-base;
  padding: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 2.75rem;
  transition: all 0.2s;
}

.base-select-input {
  border: none;
  background: transparent;
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  font-size: 0.875rem;
  color: $text-primary;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: $text-muted;
  }
}

.base-select-display {
  flex: 1;
  padding: 0 1rem;
  font-size: 0.875rem;
  color: $text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  display: flex;
  align-items: center;
  height: 100%;

  &.placeholder {
    color: $text-muted;
  }
}

.icon-wrapper {
  padding-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  font-size: 1.25rem;
  color: $text-secondary;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.rotated {
    transform: rotate(180deg);
  }
}

// Multi-select Tags
.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;

  .tag-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: rgba($primary-rgb, 0.1);
    color: $primary-hover;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    backdrop-filter: blur(4px);

    .remove-tag-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: currentColor;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
      padding: 0;

      span {
        font-size: 1rem;
      }

      &:hover {
        opacity: 1;
      }
    }
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

<!-- Non-scoped: dropdown is Teleported to <body> so scoped styles won't reach it -->
<style lang="scss">
@use "@/assets/styles/variables" as *;

.bs-dropdown-menu {
  z-index: 9999;
  max-height: 260px;
  overflow-y: auto;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-glass);
  border-radius: 1rem;
  box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;

  &.bs-drop-up {
    box-shadow: 0 -12px 40px -8px rgba(0, 0, 0, 0.15);
  }
}

.bs-options-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bs-option-item {
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block: 2px;

  &:hover {
    background: rgba(var(--primary-rgb), 0.08);
    color: var(--text-primary);
  }

  &.selected {
    background: rgba(var(--primary-rgb), 0.1);
    color: var(--primary-color);
    font-weight: 600;
  }

  &.bs-loading,
  &.bs-no-results {
    color: var(--text-muted);
    justify-content: center;
    cursor: default;

    &:hover {
      background: transparent;
    }
  }
}

.bs-check-icon {
  font-size: 1rem;
  color: var(--primary-color);
}

.bs-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(var(--primary-rgb), 0.2);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: bs-spin 0.8s linear infinite;
  margin-right: 0.5rem;
}

@keyframes bs-spin {
  to {
    transform: rotate(360deg);
  }
}

// Transition
.bs-dropdown-enter-active,
.bs-dropdown-leave-active {
  transition:
    opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}

.bs-dropdown-enter-from,
.bs-dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.94);
}
</style>
