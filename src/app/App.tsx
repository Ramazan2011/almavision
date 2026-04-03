import { Users, Zap, Droplet, Bus, Building2, Leaf, Moon, Sun, MessageSquare, AlertTriangle, RefreshCw, Globe } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { StatsCard } from './components/StatsCard';
import { WeatherWidget } from './components/WeatherWidget';
import { TrafficWidget } from './components/TrafficWidget';
import { EnergyChart } from './components/EnergyChart';
import { PublicTransportChart } from './components/PublicTransportChart';
import { WaterUsageChart } from './components/WaterUsageChart';
import { AIInsightsWidget } from './components/AIInsightsWidget';
import { EnhancedTrafficMap } from './components/EnhancedTrafficMap';
import { EnhancedWeatherMap } from './components/EnhancedWeatherMap';
import { AdvancedFiltering, FilterState } from './components/AdvancedFiltering';
import { useDashboardData } from './hooks/useDashboardData';
import { DebugProvider, useDebug } from './contexts/DebugContext';
import { DebugPanel } from './components/DebugPanel';
import { AppSettingsProvider, useAppSettings } from './contexts/AppSettingsContext';
import { AIChat } from './components/AIChat';
import { IncidentReportWidget } from './components/IncidentReportWidget';
import { Language } from './i18n/translations';

