import { DashboardContext, AIInsight, SplitInsights, StreamingCallbacks, ChartInsightConfig } from './types'; // Adjust import path if needed

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
    message: 'Пиковое потребление энергии ожидается в 16:00.',
    icon: 'Zap',
  },
  {
    type: 'success',
    title: 'Успех общественного транспорта',
    message: 'Пассажиропоток метро вырос на 15% за неделю.',
    icon: 'TrendingUp',
  },
];

// --- Helper Functions ---

function normalizeInsights(insights: any[]): AIInsight[] {
  const VALID_SEVERITIES = new Set(['critical', 'warning', 'info', 'success', 'danger', 'caution']);
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
    const data = parsed.shortTerm !== undefined ? parsed :
                 parsed.insights?.shortTerm !== undefined ? parsed.insights :
                 parsed.data?.shortTerm !== undefined ? parsed.data : null;
    if (data) {
      return {
        shortTerm: normalizeInsights(data.shortTerm || []),
        longTerm: normalizeInsights(data.longTerm || []),
      };
    }
    return null;
  } catch { return null; }
}

// --- Main Service Functions ---

export async function generateInsights(
  context: DashboardContext,
  callbacks?: StreamingCallbacks
): Promise<AIInsight[]> {
  const zoneName = context.zone === 'all' ? 'Все районы' : context.zone;
  const weatherInfo = context.weather ? `${context.weather.temp}°C, ${context.weather.description}` : 'Нет данных';

  const prompt = `Аналитик Smart City Алматы. 
  Контекст: Район ${zoneName}, Погода ${weatherInfo}, Транспорт ${context.latestTransport}, Энергия ${context.latestEnergy} МВт. 
  Выдай JSON с shortTerm (1-3) и longTerm (1-3) на русском языке.`;

  try {
    // We fetch from our LOCAL Vercel API route to bypass CORS
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a Smart City AI analyst for Almaty. Output ONLY valid JSON in Russian.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok || !response.body) throw new Error(`API Proxy Error: ${response.status}`);

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
    console.error('[AI Service] Error:', error);
    callbacks?.onError?.(error as Error);
    return DEFAULT_INSIGHTS;
  }
}

export async function generateChartInsight(
  config: ChartInsightConfig,
  callbacks?: StreamingCallbacks
): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a Smart City AI analyst for Almaty. One concise sentence in Russian.' },
          { role: 'user', content: `Проанализируй данные: ${config.dataSummary}` }
        ]
      })
    });

    if (!response.ok || !response.body) return 'Анализ временно недоступен.';

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const content = JSON.parse(line.slice(6)).choices[0].delta.content;
            if (content) {
              fullContent += content;
              callbacks?.onChunk?.(content);
            }
          } catch {}
        }
      }
    }
    return fullContent.trim();
  } catch {
    return 'Ошибка при получении аналитики.';
  }
}
