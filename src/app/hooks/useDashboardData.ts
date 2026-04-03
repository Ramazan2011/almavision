import { useState, useEffect } from 'react';
import { getWeatherData, WeatherData } from '../services/weatherService';
import { getAirQualityData, AirQualityData } from '../services/airQualityService';
import { FilterState } from '../components/AdvancedFiltering';
import { API_CONFIG } from '../services/api';
import { getSimulatedData, TransportData, EnergyData, WaterData } from '../services/simulationService';

export interface DashboardData {
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  transport: TransportData[];
  energy: EnergyData[];
  water: WaterData[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData(filters: FilterState) {
  const [data, setData] = useState<DashboardData>({
    weather: null,
    airQuality: null,
    transport: [],
    energy: [],
    water: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchAllData() {
      setData(prev => ({ ...prev, loading: true }));
      try {
        const coords = (API_CONFIG as any).ZONE_COORDINATES?.[filters.zone] || API_CONFIG.DEFAULT_LOCATION;
        
        const [weather, airQuality] = await Promise.all([
          getWeatherData(coords.lat, coords.lon, filters.dataType as 'real-time' | 'historical' | 'predicted'),
          getAirQualityData(coords.lat, coords.lon),
        ]);

        // Get simulated data with data type modifier
        const simulatedData = getSimulatedData(filters.dateRange, filters.dataType as 'real-time' | 'historical' | 'predicted');

        // For predicted data, also fetch weather forecast
        let weatherData = weather;
        if (filters.dataType === 'predicted') {
          // Weather already has forecast from Open-Meteo, use it
          weatherData = weather;
        }

        setData({
          weather: weatherData,
          airQuality,
          transport: simulatedData.transport,
          energy: simulatedData.energy,
          water: simulatedData.water,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch dashboard data. Please try again later.',
        }));
      }
    }

    fetchAllData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [filters.zone, filters.dateRange, filters.dataType]); // Re-fetch when zone, date range, or data type changes

  return data;
}
