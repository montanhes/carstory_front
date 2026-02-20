import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  height?: string;
  actions?: ReactNode;
}

export function ChartCard({ title, children, height = '400px', actions }: ChartCardProps) {
  return (
    <div className="card bg-base-200 shadow-md border border-base-300">
      <div className="card-body p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="card-title text-base md:text-lg">{title}</h2>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
        <div style={{ height, position: 'relative' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
