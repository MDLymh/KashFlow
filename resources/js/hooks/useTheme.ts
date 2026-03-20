import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Detectar el tema actual desde el HTML element
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    const currentTheme: Theme = isDark ? 'dark' : 'light';
    
    // Obtener tema guardado en localStorage o usar el actual
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || currentTheme;
    
    setTheme(initialTheme);
    updateTheme(initialTheme);
  }, []);

  const updateTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    if (theme === null) return;
    
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateTheme(newTheme);
  };

  return { 
    theme: theme || 'light', 
    toggleTheme, 
    mounted: theme !== null 
  };
}
