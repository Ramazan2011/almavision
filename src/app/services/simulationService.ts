type DateRange = '1h' | '24h' | '7d' | '30d' | '3m' | '1y' | 'custom' | string;

export interface TransportData {
  id: number;
  label: string;
  bus: number;
  metro: number;
  tram: number;
}

export interface EnergyData {
  id: number;
  label: string;
  consumption: number;
  production: number;
}

export interface WaterData {
  id: number;
  label: string;
  residential: number;
  commercial: number;
  industrial: number;
}

export type DataType = 'real-time' | 'historical' | 'predicted';

// Generate realistic looking periodic data
export function getSimulatedData(range: DateRange, dataType: DataType = 'real-time') {
  let count = 7;
  let labels: string[] = [];
  
  const now = new Date();
  
  if (range === '1h') {
    count = 6;
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 10 * 60000);
      labels.push(`${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`);
    }
  } else if (range === '24h') {
    count = 12;
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 2 * 3600000);
      labels.push(`${d.getHours()}:00`);
    }
  } else if (range === '7d' || range === 'custom') {
    count = 7;
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      labels.push(d.toLocaleDateString('ru-RU', { weekday: 'short' }));
    }
  } else if (range === '30d') {
    count = 15;
    for (let i = 14; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 2 * 86400000);
      labels.push(`${d.getDate()}/${d.getMonth()+1}`);
    }
  } else if (range === '3m') {
    count = 12;
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 7 * 86400000);
      labels.push(`W${Math.floor((d.getDate() - 1) / 7) + 1} ${d.toLocaleDateString('ru-RU', { month: 'short'})}`);
    }
  } else if (range === '1y') {
    count = 12;
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(d.toLocaleDateString('ru-RU', { month: 'short' }));
    }
  }

  // Base values for Almaty size simulation scaling
  const timeScale = range === '1h' ? 0.05 :
                    range === '24h' ? 0.2 :
                    range === '7d' || range === 'custom' ? 1.0 :
                    range === '30d' ? 4 :
                    range === '3m' ? 12 :
                    range === '1y' ? 50 : 1;

  const transport: TransportData[] = [];
  const energy: EnergyData[] = [];
  const water: WaterData[] = [];

  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random fluctuation based on index and characters of label
    const charSum = labels[i]?.split('').reduce((sun, c) => sun + c.charCodeAt(0), 0) || i;
    const preSeeded = (charSum * 13 + i * 7) % 20; // returns 0-19
    const variance = 0.9 + (preSeeded / 100); // 0.9 to 1.09

    // Apply data type modifiers
    let typeModifier = 1;
    let labelPrefix = '';
    if (dataType === 'historical') {
      // Historical: values increase gradually from past to present (85% to 100%)
      typeModifier = 0.85 + (i / count) * 0.15;
      labelPrefix = '';
    } else if (dataType === 'predicted') {
      // Predicted: values increase with growing uncertainty (100% to 115%)
      typeModifier = 1 + (i / count) * 0.15;
      labelPrefix = 'Прогноз: ';
    }

    // Create actual label based on data type
    let actualLabel: string;
    if (dataType === 'historical') {
      actualLabel = labels[i]; // Past dates stay as-is
    } else if (dataType === 'predicted') {
      actualLabel = labels[i]; // Future dates
    } else {
      actualLabel = labels[i];
    }

    transport.push({
      id: i,
      label: labelPrefix + actualLabel,
      bus: Math.floor(40000 * timeScale * variance * typeModifier),
      metro: Math.floor(55000 * timeScale * variance * typeModifier),
      tram: Math.floor(25000 * timeScale * variance * typeModifier),
    });

    energy.push({
      id: i,
      label: labelPrefix + actualLabel,
      consumption: Math.floor(3000 * timeScale * variance * typeModifier),
      production: Math.floor(2800 * timeScale * (variance * 1.05) * typeModifier),
    });

    water.push({
      id: i,
      label: labelPrefix + actualLabel,
      residential: Math.floor(45000 * timeScale * variance * typeModifier),
      commercial: Math.floor(28000 * timeScale * variance * typeModifier),
      industrial: Math.floor(35000 * timeScale * variance * typeModifier),
    });
  }

  return { transport, energy, water };
}
