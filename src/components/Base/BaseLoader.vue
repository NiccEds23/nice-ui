<template>
  <Transition name="fade">
    <div v-if="show" class="base-loader" :class="{ 'fullscreen': fullScreen }">
      <div class="loader-content">
        <div class="spinner-container">
          <div class="spinner-ring"></div>
          <div class="spinner-ring inner"></div>
          <div class="logo-orb"></div>
        </div>
        <p v-if="message" class="loading-message">{{ message }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">


const props = defineProps({
  show: { type: Boolean, default: false },
  fullScreen: { type: Boolean, default: false },
  message: { type: String, default: '' }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.base-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s ease;

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  &:not(.fullscreen) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit; // Inherit border radius from parent container
  }
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: $primary-color;
  animation: spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; // Smooth spin

  &.inner {
    width: 70%;
    height: 70%;
    border-top-color: $secondary-color;
    animation-duration: 1s;
    animation-direction: reverse;
  }
}

.logo-orb {
  width: 20%;
  height: 20%;
  background: $primary-gradient;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba($primary-color, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

.loading-message {
  font-family: $font-family-base;
  font-size: 1rem;
  font-weight: 600;
  color: $text-primary;
  letter-spacing: 0.05em;
  animation: fadePulse 2s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 25px rgba($primary-color, 0.6); }
}

@keyframes fadePulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

// Vue Transition classes
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
