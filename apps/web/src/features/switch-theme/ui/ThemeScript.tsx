import { THEME_PREFERENCE_STORAGE_KEY } from "@/shared/lib/theme";

/**
 * Инлайн скрипт для установки темы до гидратации React
 * Предотвращает мерцание темы при загрузке страницы
 */
export function ThemeScript() {
  const themeScript = `
    try {
      const theme = JSON.parse(localStorage.getItem('${THEME_PREFERENCE_STORAGE_KEY}'));

      if (theme === "dark" || theme === "light")
        document.documentElement.classList.add(theme);
      else {
        // system или не установлено
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
        document.documentElement.classList.add(systemTheme);
      }
    } catch (e) {
      // Fallback на system theme при ошибке
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      document.documentElement.classList.add(systemTheme);
    }
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
