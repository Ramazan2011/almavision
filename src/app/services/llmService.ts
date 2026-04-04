import { getLangdockApiKey } from './configService';

export type InsightSeverity = 'critical' | 'warning' | 'info' | 'success' | 'danger' | 'caution';

export interface AIInsight {
  type: InsightSeverity;
  title: string;
  message: string;
  icon?: string; 
}

export interface SplitInsights {
  shortTerm: AIInsight[];
  longTerm: AIInsight[];
}

export interface ChartInsightConfig {
  dataSummary: string;
  chartType: string;
  prompt: string;
}

export interface DashboardContext {
  zone: string;
  dateRange: string;
  weather: {
    temp: number;
    description: string;
  } | null;
  latestTransport: number;
  latestEnergy: number;
}

const DEFAULT_INSIGHTS: AIInsight[] = [
  {
    type: 'danger',
    title: 'Предупреждение о пробках',
    message: 'В районе Алмалы пробки на 40% выше обычного. Рекомендуется активировать оптимизацию светофоров.',
    icon: 'AlertTriangle',
  },
  {
    type: 'warning',
    title: 'Оптимизация энергии',
    message: 'Пиковое потребление энергии ожидается в 16:00. Рекомендуется перенести неважные операции на ночное время.',
    icon: 'Zap',
  },
  {
    type: 'success',
    title: 'Успех общественного транспорта',
    message: 'Пассажиропоток метро вырос на 15% за неделю.',
    icon: 'TrendingUp',
  },
];

function parseJSONResponse(content: string): AIInsight[] | null {
  try {
    let cleaned = content.trim().replace(/^```json\s*\n?/i, '').replace(/\n?\s*```$/i, '');
    cleaned = cleaned.replace(/^```\s*\n?/i, '').replace(/\n?\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      if (Array.isArray(parsed.insights)) return parsed.insights;
      if (Array.isArray(parsed.data)) return parsed.data;
      const values = Object.values(parsed);
      for (const val of values) {
        if (Array.isArray(val) && val.length > 0 && (val[0] as any).title) return val as AIInsight[];
      }
      return null;
    }
    return Array.isArray(parsed) ? (parsed as AIInsight[]) : null;
  } catch { return null; }
}

const VALID_SEVERITIES = new Set(['critical', 'warning', 'info', 'success', 'danger', 'caution']);

function normalizeInsights(insights: any[]): AIInsight[] {
  return insights.map((insight) => ({
    type: VALID_SEVERITIES.has(insight.type) ? insight.type : 'info',
    title: String(insight.title || 'AI Insight'),
    message: String(insight.message || 'No details available.'),
    icon: insight.icon || undefined,
  })) as AIInsight[];
}

function parseSplitInsights(content: string): SplitInsights | null {
  try {
    let cleaned = content.trim().replace(/^```json\s*\n?/i, '').replace(/\n?\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === 'object') {
      const data = parsed.shortTerm !== undefined ? parsed :
                   parsed.insights?.shortTerm !== undefined ? parsed.insights :
                   parsed.data?.shortTerm !== undefined ? parsed.data : null;
      if (data) {
        return {
          shortTerm: normalizeInsights(data.shortTerm || []),
          longTerm: normalizeInsights(data.longTerm || []),
        };
      }
    }
    return null;
  } catch { return null; }
}

export interface StreamingCallbacks {
  onChunk?: (text: string) => void;
  onComplete?: (insights: AIInsight[]) => void;
  onError?: (error: Error) => void;
}

export async function generateInsights(
  context: DashboardContext,
  callbacks?: StreamingCallbacks
): Promise<AIInsight[]> {
  const apiKey = await getLangdockApiKey();

  if (!apiKey) {
    console.warn('[AI Insights] No Langdock API key found. Check .env file.');
    return DEFAULT_INSIGHTS;
  }

  const zoneName = context.zone === 'all' ? 'All Districts' : context.zone;
  const weatherInfo = context.weather ? `${context.weather.temp}°C, ${context.weather.description}` : 'Unknown';

  const prompt = `You are an expert AI Smart City Analyst for Almaty. 
  LANGUAGE: Russian.
  CONTEXT: Zone ${zoneName}, Weather ${weatherInfo}, Transport ${context.latestTransport}, Energy ${context.latestEnergy} MW.
  FORMAT: JSON object with "shortTerm" and "longTerm" arrays. No markdown.`;

  try {
    const response = await fetch('https://api.langdock.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Replace with your Langdock deployment name
        messages: [
          { role: 'system', content: 'You are a Smart City AI analyst for Almaty. Output ONLY JSON in Russian. Use "shortTerm" and "longTerm" keys.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        stream: true,
      })
    });

    if (!response.ok || !response.body) throw new Error(`Langdock API Error: ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ') || trimmed === 'data: [DONE]') continue;
        try {
          const json = JSON.parse(trimmed.slice(6));
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            fullContent += delta;
            callbacks?.onChunk?.(delta);
          }
        } catch {}
      }
    }

    const splitParsed = parseSplitInsights(fullContent);
    if (splitParsed) {
      const combined = [...splitParsed.shortTerm, ...splitParsed.longTerm];
      callbacks?.onComplete?.(combined);
      return combined;
    }
    return DEFAULT_INSIGHTS;
  } catch (error) {
    callbacks?.onError?.(error as Error);
    return DEFAULT_INSIGHTS;
  }
}

export async function generateChartInsight(
  config: ChartInsightConfig,
  callbacks?: StreamingCallbacks
): Promise<string> {
  const apiKey = await getLangdockApiKey();
  if (!apiKey) return 'API Key missing.';

  try {
    const response = await fetch('https://api.langdock.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a Smart City AI analyst for Almaty. Output one concise sentence in Russian.' },
          { role: 'user', content: `Analyze this ${config.chartType} data for Almaty: ${config.dataSummary}` }
        ],
        temperature: 0.7,
        stream: true,
      })
    });

    if (!response.ok || !response.body) return 'Analysis unavailable.';

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const delta = JSON.parse(line.slice(6)).choices[0].delta.content;
            if (delta) { fullContent += delta; callbacks?.onChunk?.(delta); }
          } catch {}
        }
      }
    }
    return fullContent.trim();
  } catch { return 'Analysis failed.'; }
}
