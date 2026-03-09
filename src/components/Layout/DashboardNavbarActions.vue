<template>
  <div class="top-bar-actions">
    <div class="theme-toggle" @click="toggleTheme" title="Toggle Theme">
      <span class="material-symbols-outlined icon">{{
        theme === "dark" ? "light_mode" : "dark_mode"
      }}</span>
    </div>
    <DashboardNotifications />
    <div class="divider"></div>

    <!-- User Profile Dropdown Trigger -->
    <div class="profile-dropdown-container" ref="dropdownRef">
      <div class="user-profile" @click="toggleDropdown">
        <div class="user-info">
          <p class="name">Alex Rivera</p>
          <p class="role">Systems Architect</p>
        </div>
        <div class="avatar-container">
          <div
            class="avatar"
            style="
              background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuC1c_j5x_JIyLfhV_ukmy1_PFy1q6PAB6VhvMxBxqh8QpoGqV-HFAxhplZIpmT48q2oeuPuW0Qa8sx0T-fS2RQGrn4CisvORDemv3-X09j3fDXyB8CHVX-V2aO_h_n5hDS-WPECk6iOl4hD28Uo0EvXsanr_q9qrgn_RkaAfv9FJGZFcgCW1V5B6L4Vqa0Ez8SiKnNKNHAbx64zFJ9FrIVjRSx5ZtSZJtM-KmdB-B-Yp1LfrZJGns6Sy-LhbfGOV9dlTr3phwqjMNmL&quot;);
            "
          ></div>
        </div>
      </div>

      <!-- Dropdown Menu -->
      <transition name="fade-slide">
        <div v-if="isDropdownOpen" class="dropdown-menu">
          <div
            v-for="(action, index) in collapsedActions"
            :key="index"
            class="dropdown-item"
            :class="{ 'text-danger': action.variant === 'danger' }"
            @click="handleAction(action)"
          >
            <span class="material-symbols-outlined icon">{{
              action.icon
            }}</span>
            <span>{{ action.label }}</span>
          </div>
        </div>
      </transition>
    </div>

    <!-- Modals -->
    <BaseModal
      v-model:visible="showEditProfileModal"
      title="Edit Profile"
      icon="edit"
    >
      <div class="d-flex flex-col gap-4">
        <BaseInput
          label="Full Name"
          v-model="editForm.name"
          placeholder="Enter your name"
        />
        <BaseInput
          label="Role"
          v-model="editForm.role"
          placeholder="Systems Architect"
        />
      </div>
      <template #footer>
        <BaseButton
          variant="secondary"
          block
          @click="showEditProfileModal = false"
          >Cancel</BaseButton
        >
        <BaseButton block @click="saveProfile">Save Changes</BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      v-model:visible="showLogoutModal"
      title="Confirm Logout"
      icon="logout"
      icon-color="red"
      size="sm"
    >
      <p class="text-neutral-600">
        Are you sure you want to log out of your session?
      </p>
      <template #footer>
        <BaseButton variant="ghost" block @click="showLogoutModal = false"
          >Cancel</BaseButton
        >
        <BaseButton variant="danger" block @click="confirmLogout"
          >Logout</BaseButton
        >
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import DashboardNotifications from "@/components/Layout/DashboardNotifications.vue";
import BaseModal from "@/components/Base/BaseModal.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseInput from "@/components/Base/BaseInput.vue";

import { useTheme } from "@/composables/useTheme";

const router = useRouter();
const { theme, toggleTheme } = useTheme();
const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Modal State
const showEditProfileModal = ref(false);
const showLogoutModal = ref(false);

const editForm = reactive({
  name: "Alex Rivera",
  role: "Systems Architect",
});

// Dynamic Actions Configuration
const collapsedActions = [
  {
    label: "Edit Profile",
    icon: "manage_accounts",
    action: () => (showEditProfileModal.value = true),
  },
  {
    label: "Settings",
    icon: "settings",
    action: () => console.log("Settings clicked"),
  },
  {
    label: "Logout",
    icon: "power_settings_new",
    variant: "danger",
    action: () => (showLogoutModal.value = true),
  },
];

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleAction = (item: any) => {
  isDropdownOpen.value = false;
  if (item.action) item.action();
};

const saveProfile = () => {
  // Simulate API call
  console.log("Saving profile:", editForm);
  showEditProfileModal.value = false;
};

const confirmLogout = () => {
  console.log("Logging out...");
  showLogoutModal.value = false;
  router.push("/login");
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

.top-bar-actions {
  display: flex;
  align-items: center;
  gap: 2rem;

  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    color: $text-secondary;

    &:hover {
      background: rgba($neutral-200-rgb, 0.5);
      color: $primary-color;
    }

    .icon {
      font-size: 1.5rem;
    }
  }

  .divider {
    height: 2rem;
    width: 1px;
    background: var(--border-light);
  }

  .profile-dropdown-container {
    position: relative;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    user-select: none;

    &:hover {
      .user-info .name {
        color: $primary-color;
      }
    }

    .user-info {
      text-align: right;
      display: none;

      @media (min-width: 640px) {
        display: block;
      }

      .name {
        font-size: 0.875rem;
        font-weight: 700;
        color: $text-primary;
        letter-spacing: -0.025em;
        margin: 0;
        transition: color 0.2s;
      }

      .role {
        font-size: 0.625rem;
        color: $text-secondary;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 700;
        margin: 0;
      }
    }

    .avatar-container {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 1rem;
      background: var(--surface-glass);
      border: 1px solid var(--border-glass);
      padding: 2px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

      .avatar {
        width: 100%;
        height: 100%;
        border-radius: 14px;
        background-size: cover;
        background-position: center;
      }
    }
  }
}

.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  width: 220px;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-glass);
  border-radius: 1rem;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.15),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 50;

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    color: $text-primary;
    font-weight: 500;
    font-size: 0.875rem;

    .icon {
      font-size: 1.25rem;
      color: $text-secondary;
      transition: color 0.2s;
    }

    &:hover {
      background: rgba($primary-color, 0.08);
      color: $primary-color;

      .icon {
        color: $primary-color;
      }
    }

    &.text-danger {
      color: $status-danger;
      .icon {
        color: $status-danger;
      }

      &:hover {
        background: rgba($status-danger, 0.08);
      }
    }
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
