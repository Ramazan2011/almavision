import { getOpenRouterApiKey } from './configService';

export type InsightSeverity = 'critical' | 'warning' | 'info' | 'success' | 'danger' | 'caution';

export interface AIInsight {
  type: InsightSeverity;
  title: string;
  message: string;
  icon?: string;  // lucide icon name: AlertTriangle, AlertCircle, Info, CheckCircle, TrendingUp, TrendingDown, Zap, Droplet, Bus, Building2, Leaf, Shield, Eye, Clock, AlertOctagon, Thermometer, Wind, CloudRain, CloudSnow, Cloud, Activity, BarChart3, PieChart, MapPin, Users, Wifi, WifiOff
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
    message: 'Пассажиропоток метро вырос на 15% за неделю. Погодные условия и рекламные кампании способствуют этому.',
    icon: 'TrendingUp',
  },
];

// Parse JSON from LLM response, handling markdown code blocks and other common issues
function parseJSONResponse(content: string): AIInsight[] | null {
  try {
    // Remove markdown code blocks if present
    let cleaned = content.trim();
    
    // Remove ```json ... ``` wrapper
    cleaned = cleaned.replace(/^```json\s*\n?/i, '').replace(/\n?\s*```$/i, '');
    // Remove ``` ... ``` wrapper (without language specifier)
    cleaned = cleaned.replace(/^```\s*\n?/i, '').replace(/\n?\s*```$/i, '');
    
    cleaned = cleaned.trim();
    
    const parsed = JSON.parse(cleaned);
    
    // Handle case where LLM wraps array in an object
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      // Try common key patterns
      if (Array.isArray(parsed.insights)) return parsed.insights;
      if (Array.isArray(parsed.data)) return parsed.data;
      if (Array.isArray(parsed.results)) return parsed.results;
      // Try to find any array in the object
      const values = Object.values(parsed);
      for (const val of values) {
        if (Array.isArray(val) && val.length > 0 && val[0].title) {
          return val as AIInsight[];
        }
      }
      return null;
    }
    
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as AIInsight[];
    }
    
    return null;
  } catch {
    return null;
  }
}

// Map of valid severity types
const VALID_SEVERITIES = new Set(['critical', 'warning', 'info', 'success', 'danger', 'caution']);

// Validate and normalize insights
function normalizeInsights(insights: any[]): AIInsight[] {
  return insights
    .map((insight) => ({
      type: VALID_SEVERITIES.has(insight.type) ? insight.type : 'info',
      title: String(insight.title || 'AI Insight'),
      message: String(insight.message || 'No details available.'),
      icon: insight.icon || undefined,
    })) as AIInsight[];
}

