<template>
  <Teleport to="body">
    <Transition name="drawer-backdrop">
      <div
        v-if="visible"
        class="drawer-backdrop"
        @click="closeOnBackdrop && close()"
      />
    </Transition>
    <Transition :name="`drawer-slide-${placement}`">
      <div
        v-if="visible"
        class="base-drawer"
        :class="[`drawer-${placement}`, `drawer-size-${size}`]"
        role="dialog"
        aria-modal="true"
      >
        <!-- Header -->
        <div class="drawer-header">
          <div class="drawer-header-text">
            <span
              v-if="icon"
              class="material-symbols-outlined drawer-header-icon"
              >{{ icon }}</span
            >
            <div>
              <h3 class="drawer-title">{{ title }}</h3>
              <p v-if="subtitle" class="drawer-subtitle">{{ subtitle }}</p>
            </div>
          </div>
          <button class="drawer-close-btn" @click="close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Body -->
        <div class="drawer-body">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="drawer-footer">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from "vue";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    title?: string;
    subtitle?: string;
    icon?: string;
    placement?: "right" | "left" | "bottom";
    size?: "sm" | "md" | "lg" | "xl";
    closeOnBackdrop?: boolean;
  }>(),
  {
    title: "",
    placement: "right",
    size: "md",
    closeOnBackdrop: true,
  },
);

const emit = defineEmits<{
  "update:visible": [value: boolean];
  close: [];
}>();

const close = () => {
  emit("update:visible", false);
  emit("close");
};

// Lock body scroll when open
watch(
  () => props.visible,
  (val) => {
    document.body.style.overflow = val ? "hidden" : "";
  },
);

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style lang="scss">
@use "@/assets/styles/variables" as *;

.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 200;
}

.base-drawer {
  position: fixed;
  z-index: 201;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-glass);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  // Placement
  &.drawer-right {
    top: 0;
    right: 0;
    height: 100%;
    border-radius: 1.5rem 0 0 1.5rem;
  }
  &.drawer-left {
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 0 1.5rem 1.5rem 0;
  }
  &.drawer-bottom {
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 1.5rem 1.5rem 0 0;
    max-height: 80vh;
  }

  // Sizes (width for left/right, height for bottom)
  &.drawer-size-sm {
    &.drawer-right,
    &.drawer-left {
      width: 20rem;
    }
    &.drawer-bottom {
      max-height: 40vh;
    }
  }
  &.drawer-size-md {
    &.drawer-right,
    &.drawer-left {
      width: 28rem;
    }
    &.drawer-bottom {
      max-height: 55vh;
    }
  }
  &.drawer-size-lg {
    &.drawer-right,
    &.drawer-left {
      width: 36rem;
    }
    &.drawer-bottom {
      max-height: 70vh;
    }
  }
  &.drawer-size-xl {
    &.drawer-right,
    &.drawer-left {
      width: 44rem;
    }
    &.drawer-bottom {
      max-height: 85vh;
    }
  }
}

.drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.drawer-header-text {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  .drawer-header-icon {
    font-size: 1.5rem;
    color: $primary-color;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }
}

.drawer-title {
  font-size: 1rem;
  font-weight: 700;
  color: $text-primary;
  margin: 0;
}

.drawer-subtitle {
  font-size: 0.8125rem;
  color: $text-muted;
  margin: 0.25rem 0 0;
}

.drawer-close-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: none;
  background: var(--surface-glass);
  color: $text-muted;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    background: rgba($status-danger-rgb, 0.1);
    color: $status-danger;
  }

  .material-symbols-outlined {
    font-size: 1.125rem;
  }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.drawer-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-light);
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  flex-shrink: 0;
}

// ── Transitions ─────────────────────────────────────────────────────────────
.drawer-backdrop-enter-active,
.drawer-backdrop-leave-active {
  transition: opacity 0.25s;
}
.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}

.drawer-slide-right-enter-active,
.drawer-slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-slide-right-enter-from,
.drawer-slide-right-leave-to {
  transform: translateX(100%);
}

.drawer-slide-left-enter-active,
.drawer-slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-slide-left-enter-from,
.drawer-slide-left-leave-to {
  transform: translateX(-100%);
}

.drawer-slide-bottom-enter-active,
.drawer-slide-bottom-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-slide-bottom-enter-from,
.drawer-slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
