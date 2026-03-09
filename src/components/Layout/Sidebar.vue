<template>
  <aside class="sidebar glass-panel" :class="{ minimized: store.isMinimized }">
    <div class="sidebar-header">
      <div class="logo-container soft-accent">
        <img src="/logo.svg" alt="NiceUI Logo" />
      </div>
      <div v-show="!store.isMinimized" class="brand-info">
        <h1>NiceUI</h1>
        <p>Core ERP v26</p>
      </div>

      <!-- Minimize Toggle -->
      <button class="minimize-btn" @click="store.toggleMinimize">
        <span class="material-symbols-outlined">{{
          store.isMinimized ? "chevron_right" : "chevron_left"
        }}</span>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="sidebar-search" v-if="!store.isMinimized">
      <div class="search-input-wrapper">
        <span class="material-symbols-outlined icon">search</span>
        <input
          type="text"
          placeholder="Search..."
          v-model="store.searchQuery"
        />
      </div>
    </div>

    <nav class="sidebar-nav">
      <template v-for="(item, index) in store.filteredMenuItems" :key="index">
        <!-- Single Menu Item -->
        <router-link
          v-if="!item.children && item.to"
          :to="item.to"
          class="nav-item"
          active-class="active"
          :title="store.isMinimized ? item.label : ''"
        >
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          <span v-show="!store.isMinimized">
            <template
              v-for="(part, i) in getHighlightedParts(item.label)"
              :key="i"
            >
              <span :class="{ 'text-highlight': part.isMatch }">{{
                part.text
              }}</span>
            </template>
          </span>
        </router-link>

        <a
          v-else-if="!item.children && item.href"
          :href="item.href"
          class="nav-item"
          :title="store.isMinimized ? item.label : ''"
        >
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          <span v-show="!store.isMinimized">
            <template
              v-for="(part, i) in getHighlightedParts(item.label)"
              :key="i"
            >
              <span :class="{ 'text-highlight': part.isMatch }">{{
                part.text
              }}</span>
            </template>
          </span>
        </a>

        <!-- Parent Menu Item with Children -->
        <div v-else-if="item.children" class="nav-group">
          <div
            class="nav-item parent"
            :class="{ expanded: item.isOpen, active: isActive(item) }"
            @click="store.toggleSubmenu(index)"
            :title="store.isMinimized ? item.label : ''"
          >
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined">{{ item.icon }}</span>
              <span v-show="!store.isMinimized">
                <template
                  v-for="(part, i) in getHighlightedParts(item.label)"
                  :key="i"
                >
                  <span :class="{ 'text-highlight': part.isMatch }">{{
                    part.text
                  }}</span>
                </template>
              </span>
            </div>
            <span
              v-show="!store.isMinimized"
              class="material-symbols-outlined chevron"
              :class="{ rotated: item.isOpen }"
            >
              expand_more
            </span>
          </div>

          <!-- Submenu -->
          <div v-show="item.isOpen && !store.isMinimized" class="submenu">
            <template v-for="(child, cIndex) in item.children" :key="cIndex">
              <router-link
                v-if="child.to"
                :to="child.to"
                class="nav-item sub-item"
                active-class="active"
              >
                <span>
                  <template
                    v-for="(part, i) in getHighlightedParts(child.label)"
                    :key="i"
                  >
                    <span :class="{ 'text-highlight': part.isMatch }">{{
                      part.text
                    }}</span>
                  </template>
                </span>
              </router-link>
              <a v-else :href="child.href || '#'" class="nav-item sub-item">
                <span>
                  <template
                    v-for="(part, i) in getHighlightedParts(child.label)"
                    :key="i"
                  >
                    <span :class="{ 'text-highlight': part.isMatch }">{{
                      part.text
                    }}</span>
                  </template>
                </span>
              </a>
            </template>
          </div>
        </div>
      </template>
    </nav>

    <div class="sidebar-footer">
      <a
        href="#"
        class="nav-item"
        :title="store.isMinimized ? 'NiceUI Config' : ''"
      >
        <span class="material-symbols-outlined">blur_on</span>
        <span v-show="!store.isMinimized">NiceUI Config</span>
      </a>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useSidebarStore, type MenuItem } from "@/stores/sidebar";

const route = useRoute();
const store = useSidebarStore();

// Highlight matching text (Securely)
const getHighlightedParts = (
  text: string,
): { text: string; isMatch: boolean }[] => {
  if (!store.searchQuery) return [{ text, isMatch: false }];

  const escapeRegExp = (string: string) => {
    return string.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  };

  const escapedQuery = escapeRegExp(store.searchQuery);
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return parts.filter(Boolean).map((part) => {
    return {
      text: part,
      isMatch: part.toLowerCase() === store.searchQuery.toLowerCase(),
    };
  });
};

// Check if a parent item should be active (if one of its children is active)
const isActive = (item: MenuItem): boolean => {
  if (item.to) {
    return route.path === item.to;
  }
  if (item.children) {
    return item.children.some((child) => child.to && route.path === child.to);
  }
  return false;
};

