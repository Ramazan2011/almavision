import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Language, t as translate } from '../i18n/translations';

type Theme = 'light' | 'dark';
type RefreshInterval = 60 | 300 | 900; // 1min, 5min, 15min

interface AppSettings {
  language: Language;
  theme: Theme;
  refreshInterval: RefreshInterval;
}

interface AppSettingsContextType {
  settings: AppSettings;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setRefreshInterval: (interval: RefreshInterval) => void;
  t: (key: Parameters<typeof translate>[1]) => string;
}

const defaultSettings: AppSettings = {
  language: 'ru',
  theme: 'light',
  refreshInterval: 300, // 5 minutes default
};

const AppSettingsContext = createContext<AppSettingsContextType | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load from localStorage
    try {
      const saved = localStorage.getItem('appSettings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore errors
    }
    return defaultSettings;
  });

  // Save to localStorage when settings change
  useEffect(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      // Apply theme to document
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    } catch {
      // Ignore errors
    }
  }, [settings]);

  const setLanguage = useCallback((language: Language) => {
    setSettings(prev => ({ ...prev, language }));
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  }, []);

  const setRefreshInterval = useCallback((refreshInterval: RefreshInterval) => {
    setSettings(prev => ({ ...prev, refreshInterval }));
  }, []);

  const t = useCallback((key: Parameters<typeof translate>[1]) => {
    return translate(settings.language, key);
  }, [settings.language]);

  return (
    <AppSettingsContext.Provider value={{ settings, setLanguage, setTheme, setRefreshInterval, t }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
}
