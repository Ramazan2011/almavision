import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface DateRangeFilterProps {
  onFilterChange: (range: string, category: string) => void;
}

export function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
  const [selectedRange, setSelectedRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const dateRanges = [
    { value: '24h', label: '24 часа' },
    { value: '7d', label: '7 дней' },
    { value: '30d', label: '30 дней' },
    { value: '3m', label: '3 месяца' },
    { value: '1y', label: 'Год' },
  ];

  const categories = [
    { value: 'all', label: 'Все данные' },
    { value: 'energy', label: 'Энергия' },
    { value: 'transport', label: 'Транспорт' },
    { value: 'water', label: 'Вода' },
    { value: 'traffic', label: 'Трафик' },
  ];

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    onFilterChange(range, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFilterChange(selectedRange, category);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Date Range Selection */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Период:</span>
          <div className="flex gap-1">
            {dateRanges.map((range) => (
              <Button
                key={range.value}
                variant={selectedRange === range.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleRangeChange(range.value)}
                className="h-8 px-3 text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-gray-200" />

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Категория:</span>
          <div className="flex gap-1">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category.value)}
                className="h-8 px-3 text-xs"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-600">
        <span>Показано:</span>
        <span className="font-medium">
          {selectedCategory === 'all' ? 'Все категории' : categories.find(c => c.value === selectedCategory)?.label}
        </span>
        <span>•</span>
        <span className="font-medium">
          {dateRanges.find(r => r.value === selectedRange)?.label}
        </span>
      </div>
    </Card>
  );
}
