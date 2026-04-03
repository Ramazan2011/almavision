import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sparkles, Loader2, Wand2, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { TransportData } from '../services/simulationService';
import { generateChartInsight } from '../services/llmService';
import { getCooldownSeconds, useCooldownState } from '../services/cooldownService';

const DEFAULT_INSIGHT = 'Метро наиболее востребовано. Рекомендуется динамическая корректировка маршрутов.';

interface PublicTransportChartProps {
  data: TransportData[];
}

function TransportAIInsight({ data }: { data: TransportData[] }) {
  const [insight, setInsight] = useState(DEFAULT_INSIGHT);
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

    const latest = data[data.length - 1];
    const dataSummary = `Bus: ${latest?.bus ?? 'N/A'}, Metro: ${latest?.metro ?? 'N/A'}, Tram: ${latest?.tram ?? 'N/A'}, ${data.length} data points.`;

    generateChartInsight(
      { chartType: 'Public Transport Usage Bar Chart', dataSummary, prompt: '' },
      {
        onChunk: (text) => { if (keyRef.current === currentKey) setInsight(prev => prev + text); },
        onComplete: () => { if (keyRef.current === currentKey) setLoading(false); },
        onError: () => { if (keyRef.current === currentKey) { setInsight(DEFAULT_INSIGHT); setLoading(false); } }
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
        ИИ-анализ
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
          <Wand2 className="w-3 h-3" /> Сгенерировать ИИ-анализ
        </button>
      ) : cooldownLeft > 0 ? (
        <div className="mt-1 text-xs text-amber-600 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Ограничение. Попробуйте через {cooldownLeft}с
        </div>
      ) : null}
    </div>
  );
}

export function PublicTransportChart({ data }: PublicTransportChartProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg mb-1">Использование общественного транспорта</h2>
      <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200 flex gap-2">
        <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
        <TransportAIInsight data={data} />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
          <Bar key="bus-bar" dataKey="bus" fill="#3b82f6" name="Bus" id="bus-bar" />
          <Bar key="metro-bar" dataKey="metro" fill="#8b5cf6" name="Metro" id="metro-bar" />
          <Bar key="tram-bar" dataKey="tram" fill="#06b6d4" name="Tram" id="tram-bar" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}