import { Car, MapPin, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { useAppSettings } from '../contexts/AppSettingsContext';

export function TrafficWidget() {
  const { t } = useAppSettings();
  const trafficZones = [
    { name: t('almaly'), status: 'heavy', color: 'bg-red-500', incidents: 3 },
    { name: t('bostandyk'), status: 'moderate', color: 'bg-yellow-500', incidents: 1 },
    { name: t('medeu'), status: 'light', color: 'bg-green-500', incidents: 0 },
    { name: t('auezov'), status: 'moderate', color: 'bg-yellow-500', incidents: 2 },
    { name: t('turksib'), status: 'light', color: 'bg-green-500', incidents: 0 },
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'heavy': return t('trafficHeavy');
      case 'moderate': return t('trafficModerate');
      case 'light': return t('trafficLight');
      default: return t('trafficLight');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg">{t('trafficStatusTitle')}</h2>
        <Car className="w-5 h-5 text-gray-500" />
      </div>

      <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">6 {t('activeIncidentsAlert')}</span>
        </div>
        <div className="text-sm text-red-700">
          {t('trafficHeavyAlert')}
        </div>
      </div>

      <div className="space-y-3">
        {trafficZones.map((zone) => (
          <div key={zone.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm">{zone.name}</div>
                <div className="text-xs text-gray-500 capitalize">
                  {getStatusText(zone.status)} {t('trafficLabel')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {zone.incidents > 0 && (
                <span className="text-xs text-gray-500">{zone.incidents} {t('incidentsCount')}</span>
              )}
              <div className={`w-3 h-3 rounded-full ${zone.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl text-green-600">73%</div>
          <div className="text-xs text-gray-500">{t('avgSpeedLabel')}</div>
        </div>
        <div>
          <div className="text-2xl text-blue-600">1.2к</div>
          <div className="text-xs text-gray-500">{t('vehiclesPerMinLabel')}</div>
        </div>
        <div>
          <div className="text-2xl text-orange-600">18мин</div>
          <div className="text-xs text-gray-500">{t('avgCommuteLabel')}</div>
        </div>
      </div>
    </Card>
  );
}
