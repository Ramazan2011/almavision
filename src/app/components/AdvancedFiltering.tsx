import { useState } from 'react';
import { Calendar, Filter, Download, RefreshCw, Settings, Search } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAppSettings } from '../contexts/AppSettingsContext';

interface AdvancedFilteringProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  dateRange: string;
  category: string;
  zone: string;
  dataType: string;
  searchQuery: string;
}

export function AdvancedFiltering({ onFilterChange }: AdvancedFilteringProps) {
  const { t } = useAppSettings();
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '7d',
    category: 'all',
    zone: 'all',
    dataType: 'real-time',
    searchQuery: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const dateRanges = [
    { value: '1h', label: t('lastHour') },
    { value: '24h', label: t('last24h') },
    { value: '7d', label: t('last7d') },
    { value: '30d', label: t('last30d') },
    { value: '3m', label: t('last3m') },
    { value: '1y', label: t('lastYear') },
    { value: 'custom', label: t('custom') },
  ];

  const categories = [
    { value: 'all', label: t('allData'), icon: '📊' },
    { value: 'energy', label: t('energy'), icon: '⚡' },
    { value: 'transport', label: t('transport'), icon: '🚌' },
    { value: 'water', label: t('water'), icon: '💧' },
    { value: 'traffic', label: t('traffic'), icon: '🚗' },
    { value: 'weather', label: t('weather'), icon: '🌤️' },
  ];

  const zones = [
    { value: 'all', label: t('allDistricts') },
    { value: 'almaly', label: t('almaly') },
    { value: 'bostandyk', label: t('bostandyk') },
    { value: 'medeu', label: t('medeu') },
    { value: 'auezov', label: t('auezov') },
    { value: 'turksib', label: t('turksib') },
    { value: 'zhetysu', label: t('zhetysu') },
    { value: 'alatau', label: t('alatau') },
    { value: 'nauryzbai', label: t('nauryzbai') },
  ];

  const dataTypes = [
    { value: 'real-time', label: t('realTime') },
    { value: 'historical', label: t('historical') },
    { value: 'predicted', label: t('predicted') },
  ];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleExport = () => {
    console.log('Exporting data with filters:', filters);
    // Mock export functionality
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
    onFilterChange(filters);
  };

  return (
    <Card className="p-4 md:p-6 dark:bg-gray-900 dark:border-gray-700">
      <div className="space-y-4">
        {/* Quick Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium dark:text-gray-200">{t('quickFilters')}</span>
          </div>
          
          {/* Time Range Pills */}
          <div className="flex gap-1 flex-wrap">
            {dateRanges.slice(0, 6).map((range) => (
              <Button
                key={range.value}
                variant={filters.dateRange === range.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('dateRange', range.value)}
                className="h-8 px-3 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                {range.label}
              </Button>
            ))}
          </div>

          <div className="ml-auto flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-8 px-3 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <Settings className="w-3 h-3 mr-1" />
              {showAdvanced ? t('hideAdvanced') : t('showAdvanced')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-8 px-3 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              {t('refresh')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-8 px-3 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <Download className="w-3 h-3 mr-1" />
              {t('export')}
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={filters.category === category.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('category', category.value)}
              className="h-9 px-4 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Zone Filter */}
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">{t('geographicZone')}</label>
                <select
                  value={filters.zone}
                  onChange={(e) => updateFilter('zone', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200"
                >
                  {zones.map((zone) => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Type Filter */}
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">{t('dataType')}</label>
                <select
                  value={filters.dataType}
                  onChange={(e) => updateFilter('dataType', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200"
                >
                  {dataTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">{t('search')}</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={filters.searchQuery}
                    onChange={(e) => updateFilter('searchQuery', e.target.value)}
                    className="h-9 pl-9 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Active Filters Summary */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-600 dark:text-gray-400">{t('active')}:</span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-400 rounded">
              {dateRanges.find(r => r.value === filters.dateRange)?.label}
            </span>
            <span className="px-2 py-1 bg-purple-100 dark:bg-gray-700 text-purple-700 dark:text-purple-400 rounded">
              {categories.find(c => c.value === filters.category)?.label}
            </span>
            {filters.zone !== 'all' && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                {zones.find(z => z.value === filters.zone)?.label}
              </span>
            )}
            {filters.dataType !== 'real-time' && (
              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded">
                {dataTypes.find(d => d.value === filters.dataType)?.label}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
