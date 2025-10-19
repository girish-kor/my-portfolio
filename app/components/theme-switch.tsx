import React from 'react';
import { Switch } from './ui/switch';

interface ThemeSwitchProps {
  className?: string;
}

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const [enabled, setEnabled] = React.useState<boolean>(false);

  // On mount: restore saved preference (if any) and apply theme
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem('theme-dark');
      if (saved !== null) {
        const isDark = saved === 'true';
        setEnabled(isDark);
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (e) {
      // ignore localStorage errors (privacy modes)
    }
  }, []);

  // When enabled changes: apply theme and persist choice
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      localStorage.setItem('theme-dark', String(enabled));
    } catch (e) {
      // ignore storage write errors
    }
  }, [enabled]);

  return (
    <Switch
      checked={enabled}
      onCheckedChange={(checked: boolean) => setEnabled(checked)}
      className={className}
    />
  );
}
