<template>
  <div class="base-card glass-card" :class="{ 'clickable': clickable }">
    <div class="card-header" v-if="$slots.header || title">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </slot>
    </div>
    
    <div class="card-body" :class="{ 'no-padding': noBodyPadding }">
      <slot></slot>
    </div>
    
    <div class="card-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  clickable: { type: Boolean, default: false },
  noBodyPadding: { type: Boolean, default: false }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.base-card {
  @include glass-card;
  border-radius: 2rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &.clickable {
    cursor: pointer;
    // Hover effects already in glass-card mixin
  }
}

.card-header {
  padding: 2rem 2rem 1rem 2rem;
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: $text-primary;
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.025em;
  }
  
  .card-subtitle {
    font-size: 0.875rem;
    color: $text-secondary;
    margin-top: 0.5rem;
    margin-bottom: 0;
  }
}

.card-body {
  padding: 1rem 2rem 2rem 2rem;
  flex: 1;
  color: $neutral-700;
  
  &.no-padding {
    padding: 0;
  }
}

.card-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba($neutral-200, 0.4);
  background: rgba($neutral-50, 0.3);
}
</style>
