import React, { useState, useRef, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, Sparkles, Wand2, Clock, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { generateChartInsight } from '../services/llmService';
import { getCooldownSeconds, useCooldownState } from '../services/cooldownService';

// Component to update tile layer based on theme
function DarkModeTileLayer() {
  const map = useMap();
  const { settings } = useAppSettings();
  const isDark = settings.theme === 'dark';
  
  useEffect(() => {
    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    
    // Add appropriate tile layer
    const url = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';
    
    L.tileLayer(url, { attribution }).addTo(map);
  }, [isDark, map]);
  
  return null;
}

// Fix for default Leaflet icon paths in Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WeatherPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  humidity: number;
  windSpeed: number;
  pressure: number;
  aiInsight: string;
}

export function EnhancedWeatherMap() {
  const { t } = useAppSettings();
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [showTemperature, setShowTemperature] = useState(true);
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const keyRef = useRef(0);

  useEffect(() => {
    const { subscribe } = useCooldownState();
    return subscribe((seconds) => setCooldownLeft(seconds));
  }, []);

  const handleGenerateAI = () => {
    if (aiLoading || getCooldownSeconds() > 0 || !selectedPointData) return;
    keyRef.current++;
    const currentKey = keyRef.current;
    setAiLoading(true);
    setAiInsight('');
    setAiGenerated(true);

    const dataSummary = `Zone: ${selectedPointData.name}, Temp: ${selectedPointData.temp}°C, Condition: ${selectedPointData.condition}, Humidity: ${selectedPointData.humidity}%, Wind: ${selectedPointData.windSpeed} km/h, Pressure: ${selectedPointData.pressure} mb`;

    generateChartInsight(
      { chartType: 'Weather Zone Analysis', dataSummary, prompt: '' },
      {
        onChunk: (text: string) => { if (keyRef.current === currentKey) setAiInsight((prev: string) => prev + text); },
        onComplete: () => { if (keyRef.current === currentKey) setAiLoading(false); },
        onError: () => { if (keyRef.current === currentKey) { setAiInsight(t('aiError')); setAiLoading(false); } }
      }
    ).then(result => {
      if (keyRef.current === currentKey && aiInsight === '') {
        setAiInsight(result);
        setAiLoading(false);
      }
    });
  };

  const weatherPoints: WeatherPoint[] = [
    {
      id: 'almaly', name: 'Алмалинский',
      lat: 43.2389, lng: 76.8897,
      temp: 22, condition: 'cloudy', humidity: 63, windSpeed: 11, pressure: 1013,
      aiInsight: 'Стабильные условия в центре города.'
    },
    {
      id: 'turksib', name: 'Турксибский',
      lat: 43.3389, lng: 76.9397,
      temp: 21, condition: 'cloudy', humidity: 68, windSpeed: 15, pressure: 1013,
      aiInsight: 'Облачность на севере. Готовьтесь к дождю.'
    },
    {
      id: 'medeu', name: 'Медеуский',
      lat: 43.2189, lng: 76.9697,
      temp: 20, condition: 'cloudy', humidity: 65, windSpeed: 14, pressure: 1011,
      aiInsight: 'Близость к горам вызывает ветровой охлаждение.'
    },
    {
      id: 'bostandyk', name: 'Бостандыкский',
      lat: 43.2089, lng: 76.8997,
      temp: 23, condition: 'sunny', humidity: 52, windSpeed: 8, pressure: 1015,
      aiInsight: 'Идеальная погода у подножия гор. УФ-индекс умеренный.'
    },
    {
      id: 'auezov', name: 'Ауэзовский',
      lat: 43.2289, lng: 76.8497,
      temp: 22, condition: 'sunny', humidity: 55, windSpeed: 9, pressure: 1014,
      aiInsight: 'Ясное небо ожидается весь день.'
    },
    {
      id: 'alatau', name: 'Алатауский',
      lat: 43.2846, lng: 76.8290,
      temp: 21, condition: 'rainy', humidity: 75, windSpeed: 18, pressure: 1010,
      aiInsight: 'Дождь в северо-западной промзоне.'
    },
    {
      id: 'nauryzbai', name: 'Наурызбайский',
      lat: 43.1895, lng: 76.7865,
      temp: 24, condition: 'sunny', humidity: 50, windSpeed: 7, pressure: 1015,
      aiInsight: 'Тепло и сухо в западных пригородах.'
    },
    {
      id: 'zhetysu', name: 'Жетысуский',
      lat: 43.2954, lng: 76.9423,
      temp: 21, condition: 'cloudy', humidity: 66, windSpeed: 13, pressure: 1013,
      aiInsight: 'Переменная облачность, хорошая видимость.'
    },
  ];

  const getWeatherColor = (condition: string) => {
    switch (condition) {
      case 'sunny': return '#f59e0b';
      case 'rainy': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getTempColor = (temp: number) => {
    if (temp >= 25) return '#ef4444';
    if (temp >= 20) return '#f59e0b';
    if (temp >= 15) return '#10b981';
    return '#3b82f6';
  };

  const selectedPointData = weatherPoints.find(p => p.id === selectedPoint);
  const avgTemp = Math.round(weatherPoints.reduce((sum, p) => sum + p.temp, 0) / weatherPoints.length);
  const avgHumidity = Math.round(weatherPoints.reduce((sum, p) => sum + p.humidity, 0) / weatherPoints.length);

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'sunny': return t('sunny');
      case 'rainy': return t('rainy');
      default: return t('cloudy');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg">{t('weatherMapTitle')}</h2>
          <Badge variant="outline" className="text-xs">
            {t('interactiveBadge')}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTemperature(!showTemperature)}
            className="text-xs px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {showTemperature ? `🌡️ ${t('tempShort')}` : `💧 ${t('humidityShort')}`}
          </button>
          <Wind className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-800 p-3 rounded-lg text-center border border-orange-200 dark:border-orange-900">
          <div className="text-2xl">{avgTemp}°C</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{t('avgTemp')}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 p-3 rounded-lg text-center border border-blue-200 dark:border-blue-900">
          <div className="text-2xl">{avgHumidity}%</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{t('avgHumidity')}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 p-3 rounded-lg text-center border border-green-200 dark:border-green-900">
          <div className="text-2xl">{weatherPoints.filter(p => p.condition === 'sunny').length}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{t('sunnyZones')}</div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-4 bg-gray-100 dark:bg-gray-800" style={{ height: '320px', zIndex: 0 }}>
        <MapContainer center={[43.2389, 76.8897]} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 10 }}>
          <DarkModeTileLayer />
          
          {weatherPoints.map((point) => (
            <React.Fragment key={point.id}>
              <Circle
                center={[point.lat, point.lng]}
                pathOptions={{ 
                  color: showTemperature ? getTempColor(point.temp) : '#3b82f6', 
                  fillColor: showTemperature ? getTempColor(point.temp) : '#3b82f6',
                  fillOpacity: showTemperature ? 0.3 : (point.humidity / 100) * 0.6
                }}
                radius={2500}
              />
              <Marker 
                position={[point.lat, point.lng]}
                eventHandlers={{
                  click: () => setSelectedPoint(point.id),
                }}
              >
                <Popup>
                  <div className="font-semibold text-sm">{point.name}</div>
                  <div className="text-xs text-gray-600 mt-1 capitalize">{point.condition}</div>
                  <div className="text-xs text-gray-600">Temp: {point.temp}°C</div>
                  <div className="text-xs text-gray-600">Humidity: {point.humidity}%</div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {selectedPointData && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-lg border border-blue-200 dark:border-gray-700">
          <div className="flex items-start gap-3 mb-3">
            <Thermometer className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm mb-2 flex items-center gap-2">
                {selectedPointData.name}
                <Badge
                  variant="outline"
                  className="text-xs capitalize"
                >
                  {getConditionText(selectedPointData.condition)}
                </Badge>
              </h3>
              <div className="grid grid-cols-4 gap-2 my-2 text-xs">
                <div className="bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-700">
                  <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    {t('tempLabel')}
                  </div>
                  <div className="font-medium dark:text-gray-200">{selectedPointData.temp}°C</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-700">
                  <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    {t('humidityLabel')}
                  </div>
                  <div className="font-medium dark:text-gray-200">{selectedPointData.humidity}%</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-700">
                  <div className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Wind className="w-3 h-3" />
                    {t('windLabel')}
                  </div>
                  <div className="font-medium dark:text-gray-200">{selectedPointData.windSpeed} км/ч</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-700">
                  <div className="text-gray-600 dark:text-gray-400">{t('pressureLabel')}</div>
                  <div className="font-medium dark:text-gray-200">{selectedPointData.pressure} мб</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 p-3 bg-white dark:bg-gray-800 rounded border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-medium text-purple-900 dark:text-purple-300 mb-1 flex items-center gap-1">
                {t('weatherAIForecast')}
                {aiLoading && <Loader2 className="w-3 h-3 animate-spin" />}
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 min-h-[2rem]">
                {aiInsight || selectedPointData.aiInsight}
                {aiLoading && <span className="inline-block w-0.5 h-3 bg-purple-500 ml-0.5 animate-pulse" />}
              </p>
              {!aiGenerated ? (
                <button
                  onClick={handleGenerateAI}
                  disabled={getCooldownSeconds() > 0}
                  className="mt-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 className="w-3 h-3" /> {t('generateAIInsight')}
                </button>
              ) : cooldownLeft > 0 ? (
                <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {t('rateLimitedTryAgain')} {cooldownLeft}{t('secondsSuffix')}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs flex-wrap">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-yellow-500" />
          <span>{t('sunny')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-gray-500" />
          <span>{t('cloudy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-blue-500" />
          <span>{t('rainy')}</span>
        </div>
      </div>
    </Card>
  );
}
