'use client';

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  ReactNode,
} from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// The inline script in layout.tsx resolves the theme (saved choice, falling
// back to the OS preference) and applies the class before hydration, so the
// document class is the source of truth. This provider reads it as an
// external store and writes to it on toggle.
function subscribeToThemeClass(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains('light')
    ? 'light'
    : 'dark';
}

function getServerTheme(): Theme {
  return 'dark';
}

function applyTheme(next: Theme, options: { persist: boolean }) {
  const root = document.documentElement;

  root.classList.add('theme-transition');
  setTimeout(() => {
    root.classList.remove('theme-transition');
  }, 300);

  if (next === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
  }

  // Persist only explicit choices so first-time visitors keep following
  // their OS preference until they pick a theme themselves.
  if (options.persist) {
    try {
      localStorage.setItem('theme', next);
    } catch {}
  }

  // Update theme-color meta tag for browser UI (Safari address bar, etc.)
  const themeColor = next === 'light' ? '#f3f4f6' : '#111827';
  const existingMeta = document.querySelector('meta[name="theme-color"]');
  if (existingMeta) {
    existingMeta.setAttribute('content', themeColor);
  }
}

function getDesiredTheme(): Theme {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToThemeClass,
    getCurrentTheme,
    getServerTheme
  );

  // Re-assert the resolved theme after mount: if React falls back to full
  // client rendering (e.g. on a hydration mismatch) it recreates <html>
  // with the static className="dark", clobbering the head script's class.
  useEffect(() => {
    const desired = getDesiredTheme();
    if (getCurrentTheme() !== desired) {
      applyTheme(desired, { persist: false });
    }
  }, []);

  // Follow live OS preference changes for visitors without a saved choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem('theme')) return;
      } catch {}
      applyTheme(e.matches ? 'light' : 'dark', { persist: false });
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark', { persist: true });
  };

  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme, { persist: true });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
