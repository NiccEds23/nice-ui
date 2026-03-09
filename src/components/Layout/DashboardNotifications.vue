<template>
  <div class="notifications-container" ref="containerRef">
    <!-- Trigger Button -->
    <button class="icon-btn" @click="toggleDropdown" :class="{ 'active': isOpen }">
      <span class="material-symbols-outlined">notifications</span>
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </button>

    <!-- Dropdown -->
    <transition name="fade-slide">
      <div v-if="isOpen" class="notification-dropdown">
        <div class="dropdown-header">
          <h3>Notifications</h3>
          <button 
            v-if="notifications.length > 0" 
            class="clear-btn" 
            @click="clearAll"
          >
            Clear All
          </button>
        </div>

        <div class="notification-list">
          <div v-if="notifications.length === 0" class="empty-state">
            <span class="material-symbols-outlined icon">notifications_off</span>
            <p>No new notifications</p>
          </div>

          <div 
            v-for="item in notifications" 
            :key="item.id" 
            class="notification-item"
            :class="{ 'unread': !item.read }"
            @click="markAsRead(item.id)"
          >
            <div class="icon-wrapper" :class="getVariantClass(item.type)">
              <span class="material-symbols-outlined">{{ getIcon(item.type) }}</span>
            </div>
            <div class="content">
              <p class="title">{{ item.title }}</p>
              <p class="message">{{ item.message }}</p>
              <span class="time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

const containerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const notifications = ref<Notification[]>([
  {
    id: 1,
    title: 'System Update',
    message: 'Magic ERP scheduled maintenance at 02:00 AM.',
    time: 'Just now',
    type: 'info',
    read: false
  },
  {
    id: 2,
    title: 'New Order Received',
    message: 'Order #ORD-2024-001 has been placed.',
    time: '2 min ago',
    type: 'success',
    read: false
  },
  {
    id: 3,
    title: 'Storage Warning',
    message: 'Server storage is reaching 90% capacity.',
    time: '1 hour ago',
    type: 'warning',
    read: false
  },
  {
    id: 4,
    title: 'Payment Failed',
    message: 'Transaction #TX-9981 failed. Please review.',
    time: '3 hours ago',
    type: 'error',
    read: true
  }
]);

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const clearAll = () => {
  notifications.value = [];
  isOpen.value = false;
};

const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

const getVariantClass = (type: string) => {
  switch (type) {
    case 'success': return 'bg-soft-emerald text-emerald';
    case 'warning': return 'bg-soft-amber text-amber';
    case 'error': return 'bg-soft-rose text-rose';
    default: return 'bg-soft-blue text-blue';
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return 'check_circle';
    case 'warning': return 'warning';
    case 'error': return 'error';
    default: return 'info'; // info
  }
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.notifications-container {
  position: relative;
}

.icon-btn {
  position: relative;
  color: $text-secondary;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover, &.active {
    color: $primary-color;
  }

  .material-symbols-outlined {
    font-size: 1.5rem;
    font-weight: 300;
  }

  .notification-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: $status-danger;
    color: white;
    font-size: 0.625rem; // 10px
    font-weight: 700;
    min-width: 1rem;
    height: 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.25rem;
    box-shadow: 0 0 0 2px white; // Ring effect
  }
}

.notification-dropdown {
  position: absolute;
  top: 120%;
  right: -80px; // Adjust slightly to center relative to button if needed, or align right
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid $border-glass;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 60;
  overflow: hidden;
  
  @media (min-width: 640px) {
      right: 0; // Align right edge with button on larger screens if layout permits
  }
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0.75rem;
  border-bottom: 1px solid $border-light;

  h3 {
    font-size: 0.875rem;
    font-weight: 700;
    color: $text-primary;
    margin: 0;
  }

  .clear-btn {
    background: none;
    border: none;
    font-size: 0.75rem;
    color: $text-muted;
    cursor: pointer;
    padding: 0;
    
    &:hover {
      color: $primary-color;
      text-decoration: underline;
    }
  }
}

.notification-list {
  max-height: 360px;
  overflow-y: auto;
  
  // Scrollbar customization
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: $neutral-200;
    border-radius: 4px;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  color: $text-muted;
  
  .icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }
  
  p {
    font-size: 0.875rem;
    margin: 0;
  }
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid rgba($border-light, 0.5);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba($primary-color, 0.04);
  }

  &.unread {
    background: rgba($primary-color, 0.02);
    
    .content .title {
        color: $text-primary; // Darker text for unread
        font-weight: 600;
    }
  }

  .icon-wrapper {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .material-symbols-outlined {
      font-size: 1.125rem;
    }

    // Color variants
    &.bg-soft-blue { background: rgba($status-info, 0.1); }
    &.text-blue { color: $status-info; }
    
    &.bg-soft-emerald { background: rgba($status-success, 0.1); }
    &.text-emerald { color: $status-success; }
    
    &.bg-soft-amber { background: rgba($status-warning, 0.1); }
    &.text-amber { color: $status-warning; }
    
    &.bg-soft-rose { background: rgba($status-danger, 0.1); }
    &.text-rose { color: $status-danger; }
  }

  .content {
    flex: 1;
    min-width: 0; // Fix text overflow

    .title {
      font-size: 0.8125rem;
      font-weight: 500;
      color: $text-primary;
      margin: 0 0 0.125rem;
    }

    .message {
      font-size: 0.75rem;
      color: $text-secondary;
      margin: 0 0 0.25rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .time {
      display: block;
      font-size: 0.625rem;
      color: $text-muted;
    }
  }
}

// Reuse mixins or manual transitions
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
