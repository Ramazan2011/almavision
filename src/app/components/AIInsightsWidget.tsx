import { Sparkles, TrendingUp, AlertCircle, Lightbulb, Loader2, KeyRound, Clock, AlertTriangle, Info, CheckCircle, TrendingDown, Zap, Droplet, Bus, Building2, Leaf, Shield, Eye, AlertOctagon, Thermometer, Wind, CloudRain, CloudSnow, Cloud, Activity, BarChart3, PieChart, MapPin, Users, Wifi, WifiOff } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from './ui/card';
import { generateInsights, AIInsight } from '../services/llmService';
import { FilterState } from './AdvancedFiltering';
import { WeatherData } from '../services/weatherService';
import { getCooldownSeconds, setCooldown, useCooldownState } from '../services/cooldownService';
import { useDebug } from '../contexts/DebugContext';
import { useAppSettings } from '../contexts/AppSettingsContext';

interface Props {
  filters: FilterState;
  weatherData: WeatherData | null;
  transportData: any[];
  energyData: any[];
}

const isApiKeyConfigured = (): boolean => {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY;
  return !!(key && key !== '' && key !== 'your_openrouter_api_key_here');
};

// Typewriter hook for animating text letter by letter
function useTypewriter(text: string, speed: number = 20, enabled: boolean = true) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayedText, isComplete };
}

// Map of available icons
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  AlertTriangle, AlertCircle, Info, CheckCircle, TrendingUp, TrendingDown,
  Zap, Droplet, Bus, Building2, Leaf, Shield, Eye, Clock, AlertOctagon,
  Thermometer, Wind, CloudRain, CloudSnow, Cloud, Activity, BarChart3,
  PieChart, MapPin, Users, Wifi, WifiOff, Lightbulb, Sparkles,
};

