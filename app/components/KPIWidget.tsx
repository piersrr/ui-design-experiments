'use client';

interface KPIWidgetProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
}

export default function KPIWidget({ title, value, change, changeLabel, icon }: KPIWidgetProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-300 bg-gradient-to-br from-white/80 to-zinc-100/80 p-6 backdrop-blur-sm transition-all hover:border-zinc-400 hover:shadow-lg hover:shadow-zinc-300/50 dark:border-zinc-800 dark:from-zinc-900/50 dark:to-zinc-950/50 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">{value}</p>
          {change !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${
                  isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                }`}
              >
                {isPositive ? '↑' : '↓'} {Math.abs(change)}%
              </span>
              {changeLabel && (
                <span className="text-xs text-zinc-500">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-zinc-200/80 p-3 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
