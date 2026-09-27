import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  colorScheme: 'indigo' | 'emerald' | 'amber' | 'purple';
  subtitle?: string;
  onClick?: () => void;
}

const colorStyles = {
  indigo: {
    bg: 'bg-indigo-50/80',
    iconBg: 'bg-indigo-600',
    iconText: 'text-white',
    border: 'border-indigo-100',
    hoverBorder: 'hover:border-indigo-300',
  },
  emerald: {
    bg: 'bg-emerald-50/80',
    iconBg: 'bg-emerald-600',
    iconText: 'text-white',
    border: 'border-emerald-100',
    hoverBorder: 'hover:border-emerald-300',
  },
  amber: {
    bg: 'bg-amber-50/80',
    iconBg: 'bg-amber-600',
    iconText: 'text-white',
    border: 'border-amber-100',
    hoverBorder: 'hover:border-amber-300',
  },
  purple: {
    bg: 'bg-purple-50/80',
    iconBg: 'bg-purple-600',
    iconText: 'text-white',
    border: 'border-purple-100',
    hoverBorder: 'hover:border-purple-300',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  colorScheme,
  subtitle,
  onClick,
}) => {
  const styles = colorStyles[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border ${styles.border} ${
        onClick ? `cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${styles.hoverBorder}` : 'shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${styles.iconBg} ${styles.iconText}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
