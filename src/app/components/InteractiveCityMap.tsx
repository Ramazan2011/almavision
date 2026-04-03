import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Card } from './ui/card';
import { useAppSettings } from '../contexts/AppSettingsContext';

interface MapZone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: 'heavy' | 'moderate' | 'light';
  incidents: number;
}

export function InteractiveCityMap() {
  const { t } = useAppSettings();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zones: MapZone[] = [
    { id: '1', name: t('almaly'), x: 150, y: 120, width: 100, height: 80, status: 'heavy', incidents: 3 },
    { id: '2', name: t('turksib'), x: 140, y: 30, width: 120, height: 70, status: 'moderate', incidents: 1 },
    { id: '3', name: t('medeu'), x: 270, y: 100, width: 110, height: 90, status: 'light', incidents: 0 },
    { id: '4', name: t('bostandyk'), x: 20, y: 90, width: 110, height: 100, status: 'moderate', incidents: 2 },
    { id: '5', name: t('auezov'), x: 160, y: 220, width: 100, height: 80, status: 'light', incidents: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'heavy': return '#ef4444';
      case 'moderate': return '#f59e0b';
      case 'light': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusFill = (status: string) => {
    switch (status) {
      case 'heavy': return 'rgba(239, 68, 68, 0.2)';
      case 'moderate': return 'rgba(245, 158, 11, 0.2)';
      case 'light': return 'rgba(16, 185, 129, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'heavy': return t('trafficMapHeavy');
      case 'moderate': return t('trafficMapModerate');
      case 'light': return t('trafficMapLight');
      default: return t('trafficMapLight');
    }
  };

  const selectedZoneData = zones.find(z => z.id === selectedZone);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg">{t('trafficMapTitle')}</h2>
        <Navigation className="w-5 h-5 text-gray-500" />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <svg viewBox="0 0 400 320" className="w-full h-auto">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="320" fill="url(#grid)" />

          {/* Roads */}
          <line x1="0" y1="160" x2="400" y2="160" stroke="#9ca3af" strokeWidth="3" />
          <line x1="200" y1="0" x2="200" y2="320" stroke="#9ca3af" strokeWidth="3" />

          {/* Zones */}
          {zones.map((zone) => (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                fill={getStatusFill(zone.status)}
                stroke={getStatusColor(zone.status)}
                strokeWidth="2"
                rx="4"
                className="cursor-pointer transition-all hover:opacity-80"
                onClick={() => setSelectedZone(zone.id)}
              />
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2}
                textAnchor="middle"
                className="text-xs fill-gray-700 pointer-events-none"
                style={{ fontSize: '10px' }}
              >
                {zone.name}
              </text>
              {zone.incidents > 0 && (
                <circle
                  cx={zone.x + zone.width - 10}
                  cy={zone.y + 10}
                  r="8"
                  fill="#dc2626"
                  className="pointer-events-none"
                />
              )}
              {zone.incidents > 0 && (
                <text
                  x={zone.x + zone.width - 10}
                  y={zone.y + 14}
                  textAnchor="middle"
                  className="fill-white text-xs pointer-events-none"
                  style={{ fontSize: '10px', fontWeight: 'bold' }}
                >
                  {zone.incidents}
                </text>
              )}
            </g>
          ))}

          {/* Traffic cameras/sensors */}
          <circle cx="200" cy="160" r="5" fill="#3b82f6" />
          <circle cx="100" cy="100" r="5" fill="#3b82f6" />
          <circle cx="300" cy="200" r="5" fill="#3b82f6" />
        </svg>
      </div>

      {selectedZoneData && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm mb-1">{selectedZoneData.name}</h3>
              <p className="text-xs text-gray-600 mb-2">
                {t('trafficStatusTitle')}: <span className="capitalize font-medium">{getStatusText(selectedZoneData.status)}</span>
              </p>
              <p className="text-xs text-gray-600">
                {selectedZoneData.incidents > 0
                  ? `${selectedZoneData.incidents} ${t('activeIncidentsAlert')}`
                  : t('noIncidents')}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>{t('trafficMapLight')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span>{t('trafficMapModerate')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span>{t('trafficMapHeavy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span>{t('sensorsLabel')}</span>
        </div>
      </div>
    </Card>
  );
}