// Parse split insights response
function parseSplitInsights(content: string): SplitInsights | null {
  try {
    let cleaned = content.trim();
    cleaned = cleaned.replace(/^```json\s*\n?/i, '').replace(/\n?\s*```$/i, '');
    cleaned = cleaned.replace(/^```\s*\n?/i, '').replace(/\n?\s*```$/i, '');
    cleaned = cleaned.trim();
    
    const parsed = JSON.parse(cleaned);
    
    if (parsed && typeof parsed === 'object') {
      // Handle if AI wraps in an object with insights/data key
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
  } catch {
    return null;
  }
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
  const apiKey = await getOpenRouterApiKey();
  
  console.log('[AI Insights] API key present:', !!apiKey);
  console.log('[AI Insights] API key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'none');

  if (!apiKey || apiKey === '') {
    console.warn('[AI Insights] No valid OpenRouter API key found. Falling back to default static insights.');
    console.warn('[AI Insights] Please set openrouterApiKey in public/config.json with a key from https://openrouter.ai/');
    return DEFAULT_INSIGHTS;
  }

  const zoneName = context.zone === 'all' ? 'All Districts' : context.zone;
  const weatherInfo = context.weather
    ? `${context.weather.temp}°C, ${context.weather.description}`
    : 'Unknown';

  const prompt = `You are an expert AI Smart City Analyst for Almaty, Kazakhstan. Your job is to analyze real-time city data and provide concise, actionable insights for city administrators.

LANGUAGE REQUIREMENT:
- ALL output (titles and messages) MUST be in Russian language (русский язык).
- Use clear, professional Russian suitable for city administrators.

CURRENT DASHBOARD CONTEXT:
- District/Zone: ${zoneName}
- Time Period: ${context.dateRange}
- Weather Conditions: ${weatherInfo}
- Active Public Transport Units: ${context.latestTransport}
- Energy Consumption: ${context.latestEnergy} MW

PRIORITY ANALYSIS AREAS (in order of importance):
1. HUMAN SAFETY: Risk of injury or death from traffic accidents, infrastructure failures, extreme weather, gas leaks, electrical hazards, flooding, landslides
2. EMERGENCY RESPONSE: Fire, medical, police response times and coverage; evacuation routes; disaster preparedness
3. CRITICAL INFRASTRUCTURE: Power grid stability, water supply contamination, sewage failures, bridge/road structural integrity, building safety
4. PUBLIC HEALTH: Air quality hazards, water contamination, disease outbreaks, heat/cold exposure risks, noise pollution
5. TRAFFIC & TRANSPORT: Congestion causing emergency vehicle delays, accident hotspots, public transport breakdowns, pedestrian safety
6. ENERGY & UTILITIES: Blackout risks, hospital power supply, heating system failures in winter, water pressure drops
7. ENVIRONMENTAL: Flood zones, avalanche risks (Almaty is near mountains), air pollution spikes, waste management
8. ECONOMIC: Business disruption, market impacts, tourism effects, property damage costs
9. QUALITY OF LIFE: Noise, commute times, green space access, cultural events, community wellbeing

ANALYSIS INSTRUCTIONS:
1. ALWAYS prioritize human safety and lethality risk assessment - if data suggests danger to people, flag it as "danger" or "critical" immediately
2. Consider how weather impacts all priority areas in Almaty (mountain city = avalanche/landslide risks in winter, hot summers = heat stress)
3. Identify potential issues across all priority areas, not just infrastructure
4. Suggest proactive measures that protect lives first, then infrastructure, then economy
5. Highlight positive trends worth noting

TIME HORIZON - You MUST generate insights for BOTH categories:
- SHORT-TERM (immediate, next few hours): Urgent issues like current congestion, immediate weather impacts, real-time energy spikes, active incidents, emergency response needs. Generate 1-3 insights.
- LONG-TERM (trends, next days/weeks): Patterns, seasonal changes, infrastructure wear, policy impacts, sustainability trends, budget planning, preventive maintenance. Generate 1-3 insights.

Each insight must include:
- type: Choose from: "danger" (threat to life/safety), "critical" (emergency), "warning" (needs urgent attention), "caution" (monitor closely), "info" (neutral observation), "success" (positive trend)
- icon: Choose a relevant icon name from: AlertTriangle, AlertCircle, Info, CheckCircle, TrendingUp, TrendingDown, Zap, Droplet, Bus, Building2, Leaf, Shield, Eye, Clock, AlertOctagon, Thermometer, Wind, CloudRain, CloudSnow, Cloud, Activity, BarChart3, PieChart, MapPin, Users, Wifi, WifiOff
- title: Short descriptive title (in Russian)
- message: Specific insight referencing actual data (in Russian)

Each insight must be:
- Specific to the data values provided (reference actual numbers)
- Actionable for city management teams
- Concise (1-2 sentences maximum)
- Realistic for Almaty's urban context
- Written in Russian language

RESPONSE FORMAT:
Return ONLY a valid JSON object with TWO arrays. No markdown, no code blocks, no explanations. Exactly this format:
{
  "shortTerm": [
    {"type": "danger", "icon": "AlertTriangle", "title": "Заголовок на русском", "message": "Описание на русском"}
  ],
  "longTerm": [
    {"type": "warning", "icon": "Clock", "title": "Заголовок на русском", "message": "Описание на русском"}
  ]
}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Smart City Dashboard',
      },
      body: JSON.stringify({
        model: 'stepfun/step-3.5-flash:free',
        messages: [
          {
            role: 'system',
            content: 'You are a Smart City AI analyst for Almaty, Kazakhstan. ALL output MUST be in Russian language. You MUST return ONLY a valid JSON object with TWO arrays: "shortTerm" (immediate issues) and "longTerm" (trend-based insights). Each insight must have "type" (one of: danger, warning, caution, info, success, critical), "icon" (a lucide icon name), "title" (in Russian), and "message" (in Russian). Prioritize human safety. Generate 1-3 insights for EACH category. NEVER include markdown code blocks, explanations, or any text outside the JSON object.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      })
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      const error = new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorBody}`);
      callbacks?.onError?.(error);
      return DEFAULT_INSIGHTS;
    }

    if (!response.body) {
      const error = new Error('No response body from OpenRouter API');
      callbacks?.onError?.(error);
      return DEFAULT_INSIGHTS;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Process SSE lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (!trimmed.startsWith('data: ')) continue;

        try {
          const json = JSON.parse(trimmed.slice(6));
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            fullContent += delta;
            callbacks?.onChunk?.(delta);
          }
        } catch {
          // Skip malformed SSE chunks
        }
      }
    }

    console.log('[AI Insights] Full streamed response:', fullContent);
    const splitParsed = parseSplitInsights(fullContent);
    
    if (splitParsed && (splitParsed.shortTerm.length > 0 || splitParsed.longTerm.length > 0)) {
      console.log('[AI Insights] Successfully generated split insights:', splitParsed.shortTerm.length, 'short-term,', splitParsed.longTerm.length, 'long-term');
      const combined = [...splitParsed.shortTerm, ...splitParsed.longTerm];
      callbacks?.onComplete?.(combined);
      return combined;
    }
    
    // Fallback to old format if split parsing fails
    const parsed = parseJSONResponse(fullContent);
    if (parsed && parsed.length > 0) {
      const normalized = normalizeInsights(parsed);
      console.log('[AI Insights] Successfully generated', normalized.length, 'insights from OpenRouter');
      callbacks?.onComplete?.(normalized);
      return normalized;
    }
    
    console.warn('[AI Insights] Failed to parse AI response, falling back to defaults. Raw response:', fullContent);
    callbacks?.onComplete?.(DEFAULT_INSIGHTS);
    return DEFAULT_INSIGHTS;
  } catch (error) {
    console.error('[AI Insights] Failed to generate AI insights:', error);
    callbacks?.onError?.(error instanceof Error ? error : new Error(String(error)));
    return DEFAULT_INSIGHTS;
  }
}

