<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="toast-item-wrapper"
      >
        <!-- Reusing BaseAlertBanner style logic manually or importing it? 
             User asked for "file Base Toast" and "use existing Base Alert style".
             Since BaseAlertBanner is designed for inline, we can wrap it or reimplement specific toast style.
             Let's use BaseAlertBanner but ensure it looks good floating. 
        -->
        <BaseAlertBanner 
          :variant="toast.variant" 
          :title="toast.title" 
          dismissible 
          @dismiss="removeToast(toast.id)"
          class="toast-alert"
        >
          {{ toast.message }}
        </BaseAlertBanner>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '@/stores/ui';
import BaseAlertBanner from '@/components/Base/BaseAlertBanner.vue';

const uiStore = useUIStore();
const toasts = computed(() => uiStore.toasts);

const removeToast = (id: string) => {
  uiStore.removeToast(id);
};
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10001; // Higher than modal 10000? Let's say yes. Global Alert overlay is 10000.
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 24rem;
  max-width: calc(100vw - 3rem);
  pointer-events: none; // Allow clicks through empty areas
}

.toast-item-wrapper {
  pointer-events: auto; // Capture clicks on notifications
  width: 100%;
}

.toast-alert {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
}

// Transitions
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
