import { X, RefreshCw, Bug } from 'lucide-react';
import { useDebug, DebugData } from '../contexts/DebugContext';
import { useAppSettings } from '../contexts/AppSettingsContext';

interface DebugPanelProps {
  onRegenerateAll: () => void;
  regenerating: boolean;
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-400 w-24 shrink-0">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white"
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-700 rounded-lg p-3 bg-gray-900/50">
      <h4 className="text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wider">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

export function DebugPanel({ onRegenerateAll, regenerating }: DebugPanelProps) {
  const { t } = useAppSettings();
  const { enabled, toggleEnabled, data, updateData, resetData } = useDebug();

  if (!enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto bg-gray-900 border border-purple-500 rounded-lg shadow-2xl shadow-purple-500/20">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-purple-900/30">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-purple-300">{t('debugPanelTitle')}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={resetData}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title={t('resetTooltip')}
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button
            onClick={toggleEnabled}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title={t('closeDebugTooltip')}
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Regenerate All Button */}
      <div className="p-3 border-b border-gray-700">
        <button
          onClick={onRegenerateAll}
          disabled={regenerating}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
          {regenerating ? t('debugGenerating') : t('regenerateAllDebug')}
        </button>
      </div>

      {/* Data Overrides */}
      <div className="p-3 space-y-3">
        <Section title={t('energySectionTitle')}>
          <NumberInput
            label={t('consumptionLabel')}
            value={data.energy.consumption}
            onChange={(v) => updateData('energy', 'consumption', v)}
          />
          <NumberInput
            label={t('productionLabel')}
            value={data.energy.production}
            onChange={(v) => updateData('energy', 'production', v)}
          />
        </Section>

        <Section title={t('transportSectionTitle')}>
          <NumberInput
            label={t('busesLabel')}
            value={data.transport.bus}
            onChange={(v) => updateData('transport', 'bus', v)}
          />
          <NumberInput
            label={t('metroLabel')}
            value={data.transport.metro}
            onChange={(v) => updateData('transport', 'metro', v)}
          />
          <NumberInput
            label={t('tramsLabel')}
            value={data.transport.tram}
            onChange={(v) => updateData('transport', 'tram', v)}
          />
        </Section>

        <Section title={t('waterSectionTitle')}>
          <NumberInput
            label={t('residentialShortLabel')}
            value={data.water.residential}
            onChange={(v) => updateData('water', 'residential', v)}
          />
          <NumberInput
            label={t('commercialShortLabel')}
            value={data.water.commercial}
            onChange={(v) => updateData('water', 'commercial', v)}
          />
          <NumberInput
            label={t('industrialShortLabel')}
            value={data.water.industrial}
            onChange={(v) => updateData('water', 'industrial', v)}
          />
        </Section>

        <Section title={t('weatherSectionTitle')}>
          <NumberInput
            label={t('tempLabelShort')}
            value={data.weather.temp}
            onChange={(v) => updateData('weather', 'temp', v)}
          />
          <NumberInput
            label={t('windLabelShort')}
            value={data.weather.windSpeed}
            onChange={(v) => updateData('weather', 'windSpeed', v)}
          />
          <NumberInput
            label={t('humidityLabelShort')}
            value={data.weather.humidity}
            onChange={(v) => updateData('weather', 'humidity', v)}
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 w-24 shrink-0">{t('conditionLabelShort')}</label>
            <input
              type="text"
              value={data.weather.condition}
              onChange={(e) => updateData('weather', 'condition', e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white"
            />
          </div>
        </Section>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-500">{t('debugFooter')}</p>
      </div>
    </div>
  );
}
