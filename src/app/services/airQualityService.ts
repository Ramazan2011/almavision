import { API_CONFIG, fetchWithHandling } from './api';

export interface AirQualityData {
  aqi: number;
  description: string;
}

export async function getAirQualityData(lat = API_CONFIG.DEFAULT_LOCATION.lat, lon = API_CONFIG.DEFAULT_LOCATION.lon): Promise<AirQualityData> {
  const url = `${API_CONFIG.AIR_QUALITY_BASE_URL}/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi`;
  
  const data = await fetchWithHandling<any>(url);
  const aqi = data.current.european_aqi;

  let description = 'Good';
  if (aqi > 80) description = 'Poor';
  else if (aqi > 60) description = 'Moderate';
  else if (aqi > 40) description = 'Fair';

  return {
    aqi,
    description,
  };
}
