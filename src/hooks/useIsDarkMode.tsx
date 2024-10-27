import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";

// Hook to determine if dark mode is active based on theme or system preference
// NOTE: don't use this for tailwind classes, use :dark selector instead
export default function useIsDarkMode() {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Function to determine if dark mode is active based on theme or system preference
    const checkDarkMode = () => {
      if (theme === "dark") {
        setIsDarkMode(true);
      } else if (theme === "light") {
        setIsDarkMode(false);
      } else if (theme === "system") {
        const isSystemDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        setIsDarkMode(isSystemDark);
      }
    };

    checkDarkMode();

    // Listen to system theme changes if theme is set to "system"
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return isDarkMode;
}
