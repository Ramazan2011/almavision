import React, { useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, Sparkles } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useAppSettings } from '../contexts/AppSettingsContext';

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
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [showTemperature, setShowTemperature] = useState(true);

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

  const { t } = useAppSettings();

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
            className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {showTemperature ? `🌡️ ${t('tempShort')}` : `💧 ${t('humidityShort')}`}
          </button>
          <Wind className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-3 rounded-lg text-center border border-orange-200">
          <div className="text-2xl">{avgTemp}°C</div>
          <div className="text-xs text-gray-600">{t('avgTemp')}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg text-center border border-blue-200">
          <div className="text-2xl">{avgHumidity}%</div>
          <div className="text-xs text-gray-600">{t('avgHumidity')}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg text-center border border-green-200">
          <div className="text-2xl">{weatherPoints.filter(p => p.condition === 'sunny').length}</div>
          <div className="text-xs text-gray-600">{t('sunnyZones')}</div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200 mb-4 bg-gray-100" style={{ height: '320px', zIndex: 0 }}>
        <MapContainer center={[43.2389, 76.8897]} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 10 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
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
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
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
                <div className="bg-white p-2 rounded border">
                  <div className="text-gray-600 flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    {t('tempLabel')}
                  </div>
                  <div className="font-medium">{selectedPointData.temp}°C</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="text-gray-600 flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    {t('humidityLabel')}
                  </div>
                  <div className="font-medium">{selectedPointData.humidity}%</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="text-gray-600 flex items-center gap-1">
                    <Wind className="w-3 h-3" />
                    {t('windLabel')}
                  </div>
                  <div className="font-medium">{selectedPointData.windSpeed} км/ч</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="text-gray-600">{t('pressureLabel')}</div>
                  <div className="font-medium">{selectedPointData.pressure} мб</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 p-3 bg-white rounded border border-purple-200">
            <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-purple-900 mb-1">{t('weatherAIForecast')}</div>
              <p className="text-xs text-gray-700">{selectedPointData.aiInsight}</p>
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