function DashboardContent() {
  const { t, settings, setLanguage, setTheme } = useAppSettings();
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '7d',
    category: 'all',
    zone: 'all',
    dataType: 'real-time',
    searchQuery: '',
  });
  const [showChat, setShowChat] = useState(false);
  const [showIncidents, setShowIncidents] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [countdown, setCountdown] = useState<number>(settings.refreshInterval);

  const { weather, airQuality, transport, energy, water, loading, error } = useDashboardData(filters);
  const { enabled, data } = useDebug();
  const [regenKey, setRegenKey] = useState(0);
  const [regenerating, setRegenerating] = useState(false);

  // Auto-refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setLastRefresh(Date.now());
          return settings.refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.refreshInterval]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleRegenerateAll = useCallback(() => {
    setRegenerating(true);
    setRegenKey(prev => prev + 1);
    setTimeout(() => setRegenerating(false), 5000);
  }, []);

  const handleRefresh = useCallback(() => {
    setLastRefresh(Date.now());
    setCountdown(settings.refreshInterval);
    setRegenKey(prev => prev + 1);
  }, [settings.refreshInterval]);

  const isVisible = (category: string) => {
    return filters.category === 'all' || filters.category === category;
  };

  const getPopulationData = (zone: string, dateRange: string) => {
    const basePopulations: Record<string, number> = {
      all: 2350000,
      almaly: 220000,
      bostandyk: 350000,
      medeu: 230000,
      auezov: 320000,
      turksib: 240000,
      alatau: 310000,
      zhetysu: 170000,
      nauryzbai: 160000,
    };
    
    const base = basePopulations[zone] || basePopulations.all;
    const annualGrowthRate = 0.028;
    let periodGrowth: number;
    let periodLabel: string;
    
    switch (dateRange) {
      case '1h': periodGrowth = annualGrowthRate / (365 * 24); periodLabel = t('lastHour'); break;
      case '24h': periodGrowth = annualGrowthRate / 365; periodLabel = t('last24h'); break;
      case '7d': periodGrowth = annualGrowthRate * (7 / 365); periodLabel = t('last7d'); break;
      case '30d': periodGrowth = annualGrowthRate * (30 / 365); periodLabel = t('last30d'); break;
      case '3m': periodGrowth = annualGrowthRate * 0.25; periodLabel = t('last3m'); break;
      case '1y': periodGrowth = annualGrowthRate; periodLabel = t('lastYear'); break;
      default: periodGrowth = annualGrowthRate * (7 / 365); periodLabel = t('last7d');
    }
    
    const calculated = Math.floor(base * (1 + periodGrowth));
    const val = calculated >= 1000000 ? `${(calculated / 1000000).toFixed(2)}M` : `${Math.floor(calculated / 1000)}K`;
    const growthPercent = (periodGrowth * 100).toFixed(3);
    
    return { val, change: `${growthPercent}% ${periodLabel}` };
  };

  const popData = getPopulationData(filters.zone, filters.dateRange);

  const getPermits = () => {
    let base = filters.zone === 'all' ? 156 : Math.floor(Math.random() * 30 + 5);
    if (filters.dateRange === '7d') return Math.floor(base / 4);
    if (filters.dateRange === '1h' || filters.dateRange === '24h') return 0;
    if (filters.dateRange === '3m') return base * 3;
    if (filters.dateRange === '1y') return base * 12;
    return base;
  };

  const displayEnergy = enabled
    ? [{ id: 0, consumption: data.energy.consumption, production: data.energy.production, label: 'Current' }]
    : energy;

  const displayTransport_data = enabled
    ? [{ id: 0, bus: data.transport.bus, metro: data.transport.metro, tram: data.transport.tram, label: 'Current' }]
    : transport;

  const displayWater = enabled
    ? [{ id: 0, residential: data.water.residential, commercial: data.water.commercial, industrial: data.water.industrial, label: 'Current' }]
    : water;

  const displayWeather = enabled
    ? { current: { temp: data.weather.temp, condition: data.weather.condition, windSpeed: data.weather.windSpeed, humidity: data.weather.humidity }, forecast: [] }
    : weather;

  const getTimeframeLabel = () => {
    switch (filters.dateRange) {
      case '1h': return t('lastHour');
      case '24h': return t('last24h');
      case '7d': return t('last7d');
      case '30d': return t('last30d');
      case '3m': return t('last3m');
      case '1y': return t('lastYear');
      default: return t('last7d');
    }
  };
  const timeframeLabel = getTimeframeLabel();

  const energyChange = energy.length > 1 ? (((energy[energy.length - 1].consumption - energy[0].consumption) / energy[0].consumption) * 100).toFixed(1) : '0.0';
  const waterChange = water.length > 1 ? (((water[water.length - 1].residential - water[0].residential) / water[0].residential) * 100).toFixed(1) : '0.0';
  const transportChange = transport.length > 1 ? (((transport[transport.length - 1].bus - transport[0].bus) / transport[0].bus) * 100).toFixed(1) : '0.0';

  const stats = [
    { title: t('population'), value: popData.val, change: popData.change, icon: Users, trend: "up" as const, category: "demographics", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { title: t('energyUsage'), value: `${(displayEnergy[displayEnergy.length - 1]?.consumption || 0)} МВт`, change: enabled ? t('debugMode') : `${energyChange}% ${timeframeLabel}`, icon: Zap, trend: Number(energyChange) >= 0 ? "up" as const : "down" as const, category: "energy", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
    { title: t('waterUsage'), value: `${(displayWater[displayWater.length - 1]?.residential || 0)}м³`, change: enabled ? t('debugMode') : `${waterChange}% ${timeframeLabel}`, icon: Droplet, trend: Number(waterChange) >= 0 ? "up" as const : "down" as const, category: "water", color: "text-cyan-600", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
    { title: t('publicTransport'), value: `${(displayTransport_data[displayTransport_data.length - 1]?.bus || 0)}`, change: enabled ? t('debugMode') : `${transportChange}% ${timeframeLabel}`, icon: Bus, trend: Number(transportChange) >= 0 ? "up" as const : "down" as const, category: "transport", color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { title: t('airQuality'), value: airQuality?.aqi ?? '--', change: airQuality?.description ?? t('aiGenerating'), icon: Leaf, trend: airQuality && airQuality.aqi > 50 ? 'up' as const : 'down' as const, category: "weather", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", loading: loading },
    { title: t('buildingPermits'), value: getPermits().toString(), change: `${t('last7d')}`, icon: Building2, trend: "up" as const, category: "construction", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
  ];

  const filteredStats = stats.filter(stat => {
    const matchesSearch = stat.title.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchesCategory = filters.category === 'all' || filters.category === stat.category;
    return matchesSearch && matchesCategory;
  });

  const formatRefreshTime = (seconds: number) => {
    if (seconds >= 60) return `${Math.floor(seconds / 60)}м ${seconds % 60}с`;
    return `${seconds}с`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl dark:text-gray-100">{t('appTitle')}</h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">{t('appSubtitle')}</p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Auto-refresh indicator */}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              <RefreshCw className="w-3 h-3" />
              <span>{t('lastUpdated')}: {formatRefreshTime(countdown)}</span>
            </div>
            
            {/* Language switcher */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded p-1">
              <Globe className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 ml-1" />
              {(['ru', 'kk', 'en'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-0.5 text-xs rounded ${
                    settings.language === lang 
                      ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={settings.theme === 'dark' ? t('lightMode') : t('darkMode')}
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </button>
            
            {/* AI Chat */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-lg transition-colors ${showChat ? 'bg-purple-200 dark:bg-purple-800' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              title={t('aiChat')}
            >
              <MessageSquare className="w-4 h-4 text-purple-600" />
            </button>
            
            {/* Incidents */}
            <button
              onClick={() => setShowIncidents(!showIncidents)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative"
              title={t('incidentReport')}
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </button>
            
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-md text-sm border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* AI Insights Section */}
        <div className="mb-6" key={regenKey}>
          <AIInsightsWidget 
            filters={filters} 
            weatherData={displayWeather} 
            transportData={displayTransport_data} 
            energyData={displayEnergy} 
          />
        </div>

        {/* Advanced Filtering */}
        <div className="mb-6">
          <AdvancedFiltering onFilterChange={handleFilterChange} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredStats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              trend={stat.trend}
              iconColor={stat.color}
              iconBg={stat.bg}
              loading={stat.loading}
            />
          ))}
        </div>

        {/* Maps Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {isVisible('traffic') && <EnhancedTrafficMap />}
          {isVisible('weather') && <EnhancedWeatherMap />}
        </div>

        {/* Weather and Traffic Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {isVisible('weather') && <WeatherWidget data={displayWeather} loading={loading} dataType={filters.dataType} />}
          {isVisible('traffic') && <TrafficWidget />}
        </div>

        {/* Energy and Transport Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {isVisible('energy') && <EnergyChart data={displayEnergy} />}
          {isVisible('transport') && <PublicTransportChart data={displayTransport_data} />}
        </div>

        {/* Water Usage Chart */}
        <div className="grid grid-cols-1 gap-6">
          {isVisible('water') && <WaterUsageChart data={displayWater} />}
        </div>

        {/* Incident Report Widget */}
        {showIncidents && (
          <div className="mb-6">
            <IncidentReportWidget />
          </div>
        )}
      </main>

      {/* AI Chat */}
      {showChat && <AIChat onClose={() => setShowChat(false)} />}

      {/* Debug Panel */}
      <DebugPanel onRegenerateAll={handleRegenerateAll} regenerating={regenerating} />
    </div>
  );
}

export default function App() {
  return (
    <DebugProvider>
      <AppSettingsProvider>
        <DashboardContent />
      </AppSettingsProvider>
    </DebugProvider>
  );
}
