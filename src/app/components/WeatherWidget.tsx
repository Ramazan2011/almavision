import { Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react';
import { Card } from './ui/card';
import { WeatherData } from '../services/weatherService';

interface WeatherWidgetProps {
  data?: WeatherData | null;
  loading?: boolean;
  dataType?: string;
}

const WeatherIcon = ({ condition, className }: { condition: string; className?: string }) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <Sun className={`${className} text-yellow-500`} />;
    case 'rainy':
      return <CloudRain className={`${className} text-blue-500`} />;
    default:
      return <Cloud className={`${className} text-gray-500`} />;
  }
};

export function WeatherWidget({ data, loading, dataType }: WeatherWidgetProps) {
  if (loading || !data) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  const isPredicted = dataType === 'predicted';

  return (
    <Card className="p-6">
      <h2 className="text-lg mb-4">
        {isPredicted ? 'Прогноз погоды' : 'Погодные условия'}
        {isPredicted && <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Прогноз</span>}
      </h2>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <WeatherIcon condition={data.current.condition} className="w-12 h-12" />
          </div>
          <div>
            <div className="text-4xl">{data.current.temp}°C</div>
            <div className="text-gray-500">{data.current.condition}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Скорость ветра</div>
            <div>{data.current.windSpeed} км/ч</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-gray-500" />
          <div>
            <div className="text-sm text-gray-500">Влажность</div>
            <div>{data.current.humidity}%</div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <h3 className="text-sm mb-3">Прогноз на 5 дней</h3>
        <div className="grid grid-cols-5 gap-2">
          {data.forecast.map((forecast) => (
            <div key={forecast.day} className="text-center">
              <div className="text-sm text-gray-500 mb-1">{forecast.day}</div>
              <WeatherIcon condition={forecast.condition} className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">{forecast.temp}°C</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
