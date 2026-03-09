import { ref, onMounted, watch } from "vue";

const theme = ref<string>("light");

export function useTheme() {
  onMounted(() => {
    // 1. Check local storage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      theme.value = savedTheme;
    } else {
      // 2. Check system preference
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      theme.value = systemDark ? "dark" : "light";
    }
    applyTheme();
  });

  const applyTheme = () => {
    if (theme.value === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark"); // Optional: for Tailwind if used later
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme.value);
  };

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    applyTheme();
  };

  return {
    theme,
    toggleTheme,
  };
}
