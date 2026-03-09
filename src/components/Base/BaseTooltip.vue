<template>
  <div
    class="base-tooltip-wrapper"
    ref="wrapperRef"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <slot></slot>

    <!-- Teleport to body to escape any overflow:hidden ancestors -->
    <Teleport to="body">
      <div
        v-if="isVisible"
        class="base-tooltip"
        :class="[position]"
        :style="tooltipStyle"
        role="tooltip"
      >
        <span v-if="text">{{ text }}</span>
        <slot v-else name="content"></slot>
        <div class="tooltip-arrow"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  text: { type: String, default: "" },
  position: {
    type: String,
    default: "top",
    validator: (v: string) => ["top", "bottom", "left", "right"].includes(v),
  },
  delay: { type: Number, default: 200 },
});

const isVisible = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);
// Store the computed position for the tooltip
const tooltipPos = ref({ top: 0, left: 0 });

let timeout: ReturnType<typeof setTimeout>;

const GAP = 10; // px gap between trigger and tooltip

const calcPosition = () => {
  if (!wrapperRef.value) return;
  const rect = wrapperRef.value.getBoundingClientRect();

  // We use a temporary (invisible) approach: set a preliminary position then
  // after the DOM paints, we can refine. For now, compute based on position prop.
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  switch (props.position) {
    case "top":
      tooltipPos.value = {
        top: rect.top + scrollY - GAP,
        left: rect.left + scrollX + rect.width / 2,
      };
      break;
    case "bottom":
      tooltipPos.value = {
        top: rect.bottom + scrollY + GAP,
        left: rect.left + scrollX + rect.width / 2,
      };
      break;
    case "left":
      tooltipPos.value = {
        top: rect.top + scrollY + rect.height / 2,
        left: rect.left + scrollX - GAP,
      };
      break;
    case "right":
      tooltipPos.value = {
        top: rect.top + scrollY + rect.height / 2,
        left: rect.right + scrollX + GAP,
      };
      break;
  }
};

const tooltipStyle = computed(() => {
  const { top, left } = tooltipPos.value;

  switch (props.position) {
    case "top":
      return {
        top: `${top}px`,
        left: `${left}px`,
        transform: "translateX(-50%) translateY(-100%)",
      };
    case "bottom":
      return {
        top: `${top}px`,
        left: `${left}px`,
        transform: "translateX(-50%)",
      };
    case "left":
      return {
        top: `${top}px`,
        left: `${left}px`,
        transform: "translateX(-100%) translateY(-50%)",
      };
    case "right":
      return {
        top: `${top}px`,
        left: `${left}px`,
        transform: "translateY(-50%)",
      };
    default:
      return {};
  }
});

const show = () => {
  timeout = setTimeout(async () => {
    calcPosition();
    isVisible.value = true;
  }, props.delay);
};

const hide = () => {
  clearTimeout(timeout);
  isVisible.value = false;
};
</script>

<style lang="scss">
/* Note: NOT scoped — Teleport renders outside the component's scope */
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/component_mixins" as *;

.base-tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.base-tooltip {
  @include tooltip-base;
  position: fixed; /* Use fixed so it's relative to viewport, not document */
  opacity: 1;
  visibility: visible;
  pointer-events: none;
  z-index: 9999;

  &.top .tooltip-arrow {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px 5px 0;
    border-color: rgba(var(--neutral-900-rgb), 0.85) transparent transparent
      transparent;
  }

  &.bottom .tooltip-arrow {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 5px 5px;
    border-color: transparent transparent rgba(var(--neutral-900-rgb), 0.85)
      transparent;
  }

  &.left .tooltip-arrow {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px 0 5px 5px;
    border-color: transparent transparent transparent
      rgba(var(--neutral-900-rgb), 0.85);
  }

  &.right .tooltip-arrow {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px 5px 5px 0;
    border-color: transparent rgba(var(--neutral-900-rgb), 0.85) transparent
      transparent;
  }
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}
</style>
