'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon, Monitor } from '@phosphor-icons/react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'light') {
      return <Sun size={20} weight="regular" />;
    } else if (theme === 'dark') {
      return <Moon size={20} weight="regular" />;
    } else {
      return <Monitor size={20} weight="regular" />;
    }
  };

  const getLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System';
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm text-zinc-700 dark:text-zinc-300"
      title={`Current: ${getLabel()}. Click to switch theme`}
      aria-label={`Switch theme (current: ${getLabel()})`}
    >
      {getIcon()}
      <span className="font-medium hidden sm:inline">{getLabel()}</span>
    </button>
  );
}
