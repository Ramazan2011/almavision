import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down';
  iconColor: string;
  iconBg: string;
  loading?: boolean;
}

export function StatsCard({ title, value, change, icon: Icon, trend, iconColor, iconBg, loading }: StatsCardProps) {
  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl mb-1">{value}</p>
          <p className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}
