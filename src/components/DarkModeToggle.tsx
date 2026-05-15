import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial: Theme = stored ?? (prefersDark ? 'dark' : 'light');
    setTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
