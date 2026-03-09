<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal-container" @click.stop>
          <div class="modal-content glass-modal" :class="sizeClass">
            <button v-if="showClose" class="close-btn" @click="close">
              <span class="material-symbols-outlined">close</span>
            </button>
            
            <div class="modal-header" v-if="$slots.header || title">
              <slot name="header">
                 <div v-if="icon" class="header-icon" :class="iconColorClass">
                    <span class="material-symbols-outlined">{{ icon }}</span>
                 </div>
                 <h3 class="title">{{ title }}</h3>
              </slot>
            </div>

            <div class="modal-body">
              <slot></slot>
            </div>

            <div class="modal-footer" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, default: '' },
  size: { type: String, default: 'md', validator: (v: string) => ['sm', 'md', 'lg', 'xl'].includes(v) },
  showClose: { type: Boolean, default: true },
  icon: { type: String, default: '' },
  iconColor: { type: String, default: 'blue' },
  closeOnBackdrop: { type: Boolean, default: true }
});

const emit = defineEmits(['update:visible', 'close']);

const sizeClass = computed(() => `modal-${props.size}`);

const iconColorClass = computed(() => {
  const colors: Record<string, string> = {
    blue: 'soft-blue',
    green: 'soft-emerald',
    red: 'soft-rose',
    purple: 'soft-purple',
    indigo: 'soft-indigo'
  };
  return colors[props.iconColor] || 'soft-blue';
});

const close = () => {
  emit('update:visible', false);
  emit('close');
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) close();
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/component_mixins' as *;

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  @include modal-overlay;
}

.modal-container {
  padding: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

.modal-content {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  @include glass-modal;
  
  &.modal-sm { max-width: 24rem; }
  &.modal-md { max-width: 32rem; }
  &.modal-lg { max-width: 48rem; }
  &.modal-xl { max-width: 64rem; }
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  color: $text-muted; // #94a3b8
  transition: all 0.2s;
  
  &:hover {
    background: rgba($neutral-100, 0.5); // rgba(241, 245, 249, 0.5)
    color: $neutral-600; // #475569
  }
}

.modal-header {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .header-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255,255,255,0.6);
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
    
    .material-symbols-outlined { font-size: 2rem; }
    
    &.soft-blue { 
      background: rgba($status-info, 0.1); 
      color: $status-info; 
      border-color: rgba($status-info, 0.2); 
    }
    &.soft-emerald { 
      background: rgba($status-success, 0.1); 
      color: $status-success; 
      border-color: rgba($status-success, 0.2); 
    }
    &.soft-rose { 
      background: rgba($status-danger, 0.1); 
      color: $status-danger; 
      border-color: rgba($status-danger, 0.2); 
    }
    &.soft-purple {
      background: rgba($accent-color, 0.1);
      color: $accent-color;
      border-color: rgba($accent-color, 0.2);
    }
    &.soft-indigo {
       background: rgba($secondary-color, 0.1);
       color: $secondary-color;
       border-color: rgba($secondary-color, 0.2);
    }
  }

  .title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $text-primary; // #1e293b
    letter-spacing: -0.025em;
    margin: 0;
  }
}

.modal-body {
  margin-bottom: 2rem;
  color: $text-secondary; // #64748b
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  width: 100%;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  width: 100%;
}

// Transitions
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
  
  .modal-content {
    transition: all 0.3s ease-out;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  
  .modal-content {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
}
</style>
