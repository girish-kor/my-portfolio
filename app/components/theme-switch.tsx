import React from 'react';
import { Switch } from './ui/switch';

interface ThemeSwitchProps {
  className?: string;
}

export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const [enabled, setEnabled] = React.useState(false);

  // Optional: Apply theme change to document body
  React.useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