onMounted(async () => {
  await store.fetchMenuItems();

  // Auto-expand parent if child is active
  store.menuItems.forEach((item: MenuItem, index: number) => {
    if (item.children && isActive(item)) {
      store.setSubmenuState(index, true);
    }
  });
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

// Highlight Style
.text-highlight {
  background: $highlight-bg;
  color: $highlight-text;
  border-radius: 2px;
  padding: 0 2px;
  font-weight: 600;
}

.sidebar {
  width: 260px;
  flex-shrink: 0;
  margin: 1rem;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  z-index: 20;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); // Smooth width transition
  overflow: hidden; // Hide overflow when collapsed
  @include glass-panel;

  &.minimized {
    width: 80px;

    .sidebar-header {
      padding: 1.5rem 0;
      flex-direction: column; // Stack logo and toggle
      gap: 1.5rem;

      .brand-info {
        display: none; // Ensure completely gone
      }

      .minimize-btn {
        margin-left: 0; // Reset auto margin
        width: 2.5rem;
        height: 2.5rem;
        background: $surface-glass-heavy;
        color: $primary-hover;

        &:hover {
          background: $primary-hover;
          color: $text-inverted;
        }
      }
    }

    .sidebar-nav,
    .sidebar-footer {
      padding: 0 0.5rem; // Tighter padding

      .nav-item {
        justify-content: center;
        padding: 0.75rem; // Square shape

        // Hide chevron and text done via v-show, but ensure icon centers
        .material-symbols-outlined {
          margin-right: 0;
          font-size: 1.5rem;
        }
      }
    }
  }
}

.sidebar-header {
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
  position: relative; // Context

  .logo-container {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 1rem; // Keep border radius for consistency if needed, but SVG has its own.
    @include flex-center;
    // background: $primary-gradient; // Removed background as SVG has it
    background: transparent;
    color: $text-inverted;
    // box-shadow: 0 10px 15px -3px rgba($primary-color, 0.2); // Keep shadow? Maybe.
    flex-shrink: 0;

    cursor: default;

    img {
      width: 100%;
      height: 100%;
      border-radius: 1rem; // Match container
      object-fit: cover;
    }
  }

  .brand-info {
    display: flex;
    flex-direction: column;
    white-space: nowrap; // Prevent text wrap during transition
    overflow: hidden; // Ensure it clips during transition
    flex: 1; // Take available space

    h1 {
      color: $text-primary;
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: -0.05em;
      line-height: 1;
      margin: 0;
    }

    p {
      color: $text-secondary;
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 0.25rem;
      font-weight: 600;
    }
  }

  .minimize-btn {
    margin-left: auto; // Push to right
    width: 2rem;
    height: 2rem;
    border-radius: 0.75rem;
    border: 1px solid $border-glass;
    background: $surface-glass;
    color: $text-secondary;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    // Hover state
    &:hover {
      background: $surface-white;
      color: $primary-color;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .material-symbols-outlined {
      font-size: 1.25rem;
    }
  }
}

.sidebar-search {
  padding: 0 1rem 1rem 1rem;

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: $surface-glass;
    border: 1px solid $border-glass;
    border-radius: 0.75rem;
    padding: 0.5rem 0.75rem;
    transition: all 0.2s;

    &:focus-within {
      background: $surface-glass-heavy;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
    }

    .icon {
      font-size: 1.25rem;
      color: $text-muted;
      margin-right: 0.5rem;
      flex-shrink: 0;
    }

    input {
      width: 100%;
      background: none;
      border: none;
      outline: none;
      font-size: 0.875rem;
      color: $text-primary;

      &::placeholder {
        color: $text-muted;
      }
    }
  }
}

.sidebar-nav {
  flex: 1;
  padding: 0 1rem;
  overflow-y: auto;
  overflow-x: hidden; // Prevent horizontal scroll
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  // General Nav Item Style
  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    color: $text-secondary;
    text-decoration: none;
    transition: all 0.2s;
    cursor: pointer;
    white-space: nowrap;

    .material-symbols-outlined {
      font-weight: 300;
      font-size: 1.5rem;
      transition: color 0.2s;
      flex-shrink: 0;
    }

    span:last-child {
      font-size: 0.875rem;
      letter-spacing: 0.025em;
      font-weight: 400; // Reset font weight
    }

    &:hover {
      color: $text-primary;
      background: $surface-glass;
    }

    &.active {
      background: $surface-glass-heavy;
      border-left: 3px solid $primary-color;
      box-shadow: 0 2px 12px rgba(0, 85, 255, 0.08); // Keep specific shadow or use var if created
      color: $text-primary;

      .material-symbols-outlined {
        color: $primary-hover;
        font-weight: 500;
      }

      span:last-child {
        font-weight: 600;
      }
    }
  }

  // Parent Item Specifics
  .nav-item.parent {
    justify-content: space-between;

    .chevron {
      font-size: 1.25rem;
      transition: transform 0.3s;

      &.rotated {
        transform: rotate(180deg);
      }
    }

    &.expanded {
      background: $surface-glass;
      color: $text-primary;
    }
    &.active {
      background: $surface-glass-heavy;
      border-left: 3px solid $primary-color;
      box-shadow: 0 2px 12px rgba(0, 85, 255, 0.08);
      color: $text-primary;

      .material-symbols-outlined {
        color: $primary-hover;
        font-weight: 500;
      }

      span:last-child {
        font-weight: 600;
      }
    }
  }

  // Submenu Container
  .submenu {
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 0.25rem;

    .nav-item.sub-item {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;

      &::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: $neutral-300;
        margin-right: 0.5rem;
      }

      &.active {
        &::before {
          background: $primary-hover;
        }
      }
    }
  }
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba($neutral-200, 0.3);

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    color: $text-secondary;
    text-decoration: none;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover {
      color: $text-primary;
    }

    span.material-symbols-outlined {
      font-weight: 300;
      flex-shrink: 0;
    }

    span:last-child {
      font-size: 0.875rem;
      letter-spacing: 0.025em;
    }
  }
}

.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.gap-3 {
  gap: 0.75rem;
}
</style>
