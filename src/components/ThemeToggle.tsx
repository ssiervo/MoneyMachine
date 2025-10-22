import { Moon, Sun } from 'lucide-react';

import { Button } from './ui/Button';
import { useSettingsStore } from '@/lib/store/settings';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useSettingsStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
  }));

  return (
    <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};
