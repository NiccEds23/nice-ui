<template>
  <div class="base-popover" ref="containerRef">
    <!-- Trigger -->
    <div
      class="popover-trigger"
      @click="trigger === 'click' && toggle()"
      @mouseenter="trigger === 'hover' && open()"
      @mouseleave="trigger === 'hover' && close()"
    >
      <slot name="trigger" />
    </div>

    <!-- Floating Content — Teleported -->
    <Teleport to="body">
      <Transition name="popover-fade">
        <div
          v-if="visible"
          class="popover-floating"
          :class="`popover-${position}`"
          :style="floatingStyle"
          ref="floatingRef"
          role="tooltip"
          @mouseenter="trigger === 'hover' && open()"
          @mouseleave="trigger === 'hover' && close()"
        >
          <div class="popover-arrow" />
          <div class="popover-content" :style="{ maxWidth: maxWidth }">
            <div v-if="title" class="popover-title">{{ title }}</div>
            <slot />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

const props = withDefaults(
  defineProps<{
    position?: "top" | "bottom" | "left" | "right";
    trigger?: "click" | "hover";
    title?: string;
    maxWidth?: string;
  }>(),
  {
    position: "top",
    trigger: "click",
    maxWidth: "260px",
  },
);

const visible = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const floatingStyle = ref<Record<string, string>>({});

let closeTimer: ReturnType<typeof setTimeout> | null = null;

function calcPosition() {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  const scroll = { x: window.scrollX, y: window.scrollY };

  const pos = props.position;
  const offset = 10;

  const base: Record<string, string> = {};

  if (pos === "top") {
    base.left = `${rect.left + scroll.x + rect.width / 2}px`;
    base.top = `${rect.top + scroll.y - offset}px`;
    base.transform = "translate(-50%, -100%)";
  } else if (pos === "bottom") {
    base.left = `${rect.left + scroll.x + rect.width / 2}px`;
    base.top = `${rect.bottom + scroll.y + offset}px`;
    base.transform = "translate(-50%, 0)";
  } else if (pos === "left") {
    base.left = `${rect.left + scroll.x - offset}px`;
    base.top = `${rect.top + scroll.y + rect.height / 2}px`;
    base.transform = "translate(-100%, -50%)";
  } else {
    base.left = `${rect.right + scroll.x + offset}px`;
    base.top = `${rect.top + scroll.y + rect.height / 2}px`;
    base.transform = "translate(0, -50%)";
  }

  floatingStyle.value = base;
}

async function open() {
  if (closeTimer) clearTimeout(closeTimer);
  visible.value = true;
  await nextTick();
  calcPosition();
}

function close() {
  closeTimer = setTimeout(() => {
    visible.value = false;
  }, 80);
}

function toggle() {
  if (visible.value) {
    visible.value = false;
  } else {
    open();
  }
}
</script>

<style lang="scss">
@use "@/assets/styles/variables" as *;

.base-popover {
  position: relative;
  display: inline-flex;
}

.popover-trigger {
  display: inline-flex;
}

.popover-floating {
  position: absolute;
  z-index: 9000;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12));
}

.popover-content {
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-glass);
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  line-height: 1.6;
}

.popover-title {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: 0.375rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--border-light);
}

.popover-arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--surface-glass-heavy);
  border: 1px solid var(--border-glass);
  transform: rotate(45deg);
}

// Arrow placement
.popover-top .popover-arrow {
  bottom: -6px;
  left: 50%;
  margin-left: -5px;
  border-top: none;
  border-left: none;
}
.popover-bottom .popover-arrow {
  top: -6px;
  left: 50%;
  margin-left: -5px;
  border-bottom: none;
  border-right: none;
}
.popover-left .popover-arrow {
  right: -6px;
  top: 50%;
  margin-top: -5px;
  border-left: none;
  border-bottom: none;
}
.popover-right .popover-arrow {
  left: -6px;
  top: 50%;
  margin-top: -5px;
  border-right: none;
  border-top: none;
}

// Transition
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: scale(0.96) translate(var(--tx, -50%), var(--ty, -100%));
}
</style>
