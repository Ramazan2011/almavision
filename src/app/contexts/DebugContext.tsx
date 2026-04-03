import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export interface DebugData {
  energy: {
    consumption: number;
    production: number;
  };
  transport: {
    bus: number;
    metro: number;
    tram: number;
  };
  water: {
    residential: number;
    commercial: number;
    industrial: number;
  };
  weather: {
    temp: number;
    condition: string;
    windSpeed: number;
    humidity: number;
  };
}

interface DebugContextType {
  enabled: boolean;
  toggleEnabled: () => void;
  data: DebugData;
  updateData: (section: keyof DebugData, field: string, value: number | string) => void;
  resetData: () => void;
}

const DEFAULT_DATA: DebugData = {
  energy: { consumption: 3270, production: 2800 },
  transport: { bus: 25000, metro: 12000, tram: 6600 },
  water: { residential: 4500, commercial: 3200, industrial: 5100 },
  weather: { temp: 25, condition: 'Clear', windSpeed: 10, humidity: 50 },
};

const DebugContext = createContext<DebugContextType | null>(null);

export function DebugProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [data, setData] = useState<DebugData>({ ...DEFAULT_DATA });

  const toggleEnabled = useCallback(() => setEnabled(prev => !prev), []);
  
  // Fields that should remain strings (not converted to numbers)
  const STRING_FIELDS = new Set(['condition']);

  const updateData = useCallback((section: keyof DebugData, field: string, value: number | string) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: STRING_FIELDS.has(field) ? String(value) : (typeof value === 'number' ? value : Number(value)),
      },
    }));
  }, []);

  const resetData = useCallback(() => setData({ ...DEFAULT_DATA }), []);

  // Expose debug controls to the browser console
  useEffect(() => {
    (window as any).debug = {
      enable: () => setEnabled(true),
      disable: () => setEnabled(false),
      toggle: () => setEnabled(prev => !prev),
      set: (section: string, field: string, value: number | string) => updateData(section as keyof DebugData, field, value),
      reset: () => resetData(),
      help: () => console.log(`
Debug API:
  debug.enable()     - Enable debug mode
  debug.disable()    - Disable debug mode
  debug.toggle()     - Toggle debug mode
  debug.set(section, field, value) - Set a debug value
  debug.reset()      - Reset all debug values to defaults

Sections: energy, transport, water, weather
Fields:
  energy: consumption, production
  transport: bus, metro, tram
  water: residential, commercial, industrial
  weather: temp, condition, windSpeed, humidity
      `),
    };
    console.log('%c🐛 Debug mode available. Type "debug.help()" in console for commands.', 'color: #a855f7; font-weight: bold;');
  }, []);

  return (
    <DebugContext.Provider value={{ enabled, toggleEnabled, data, updateData, resetData }}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const ctx = useContext(DebugContext);
  if (!ctx) throw new Error('useDebug must be used within DebugProvider');
  return ctx;
}
