<template>
  <div class="base-dashboard-grid">
    <GridLayout
      v-if="layout.length"
      v-model:layout="internalLayout"
      :col-num="cols"
      :row-height="rowHeight"
      :is-draggable="editable"
      :is-resizable="editable"
      :responsive="true"
      :vertical-compact="true"
      :use-css-transforms="true"
    >
      <GridItem
        v-for="item in internalLayout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :min-w="item.minW || 2"
        :min-h="item.minH || 2"
        class="grid-item-wrapper"
        :class="{ 'is-editing': editable }"
      >
        <!-- Item Content -->
        <div class="grid-item-content">
           <slot :name="item.i" :item="item">
             <!-- Fallback if no specific slot -->
             <div class="default-placeholder">
               {{ item.i }}
             </div>
           </slot>
        </div>

        <!-- Edit Overlay (Optional) -->
        <div v-if="editable" class="edit-overlay">
           <span class="material-symbols-outlined handle">drag_indicator</span>
        </div>
      </GridItem>
    </GridLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { GridLayout, GridItem } from 'grid-layout-plus';

// Define Prop Interface
interface GridLayoutItem {
  i: string | number;
  x: number;
  y: number;
  w: number;
  h: number;
  [key: string]: any;
}

const props = defineProps({
  layout: { type: Array as () => GridLayoutItem[], required: true },
  editable: { type: Boolean, default: false },
  cols: { type: Number, default: 12 },
  rowHeight: { type: Number, default: 60 } // Base row height
});

const emit = defineEmits(['update:layout']);

// Internal layout state to avoid mutating props directly during drag
const internalLayout = ref<GridLayoutItem[]>([]);

// Sync prop to internal
watch(() => props.layout, (newVal) => {
  const currentStr = JSON.stringify(internalLayout.value);
  const newStr = JSON.stringify(newVal);
  if (currentStr !== newStr) {
    internalLayout.value = JSON.parse(newStr);
  }
}, { immediate: true, deep: true });

// Sync internal to parent
watch(internalLayout, (newVal) => {
  emit('update:layout', newVal);
}, { deep: true });

</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.base-dashboard-grid {
  width: 100%;
}

.grid-item-wrapper {
  transition: box-shadow 0.2s;
  border-radius: 1.5rem; // Match glass card radius
  
  &.is-editing {
    border: 2px dashed rgba($primary-color, 0.5);
    background: rgba(255, 255, 255, 0.4);
    
    // Add handles or specific styles for edit mode
    &:hover {
      background: rgba(255, 255, 255, 0.6);
      cursor: move;
    }
  }

  // Ensure tooltips/dropdowns in charts display correctly
  // grid-layout uses overflow hidden sometimes, check if needed
}

.grid-item-content {
  width: 100%;
  height: 100%;
}

.edit-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 50;
  color: $text-secondary;
  pointer-events: none; // Let events pass to grid item logic
  
  .handle {
    font-size: 1.5rem;
    opacity: 0.5;
  }
}

// Override grid-layout placeholder style
:deep(.vue-grid-placeholder) {
  background: rgba($primary-color, 0.1) !important;
  border-radius: 1.5rem !important;
  opacity: 0.5;
}
</style>
