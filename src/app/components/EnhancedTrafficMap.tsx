import React, { useState } from 'react';
import { MapPin, Navigation, Sparkles } from 'lucide-react';
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

interface MapZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'heavy' | 'moderate' | 'light';
  incidents: number;
  avgSpeed: number;
  vehicles: number;
  aiInsight: string;
}

export function EnhancedTrafficMap() {
  const { t } = useAppSettings();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zones: MapZone[] = [
    {
      id: 'almaly', name: t('almaly'),
      lat: 43.2389, lng: 76.8897,
      status: 'heavy', incidents: 3, avgSpeed: 15, vehicles: 2450,
      aiInsight: t('trafficMapHeavy') + ' ' + t('aiAnalysisBadge')
    },
    {
      id: 'turksib', name: t('turksib'),
      lat: 43.3389, lng: 76.9397,
      status: 'moderate', incidents: 1, avgSpeed: 35, vehicles: 1230,
      aiInsight: t('trafficMapModerate') + ' ' + t('aiAnalysisBadge')
    },
    {
      id: 'medeu', name: t('medeu'),
      lat: 43.2189, lng: 76.9697,
      status: 'light', incidents: 0, avgSpeed: 55, vehicles: 680,
      aiInsight: t('trafficMapLight') + ' ' + t('aiAnalysisBadge')
    },
    {
      id: 'bostandyk', name: t('bostandyk'),
      lat: 43.2089, lng: 76.8997,
      status: 'moderate', incidents: 2, avgSpeed: 28, vehicles: 1560,
      aiInsight: t('trafficMapModerate') + ' ' + t('aiAnalysisBadge')
    },
    {
      id: 'auezov', name: t('auezov'),
      lat: 43.2289, lng: 76.8497,
      status: 'light', incidents: 0, avgSpeed: 48, vehicles: 890,
      aiInsight: t('trafficMapLight') + ' ' + t('aiAnalysisBadge')
    },
    {
      id: 'alatau', name: t('alatau'),
      lat: 43.2846, lng: 76.8290,
      status: 'light', incidents: 0, avgSpeed: 45, vehicles: 920,
      aiInsight: t('trafficMapLight') + ' ' + t('aiAnalysisBadge')
    },
    {
      id: 'nauryzbai', name: t('nauryzbai'),
      lat: 43.1895, lng: 76.7865,
      status: 'light', incidents: 0, avgSpeed: 40, vehicles: 500,
      aiInsight: t('trafficMapLight') + ' ' + t('aiAnalysisBadge')
    },
    {
      id: 'zhetysu', name: t('zhetysu'),
      lat: 43.2954, lng: 76.9423,
      status: 'moderate', incidents: 1, avgSpeed: 30, vehicles: 1100,
      aiInsight: t('trafficMapModerate') + ' ' + t('aiAnalysisBadge')
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'heavy': return '#ef4444';
      case 'moderate': return '#f59e0b';
      case 'light': return '#10b981';
      default: return '#6b7280';
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
  const totalIncidents = zones.reduce((sum, z) => sum + z.incidents, 0);
  const avgCitySpeed = Math.round(zones.reduce((sum, z) => sum + z.avgSpeed, 0) / zones.length);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg">{t('trafficMapTitle')}</h2>
          <Badge variant="outline" className="text-xs">
            {t('interactiveBadge')}
          </Badge>
        </div>
        <Navigation className="w-5 h-5 text-gray-500" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-2xl">{totalIncidents}</div>
          <div className="text-xs text-gray-600">{t('activeIncidentsLabel')}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-2xl">{avgCitySpeed} км/ч</div>
          <div className="text-xs text-gray-600">{t('avgSpeedCity')}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-2xl">{zones.filter(z => z.status === 'heavy').length}</div>
          <div className="text-xs text-gray-600">{t('congestionZones')}</div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200 mb-4 bg-gray-100" style={{ height: '320px', zIndex: 0 }}>
        <MapContainer center={[43.2389, 76.8897]} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 10 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {zones.map((zone) => (
            <React.Fragment key={zone.id}>
              <Circle
                center={[zone.lat, zone.lng]}
                pathOptions={{
                  color: getStatusColor(zone.status),
                  fillColor: getStatusColor(zone.status),
                  fillOpacity: 0.3
                }}
                radius={2500}
              />
              <Marker
                position={[zone.lat, zone.lng]}
                eventHandlers={{
                  click: () => {
                    setSelectedZone(zone.id);
                  },
                }}
              >
                <Popup>
                  <div className="font-semibold text-sm">{zone.name}</div>
                  <div className="text-xs text-gray-600">{t('speedLabel')}: {zone.avgSpeed} km/h</div>
                  <div className="text-xs text-gray-600">{t('incidentsLabel')}: {zone.incidents}</div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {selectedZoneData && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3 mb-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm mb-1 flex items-center gap-2">
                {selectedZoneData.name}
                <Badge
                  variant={selectedZoneData.status === 'heavy' ? 'destructive' : 'outline'}
                  className="text-xs capitalize"
                >
                  {getStatusText(selectedZoneData.status)}
                </Badge>
              </h3>
              <div className="grid grid-cols-3 gap-3 my-2 text-xs">
                <div>
                  <div className="text-gray-600">{t('speedLabel')}</div>
                  <div className="font-medium">{selectedZoneData.avgSpeed} км/ч</div>
                </div>
                <div>
                  <div className="text-gray-600">{t('vehiclesLabel')}</div>
                  <div className="font-medium">{selectedZoneData.vehicles.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">{t('incidentsLabel')}</div>
                  <div className="font-medium">{selectedZoneData.incidents}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 p-3 bg-white rounded border border-purple-200">
            <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-purple-900 mb-1">{t('aiAnalysisBadge')}</div>
              <p className="text-xs text-gray-700">{selectedZoneData.aiInsight}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
          <span>{t('trafficMapLight')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
          <span>{t('trafficMapModerate')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
          <span>{t('trafficMapHeavy')}</span>
        </div>
      </div>
    </Card>
  );
}
