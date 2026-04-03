import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sparkles, Loader2, Wand2, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { EnergyData } from '../services/simulationService';
import { generateChartInsight } from '../services/llmService';
import { getCooldownSeconds, useCooldownState } from '../services/cooldownService';
import { useAppSettings } from '../contexts/AppSettingsContext';

const DEFAULT_INSIGHT_KEY = 'energyDefaultInsight';

interface EnergyChartProps {
  data: EnergyData[];
}

function EnergyAIInsight({ data }: { data: EnergyData[] }) {
  const { t } = useAppSettings();
  const [insight, setInsight] = useState(t('energyDefaultInsight'));
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const keyRef = useRef(0);

  useEffect(() => {
    const { subscribe } = useCooldownState();
    return subscribe((seconds) => setCooldownLeft(seconds));
  }, []);

  const handleGenerate = () => {
    if (loading || getCooldownSeconds() > 0) return;
    keyRef.current++;
    const currentKey = keyRef.current;
    setLoading(true);
    setInsight('');
    setGenerated(true);

    const dataSummary = `Latest consumption: ${data[data.length - 1]?.consumption ?? 'N/A'} MW, production: ${data[data.length - 1]?.production ?? 'N/A'} MW, ${data.length} data points.`;

    generateChartInsight(
      { chartType: 'Energy Consumption & Production Line Chart', dataSummary, prompt: '' },
      {
        onChunk: (text: string) => { if (keyRef.current === currentKey) setInsight((prev: string) => prev + text); },
        onComplete: () => { if (keyRef.current === currentKey) setLoading(false); },
        onError: () => { if (keyRef.current === currentKey) { setInsight(t('energyDefaultInsight')); setLoading(false); } }
      }
    ).then(result => {
      if (keyRef.current === currentKey && insight === '') {
        setInsight(result);
        setLoading(false);
      }
    });
  };

  return (
    <div>
      <div className="text-xs font-medium text-purple-900 mb-1 flex items-center gap-1">
        {t('aiAnalysisShort')}
        {loading && <Loader2 className="w-3 h-3 animate-spin" />}
      </div>
      <p className="text-xs text-gray-700 min-h-[2.5rem]">
        {insight}
        {loading && <span className="inline-block w-0.5 h-3 bg-purple-500 ml-0.5 animate-pulse" />}
      </p>
      {!generated ? (
        <button
          onClick={handleGenerate}
          disabled={getCooldownSeconds() > 0}
          className="mt-1 text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 className="w-3 h-3" /> {t('generateAIInsight')}
        </button>
      ) : cooldownLeft > 0 ? (
        <div className="mt-1 text-xs text-amber-600 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {t('rateLimitedTryAgain')} {cooldownLeft}{t('secondsSuffix')}
        </div>
      ) : null}
    </div>
  );
}

export function EnergyChart({ data }: EnergyChartProps) {
  const { t } = useAppSettings();
  return (
    <Card className="p-6">
      <h2 className="text-lg mb-1">{t('energyChartTitle')}</h2>
      <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200 flex gap-2">
        <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
        <EnergyAIInsight data={data} />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis key="xaxis" dataKey="label" stroke="#6b7280" />
          <YAxis key="yaxis" stroke="#6b7280" />
          <Tooltip
            key="tooltip"
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend key="legend" />
          <Line
            key="consumption-line"
            type="monotone"
            dataKey="consumption"
            stroke="#ef4444"
            strokeWidth={2}
            name={t('consumptionMW')}
            id="consumption-line"
          />
          <Line
            key="production-line"
            type="monotone"
            dataKey="production"
            stroke="#10b981"
            strokeWidth={2}
            name={t('productionMW')}
            id="production-line"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}