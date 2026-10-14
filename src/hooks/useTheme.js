import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');

  useEffect(() => {
    const apply = (value) => {
      document.documentElement.dataset.theme = value;
      document.querySelector('meta[name="theme-color"]').content = value === 'dark' ? '#0c0a09' : '#fafaf9';
      setTheme(value);
    };
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      try { if (localStorage.getItem('jessie-theme')) return; } catch {}
      apply(system.matches ? 'dark' : 'light');
    };
    const onStorage = (event) => {
      if (event.key === 'jessie-theme') apply(event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : system.matches ? 'dark' : 'light');
    };
    system.addEventListener('change', onSystemChange);
    window.addEventListener('storage', onStorage);
    return () => {
      system.removeEventListener('change', onSystemChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]').content = next === 'dark' ? '#0c0a09' : '#fafaf9';
    try { localStorage.setItem('jessie-theme', next); } catch {}
    setTheme(next);
  };
  return { theme, toggleTheme };
}