// Generate a single chart insight with streaming
export async function generateChartInsight(
  config: ChartInsightConfig,
  callbacks?: StreamingCallbacks
): Promise<string> {
  const apiKey = await getOpenRouterApiKey();

  if (!apiKey || apiKey === '') {
    return 'Add openrouterApiKey to public/config.json for live AI analysis.';
  }

  const prompt = `You are an expert AI Smart City Analyst for Almaty, Kazakhstan.

LANGUAGE REQUIREMENT:
- ALL output MUST be in Russian language (русский язык).

CHART CONTEXT:
- Chart Type: ${config.chartType}
- Data Summary: ${config.dataSummary}

TASK:
Provide a concise, data-driven insight (1-2 sentences) about this chart. Reference specific trends, anomalies, or patterns. Be specific and actionable. Consider safety implications if relevant.

RESPONSE FORMAT:
Return ONLY the insight text in Russian. No JSON, no markdown, no explanations. Just a single sentence or two.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Smart City Dashboard',
      },
      body: JSON.stringify({
        model: 'stepfun/step-3.5-flash:free',
        messages: [
          { role: 'system', content: 'You are a Smart City AI analyst for Almaty. ALL output MUST be in Russian. Return ONLY a single concise insight in Russian. No markdown, no JSON, no explanations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150,
        stream: true,
      })
    });

    if (!response.ok) {
      const error = new Error(`API error: ${response.status}`);
      callbacks?.onError?.(error);
      return 'AI analysis unavailable. Showing default insight.';
    }

    if (!response.body) {
      callbacks?.onError?.(new Error('No response body'));
      return 'AI analysis unavailable. Showing default insight.';
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (!trimmed.startsWith('data: ')) continue;

        try {
          const json = JSON.parse(trimmed.slice(6));
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            fullContent += delta;
            callbacks?.onChunk?.(delta);
          }
        } catch {
          // Skip malformed chunks
        }
      }
    }

    const cleaned = fullContent.trim();
    if (cleaned.length > 0) {
      callbacks?.onComplete?.([]);
      return cleaned;
    }

    return 'AI analysis could not be generated. Showing default insight.';
  } catch (error) {
    console.error('[Chart AI Insight] Error:', error);
    callbacks?.onError?.(error instanceof Error ? error : new Error(String(error)));
    return 'AI analysis failed. Showing default insight.';
  }
}
