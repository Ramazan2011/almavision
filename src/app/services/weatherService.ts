import { API_CONFIG, fetchWithHandling } from './api';

export type WeatherDataType = 'real-time' | 'historical' | 'predicted';

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    windSpeed: number;
    humidity: number;
  };
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
  historical?: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

// Map Open-Meteo weather codes to human readable conditions in Russian
const getCondition = (code: number) => {
  if (code === 0) return 'Ясно';
  if (code <= 3) return 'Переменная облачность';
  if (code >= 45 && code <= 48) return 'Туман';
  if (code >= 51 && code <= 67) return 'Дождь';
  if (code >= 71 && code <= 77) return 'Снег';
  if (code >= 80 && code <= 82) return 'Ливень';
  if (code >= 95) return 'Гроза';
  return 'Пасмурно';
};

const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export async function getWeatherData(
  lat = API_CONFIG.DEFAULT_LOCATION.lat, 
  lon = API_CONFIG.DEFAULT_LOCATION.lon,
  dataType: WeatherDataType = 'real-time'
): Promise<WeatherData> {
  if (dataType === 'historical') {
    return getHistoricalWeather(lat, lon);
  } else if (dataType === 'predicted') {
    return getForecastWeather(lat, lon);
  }
  return getCurrentWeather(lat, lon);
}

async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `${API_CONFIG.WEATHER_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max&timezone=auto`;
  const data = await fetchWithHandling<any>(url);

  return {
    current: {
      temp: Math.round(data.current.temperature_2m),
      condition: getCondition(data.current.weather_code),
      windSpeed: Math.round(data.current.wind_speed_10m),
      humidity: data.current.relative_humidity_2m,
    },
    forecast: data.daily.time.slice(0, 5).map((dateStr: string, index: number) => {
      const date = new Date(dateStr);
      return {
        day: days[date.getDay()],
        temp: Math.round(data.daily.temperature_2m_max[index]),
        condition: getCondition(data.daily.weather_code[index]),
      };
    }),
  };
}

async function getForecastWeather(lat: number, lon: number): Promise<WeatherData> {
  // Fetch 7-day forecast
  const url = `${API_CONFIG.WEATHER_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=auto&forecast_days=7`;
  const data = await fetchWithHandling<any>(url);

  const forecast = data.daily.time.map((dateStr: string, index: number) => {
    const date = new Date(dateStr);
    return {
      day: days[date.getDay()],
      temp: Math.round(data.daily.temperature_2m_max[index]),
      condition: getCondition(data.daily.weather_code[index]),
    };
  });

  // Use first forecast day as "current"
  return {
    current: {
      temp: forecast[0]?.temp || 0,
      condition: forecast[0]?.condition || 'Нет данных',
      windSpeed: Math.round(data.daily.wind_speed_10m_max[0] || 0),
      humidity: 50, // Not available in daily forecast, use estimate
    },
    forecast,
  };
}

async function getHistoricalWeather(lat: number, lon: number): Promise<WeatherData> {
  // Get past 7 days of historical data
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];
  
  const url = `${API_CONFIG.WEATHER_BASE_URL}/archive?latitude=${lat}&longitude=${lon}&start_date=${startStr}&end_date=${endStr}&daily=weather_code,temperature_2m_max,wind_speed_10m_max&timezone=auto`;
  
  try {
    const data = await fetchWithHandling<any>(url);

    const historical = data.daily.time.map((dateStr: string, index: number) => {
      const date = new Date(dateStr);
      return {
        day: days[date.getDay()],
        temp: Math.round(data.daily.temperature_2m_max[index]),
        condition: getCondition(data.daily.weather_code[index]),
      };
    });

    return {
      current: historical[historical.length - 1] || { temp: 0, condition: 'Нет данных', windSpeed: 0, humidity: 0 },
      forecast: [],
      historical,
    };
  } catch {
    // Archive API may not have data for recent dates, fallback to current
    console.warn('Historical weather data unavailable, using current data');
    return getCurrentWeather(lat, lon);
  }
}
