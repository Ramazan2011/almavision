export const API_CONFIG = {
  WEATHER_BASE_URL: 'https://api.open-meteo.com/v1',
  AIR_QUALITY_BASE_URL: 'https://air-quality-api.open-meteo.com/v1',
  DEFAULT_LOCATION: {
    lat: 43.2389,
    lon: 76.8897,
    name: 'Almaty (Center)'
  },
  ZONE_COORDINATES: {
    'all': { lat: 43.2389, lon: 76.8897 },
    'almaly': { lat: 43.2389, lon: 76.8897 },
    'bostandyk': { lat: 43.2089, lon: 76.8997 },
    'medeu': { lat: 43.2189, lon: 76.9697 },
    'auezov': { lat: 43.2289, lon: 76.8497 },
    'turksib': { lat: 43.3389, lon: 76.9397 },
    'zhetysu': { lat: 43.2954, lon: 76.9423 },
    'alatau': { lat: 43.2846, lon: 76.8290 },
    'nauryzbai': { lat: 43.1895, lon: 76.7865 },
  }
};

export async function fetchWithHandling<T>(url: string): Promise<T> {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText || response.statusText}`);
    }
    const data = await response.json();
    console.log(`Fetched successfully: ${url.split('?')[0]}`);
    console.log('API Result:', data);
    return data;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}
