<template>
  <nav v-if="breadcrumbs.length > 0" class="base-breadcrumb" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li v-for="(item, index) in breadcrumbs" :key="index" class="breadcrumb-item">
        <!-- Separator -->
        <span v-if="index > 0" class="material-symbols-outlined separator">chevron_right</span>
        
        <!-- Link (if not last item and has 'to') -->
        <router-link 
          v-if="index < breadcrumbs.length - 1 && item.to" 
          :to="item.to" 
          class="breadcrumb-link"
        >
          {{ item.label }}
        </router-link>
        
        <!-- Current Page / Text -->
        <span 
          v-else 
          class="breadcrumb-text" 
          :class="{ 'current': index === breadcrumbs.length - 1 }"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();
const breadcrumbs = computed(() => uiStore.breadcrumbs);
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.base-breadcrumb {
  margin-bottom: 1.5rem;
  
  .breadcrumb-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 0.25rem;
  }

  .breadcrumb-item {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: $text-secondary;
    
    .separator {
      font-size: 1.25rem;
      color: $text-muted;
      margin: 0 0.125rem;
      user-select: none;
    }

    .breadcrumb-link {
      color: $text-secondary;
      text-decoration: none;
      transition: color 0.2s;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;

      &:hover {
        color: $primary-color;
        background: rgba($primary-color, 0.05);
      }
    }

    .breadcrumb-text {
      padding: 0.25rem 0.5rem;
      
      &.current {
        color: $text-primary;
        font-weight: 600;
        cursor: default;
      }
    }
  }
}
</style>
