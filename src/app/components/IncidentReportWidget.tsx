import { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, FileText, Clock, X, Plus, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useAppSettings } from '../contexts/AppSettingsContext';

export interface Incident {
  id: string;
  type: string;
  location: string;
  description: string;
  timestamp: number;
  status: 'reported' | 'in-progress' | 'resolved';
}

const INCIDENT_TYPES = ['incidentTraffic', 'incidentPower', 'incidentWater', 'incidentRoad', 'incidentOther'] as const;

export function IncidentReportWidget() {
  const { t } = useAppSettings();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{ type: typeof INCIDENT_TYPES[number]; location: string; description: string }>({ type: INCIDENT_TYPES[0], location: '', description: '' });

  // Load incidents from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cityIncidents');
      if (saved) setIncidents(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Save incidents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cityIncidents', JSON.stringify(incidents));
    } catch { /* ignore */ }
  }, [incidents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location.trim() || !formData.description.trim()) return;

    const newIncident: Incident = {
      id: Date.now().toString(),
      type: formData.type,
      location: formData.location,
      description: formData.description,
      timestamp: Date.now(),
      status: 'reported',
    };

    setIncidents(prev => [newIncident, ...prev]);
    setFormData({ type: INCIDENT_TYPES[0], location: '', description: '' });
    setShowForm(false);
  };

  const deleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'reported': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  return (
    <Card className="p-6 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg dark:text-gray-200">{t('incidentReport')}</h2>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4 mr-1" />
          {showForm ? t('hideAdvanced') : t('incidentReport')}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">{t('incidentType')}</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as typeof INCIDENT_TYPES[number] }))}
              className="w-full h-9 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200"
            >
              {INCIDENT_TYPES.map(type => (
                <option key={type} value={type}>{t(type)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">{t('incidentLocation')}</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder={t('incidentLocation')}
                className="w-full h-9 pl-9 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">{t('incidentDescription')}</label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('incidentDescription')}
                rows={3}
                className="w-full pl-9 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 resize-none"
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
            {t('incidentSubmit')}
          </Button>
        </form>
      )}

      {/* Incidents Log */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {incidents.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">{t('noIncidents')}</p>
        ) : (
          incidents.map(incident => (
            <div key={incident.id} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium dark:text-gray-200">{t(incident.type as any)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{incident.location}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{incident.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(incident.timestamp)}
                </div>
              </div>
              <button onClick={() => deleteIncident(incident.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded shrink-0">
                <Trash2 className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