// Get color scheme based on severity type (with dark mode support)
const getTypeStyle = (type: string) => {
  switch (type) {
    case 'danger':
    case 'critical':
      return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800' };
    case 'warning':
      return { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800' };
    case 'caution':
      return { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800' };
    case 'info':
      return { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800' };
    case 'success':
      return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800' };
    default:
      return { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800/50', border: 'border-gray-200 dark:border-gray-700' };
  }
};

// Animated insight component with typewriter effect
function AnimatedInsight({ insight, index, delay }: { insight: AIInsight; index: number; delay: number }) {
  const [visible, setVisible] = useState(false);
  const { displayedText: displayedMessage, isComplete: messageComplete } = useTypewriter(insight.message, 15, visible);
  const { displayedText: displayedTitle } = useTypewriter(insight.title, 25, visible);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const style = getTypeStyle(insight.type);
  const Icon = insight.icon && ICON_MAP[insight.icon] ? ICON_MAP[insight.icon] : AlertCircle;

  return (
    <div
      className={`p-4 rounded-lg ${style.bg} border ${style.border} transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${style.color}`} />
        <div className="flex-1">
          <h3 className="text-sm mb-1 font-semibold min-h-[1.25rem] dark:text-gray-100">{displayedTitle}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 min-h-[1.25rem]">
            {displayedMessage}
            {!messageComplete && visible && (
              <span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

const COOLDOWN_SECONDS = 30;

export function AIInsightsWidget({ filters, weatherData, transportData, energyData }: Props) {
  const { enabled, data: debugData } = useDebug();
  const { t } = useAppSettings();
  const [shortTermInsights, setShortTermInsights] = useState<AIInsight[]>([]);
  const [longTermInsights, setLongTermInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isUsingLiveAI, setIsUsingLiveAI] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const abortRef = useRef(false);
  const callbackFiredRef = useRef(false);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe to global cooldown
  useEffect(() => {
    const { subscribe } = useCooldownState();
    const unsubscribe = subscribe((seconds) => setCooldownLeft(seconds));
    return unsubscribe;
  }, []);

  useEffect(() => {
    let mounted = true;
    abortRef.current = false;
    callbackFiredRef.current = false;

    async function fetchInsights() {
      // Don't fetch if in cooldown
      const existingCooldown = getCooldownSeconds();
      if (existingCooldown > 0) {
        if (mounted) {
          setCooldownLeft(existingCooldown);
          setIsUsingLiveAI(false);
          setIsStreaming(false);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setStreamingText('');
      setIsStreaming(true);
      callbackFiredRef.current = false;

      // Use debug data if enabled
      const latestTransport = enabled ? debugData.transport.bus : (transportData[transportData.length - 1]?.bus || 0);
      const latestEnergy = enabled ? debugData.energy.consumption : (energyData[energyData.length - 1]?.consumption || 0);
      const weather = enabled
        ? { temp: debugData.weather.temp, description: debugData.weather.condition }
        : (weatherData ? { temp: weatherData.current.temp, description: weatherData.current.condition } : null);

      await generateInsights({
        zone: filters.zone,
        dateRange: filters.dateRange,
        weather,
        latestTransport,
        latestEnergy
      }, {
        onChunk: (text) => {
          if (mounted) {
            setStreamingText(prev => prev + text);
          }
        },
        onComplete: (finalInsights) => {
          callbackFiredRef.current = true;
          if (mounted) {
            // Try to parse split insights from streaming text
            try {
              let cleaned = streamingText.trim();
              cleaned = cleaned.replace(/^```json\s*\n?/i, '').replace(/\n?\s*```$/i, '');
              cleaned = cleaned.replace(/^```\s*\n?/i, '').replace(/\n?\s*```$/i, '');
              const parsed = JSON.parse(cleaned);
              if (parsed?.shortTerm || parsed?.longTerm) {
                setShortTermInsights(parsed.shortTerm || []);
                setLongTermInsights(parsed.longTerm || []);
              } else {
                // Fallback: split evenly if no structure
                const mid = Math.ceil(finalInsights.length / 2);
                setShortTermInsights(finalInsights.slice(0, mid));
                setLongTermInsights(finalInsights.slice(mid));
              }
            } catch {
              // Fallback: split evenly
              const mid = Math.ceil(finalInsights.length / 2);
              setShortTermInsights(finalInsights.slice(0, mid));
              setLongTermInsights(finalInsights.slice(mid));
            }
            setIsUsingLiveAI(true);
            setIsStreaming(false);
            setLoading(false);
          }
        },
        onError: () => {
          callbackFiredRef.current = true;
          if (mounted) {
            setIsUsingLiveAI(false);
            setIsStreaming(false);
            setLoading(false);
            // Set global cooldown and schedule retry
            setCooldown(COOLDOWN_SECONDS);
            retryTimeoutRef.current = setTimeout(() => {
              if (mounted) {
                fetchInsights();
              }
            }, COOLDOWN_SECONDS * 1000);
          }
        }
      });

      // Fallback: if neither callback fired after 10 seconds, reset state
      setTimeout(() => {
        if (mounted && !callbackFiredRef.current) {
          setIsUsingLiveAI(false);
          setIsStreaming(false);
          setLoading(false);
          setCooldown(COOLDOWN_SECONDS);
          retryTimeoutRef.current = setTimeout(() => {
            if (mounted) {
              fetchInsights();
            }
          }, COOLDOWN_SECONDS * 1000);
        }
      }, 10000);
    }

    // Prevent fetching on every tiny render, debounce or fetch strictly on data change
    const timeout = setTimeout(fetchInsights, 1000);
    return () => {
      mounted = false;
      abortRef.current = true;
      clearTimeout(timeout);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [filters.zone, filters.dateRange, weatherData?.current.temp]);

  return (
    <Card className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border-blue-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h2 className="text-lg dark:text-gray-100">{t('aiInsights')}</h2>
      </div>

      <div className="space-y-3">
        {isStreaming ? (
          // Streaming state - show raw text as it arrives
          <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 min-h-[120px]">
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">{t('aiAnalyzing')}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap">
              {streamingText}
              <span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 animate-pulse" />
            </p>
          </div>
        ) : (shortTermInsights.length > 0 || longTermInsights.length > 0) ? (
          <>
            {/* Short-term insights */}
            {shortTermInsights.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {t('shortTerm')}
                </h3>
                <div className="space-y-2">
                  {shortTermInsights.map((insight, index) => (
                    <AnimatedInsight
                      key={`short-${index}`}
                      insight={insight}
                      index={index}
                      delay={index * 300}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Divider line */}
            {(shortTermInsights.length > 0 && longTermInsights.length > 0) && (
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 border-t border-purple-300 dark:border-purple-700"></div>
                <Clock className="w-4 h-4 text-purple-400 dark:text-purple-500" />
                <div className="flex-1 border-t border-purple-300 dark:border-purple-700"></div>
              </div>
            )}

            {/* Long-term insights */}
            {longTermInsights.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {t('longTerm')}
                </h3>
                <div className="space-y-2">
                  {longTermInsights.map((insight, index) => (
                    <AnimatedInsight
                      key={`long-${index}`}
                      insight={insight}
                      index={index}
                      delay={index * 300}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          // Empty state
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 animate-pulse flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full shrink-0"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">{t('aiAnalysis')}:</span>{' '}
          {cooldownLeft > 0
            ? `${t('retrying')} ${cooldownLeft}с...`
            : isUsingLiveAI
              ? t('aiSuccess')
              : isApiKeyConfigured()
                ? t('aiError')
                : t('aiStatic')
          }
        </p>
        {isStreaming ? (
          <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
            <Loader2 className="w-3 h-3 animate-spin" /> {t('aiGenerating')}
          </div>
        ) : cooldownLeft > 0 ? (
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
            <Clock className="w-3 h-3" /> {t('cooldown')} {cooldownLeft}с
          </div>
        ) : isUsingLiveAI ? (
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <Sparkles className="w-3 h-3" /> {t('aiGenerated')}
          </div>
        ) : !isApiKeyConfigured() ? (
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
            <KeyRound className="w-3 h-3" /> {t('staticMode')}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
            <AlertCircle className="w-3 h-3" /> {t('aiFallback')}
          </div>
        )}
      </div>
    </Card>
  );
}
