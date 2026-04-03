import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';
import { Card } from './ui/card';

interface WeatherPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
}

export function WeatherMap() {
  const weatherPoints: WeatherPoint[] = [
    { id: '1', name: 'North', x: 200, y: 60, temp: 21, condition: 'cloudy' },
    { id: '2', name: 'South', x: 200, y: 260, temp: 24, condition: 'sunny' },
    { id: '3', name: 'East', x: 320, y: 160, temp: 22, condition: 'cloudy' },
    { id: '4', name: 'West', x: 80, y: 160, temp: 19, condition: 'rainy' },
    { id: '5', name: 'Center', x: 200, y: 160, temp: 22, condition: 'cloudy' },
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return Sun;
      case 'rainy': return CloudRain;
      default: return Cloud;
    }
  };

  const getWeatherColor = (condition: string) => {
    switch (condition) {
      case 'sunny': return '#f59e0b';
      case 'rainy': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg">Weather Map</h2>
        <Wind className="w-5 h-5 text-gray-500" />
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
        <svg viewBox="0 0 400 320" className="w-full h-auto">
          {/* Cloud overlay patterns */}
          <defs>
            <radialGradient id="cloudGradient">
              <stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Decorative clouds */}
          <ellipse cx="100" cy="80" rx="60" ry="40" fill="url(#cloudGradient)" />
          <ellipse cx="300" cy="120" rx="70" ry="45" fill="url(#cloudGradient)" />
          <ellipse cx="180" cy="240" rx="55" ry="35" fill="url(#cloudGradient)" />

          {/* Weather points with connections */}
          <line x1="200" y1="60" x2="200" y2="160" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />
          <line x1="200" y1="160" x2="200" y2="260" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />
          <line x1="80" y1="160" x2="200" y2="160" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />
          <line x1="200" y1="160" x2="320" y2="160" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />

          {/* Weather stations */}
          {weatherPoints.map((point) => {
            const Icon = getWeatherIcon(point.condition);
            const color = getWeatherColor(point.condition);
            
            return (
              <g key={point.id}>
                {/* Station marker */}
                <circle cx={point.x} cy={point.y} r="25" fill="white" stroke={color} strokeWidth="2" />
                <circle cx={point.x} cy={point.y} r="20" fill={color} fillOpacity="0.1" />
                
                {/* Temperature text */}
                <text
                  x={point.x}
                  y={point.y + 5}
                  textAnchor="middle"
                  className="text-sm fill-gray-800"
                  style={{ fontSize: '14px', fontWeight: 'bold' }}
                >
                  {point.temp}°
                </text>
                
                {/* Location label */}
                <text
                  x={point.x}
                  y={point.y + 45}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  style={{ fontSize: '11px' }}
                >
                  {point.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: Sun, label: 'Sunny Areas', value: '2', color: 'text-yellow-600' },
          { icon: Cloud, label: 'Cloudy Areas', value: '2', color: 'text-gray-600' },
          { icon: CloudRain, label: 'Rainy Areas', value: '1', color: 'text-blue-600' },
        ].map((item) => (
          <div key={item.label} className="text-center p-2 bg-gray-50 rounded">
            <item.icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
            <div className="text-xs text-gray-600">{item.label}</div>
            <div className="text-sm">{item.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
