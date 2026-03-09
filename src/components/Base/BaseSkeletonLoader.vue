<template>
  <div class="skeleton-wrapper" :style="wrapperStyle">
    <!-- Paragraph / text lines -->
    <template v-if="type === 'text'">
      <div
        v-for="i in lines"
        :key="i"
        class="skeleton-line"
        :class="{ animated }"
        :style="{
          width: i === lines ? lastLineWidth : '100%',
          height: lineHeight,
        }"
      />
    </template>

    <!-- Avatar / circle -->
    <div
      v-else-if="type === 'avatar'"
      class="skeleton-block"
      :class="{ animated, circle: true }"
      :style="{ width: size, height: size }"
    />

    <!-- Image rectangle -->
    <div
      v-else-if="type === 'image'"
      class="skeleton-block"
      :class="{ animated }"
      :style="{
        width: '100%',
        height: height || '12rem',
        borderRadius: '0.75rem',
      }"
    />

    <!-- Button shape -->
    <div
      v-else-if="type === 'button'"
      class="skeleton-block"
      :class="{ animated }"
      :style="{
        width: width || '8rem',
        height: '2.5rem',
        borderRadius: '0.75rem',
      }"
    />

    <!-- Card scaffold -->
    <div
      v-else-if="type === 'card'"
      class="skeleton-card"
      :class="{ animated }"
    >
      <div class="skeleton-card-header">
        <div
          class="skeleton-block circle"
          :style="{ width: '2.5rem', height: '2.5rem' }"
        />
        <div class="skeleton-card-info">
          <div
            class="skeleton-line"
            :style="{ width: '60%', height: '0.875rem' }"
          />
          <div
            class="skeleton-line"
            :style="{ width: '40%', height: '0.625rem' }"
          />
        </div>
      </div>
      <div
        class="skeleton-line"
        :style="{ width: '100%', height: '0.75rem', marginTop: '1rem' }"
      />
      <div class="skeleton-line" :style="{ width: '90%', height: '0.75rem' }" />
      <div class="skeleton-line" :style="{ width: '70%', height: '0.75rem' }" />
    </div>

    <!-- Custom / generic block -->
    <div
      v-else
      class="skeleton-block"
      :class="{ animated }"
      :style="{
        width: width || '100%',
        height: height || '1rem',
        borderRadius,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    type?: "text" | "avatar" | "image" | "button" | "card" | "block";
    lines?: number;
    animated?: boolean;
    width?: string;
    height?: string;
    size?: string; // for avatar
    lineHeight?: string;
    lastLineWidth?: string;
    borderRadius?: string;
  }>(),
  {
    type: "block",
    lines: 3,
    animated: true,
    size: "3rem",
    lineHeight: "0.875rem",
    lastLineWidth: "75%",
    borderRadius: "0.5rem",
  },
);

const wrapperStyle = computed(() => ({
  display: "flex",
  flexDirection: (props.type === "text" || props.type === "card"
    ? "column"
    : "row") as "column" | "row",
  gap: "0.5rem",
  width: "100%",
}));
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

$shimmer-base: var(--surface-glass);
$shimmer-shine: rgba(var(--neutral-200-rgb, 226, 232, 240), 0.6);

.skeleton-line,
.skeleton-block {
  background: var(--surface-glass);
  border-radius: 0.5rem;
  flex-shrink: 0;

  &.animated {
    background: linear-gradient(
      90deg,
      var(--neutral-50) 0%,
      var(--neutral-100) 50%,
      var(--neutral-50) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }

  &.circle {
    border-radius: 50%;
  }
}

.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  background: var(--surface-white);

  &.animated * {
    background: linear-gradient(
      90deg,
      var(--neutral-50) 0%,
      var(--neutral-100) 50%,
      var(--neutral-50) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s ease-in-out infinite;
  }
}

.skeleton-card-header {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.skeleton-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
</style>
