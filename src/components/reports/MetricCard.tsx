import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, icon: Icon, iconColor = 'text-primary', description, trend }: MetricCardProps) {
  return (
    <div className="stats shadow bg-base-200 border border-base-300">
      <div className="stat">
        {Icon && (
          <div className={`stat-figure ${iconColor}`}>
            <Icon size={32} />
          </div>
        )}
        <div className="stat-title text-xs md:text-sm">{title}</div>
        <div className="stat-value text-lg md:text-2xl">{value}</div>
        {description && <div className="stat-desc text-xs">{description}</div>}
        {trend && (
          <div className={`stat-desc ${trend.isPositive ? 'text-success' : 'text-error'}`}>
            {trend.isPositive ? '↗︎' : '↘︎'} {Math.abs(trend.value).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}
