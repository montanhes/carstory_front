import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { reportService, type ExpensesByVehicle as ExpensesByVehicleData } from '../../services/api';
import { ChartCard } from '../../components/reports/ChartCard';
import { defaultChartOptions } from '../../config/chartConfig';

const VEHICLE_COLORS = [
  { bg: 'rgba(99, 102, 241, 0.8)',  border: 'rgb(99, 102, 241)',  accent: 'border-l-indigo-500' },
  { bg: 'rgba(244, 63, 94, 0.8)',   border: 'rgb(244, 63, 94)',   accent: 'border-l-rose-500' },
  { bg: 'rgba(34, 197, 94, 0.8)',   border: 'rgb(34, 197, 94)',   accent: 'border-l-green-500' },
  { bg: 'rgba(251, 146, 60, 0.8)',  border: 'rgb(251, 146, 60)',  accent: 'border-l-orange-400' },
  { bg: 'rgba(139, 92, 246, 0.8)',  border: 'rgb(139, 92, 246)',  accent: 'border-l-violet-500' },
  { bg: 'rgba(14, 165, 233, 0.8)',  border: 'rgb(14, 165, 233)',  accent: 'border-l-sky-500' },
  { bg: 'rgba(236, 72, 153, 0.8)',  border: 'rgb(236, 72, 153)',  accent: 'border-l-pink-500' },
  { bg: 'rgba(234, 179, 8, 0.8)',   border: 'rgb(234, 179, 8)',   accent: 'border-l-yellow-500' },
  { bg: 'rgba(20, 184, 166, 0.8)',  border: 'rgb(20, 184, 166)',  accent: 'border-l-teal-500' },
  { bg: 'rgba(168, 85, 247, 0.8)',  border: 'rgb(168, 85, 247)',  accent: 'border-l-purple-500' },
  { bg: 'rgba(239, 68, 68, 0.8)',   border: 'rgb(239, 68, 68)',   accent: 'border-l-red-500' },
  { bg: 'rgba(59, 130, 246, 0.8)',  border: 'rgb(59, 130, 246)',  accent: 'border-l-blue-500' },
];

export function ExpensesByVehicle() {
  const [data, setData] = useState<ExpensesByVehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'total' | 'count' | 'average'>('total');

  useEffect(() => {
    loadData();
  }, [sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await reportService.getExpensesByVehicle({ sort_by: sortBy });
      setData(result);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  if (!data) return null;

  const chartColors = data.chart_data.labels.map((_: string, i: number) => VEHICLE_COLORS[i % VEHICLE_COLORS.length]);

  const chartData = {
    labels: data.chart_data.labels,
    datasets: [{
      label: 'Despesas por Veículo',
      data: data.chart_data.datasets[0].data,
      backgroundColor: chartColors.map((c: typeof VEHICLE_COLORS[number]) => c.bg),
      borderColor: chartColors.map((c: typeof VEHICLE_COLORS[number]) => c.border),
      borderWidth: 1
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Despesas por Veículo</h1>
        <select
          className="select select-bordered select-sm md:select-md w-full sm:w-auto"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="total">Ordenar por Total</option>
          <option value="count">Ordenar por Quantidade</option>
          <option value="average">Ordenar por Média</option>
        </select>
      </div>

      <ChartCard title="Comparação de Gastos">
        <Bar data={chartData} options={{
          ...defaultChartOptions,
          indexAxis: 'y' as const,
          scales: {
            x: {
              ...defaultChartOptions.scales.x,
              ticks: {
                ...defaultChartOptions.scales.x.ticks,
                callback: function(value: any) {
                  return 'R$ ' + value.toLocaleString('pt-BR');
                }
              }
            },
            y: {
              grid: defaultChartOptions.scales.y.grid,
              ticks: {
                color: defaultChartOptions.scales.y.ticks.color,
              }
            }
          },
          plugins: {
            ...defaultChartOptions.plugins,
            legend: { display: false },
            tooltip: {
              ...defaultChartOptions.plugins.tooltip,
              callbacks: {
                label: function(context: any) {
                  let label = context.dataset.label || '';
                  if (label) label += ': ';
                  label += 'R$ ' + context.parsed.x.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  });
                  return label;
                }
              }
            }
          }
        }} />
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.vehicles.map((vehicle, index) => (
          <div key={vehicle.vehicle_id} className={`card bg-base-200 shadow-md border border-base-300 border-l-4 ${VEHICLE_COLORS[index % VEHICLE_COLORS.length].accent}`}>
            <div className="card-body p-4">
              <h3 className="card-title text-base">{vehicle.vehicle_name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Total:</span>
                  <span className="font-semibold">R$ {vehicle.total_expenses.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Média:</span>
                  <span>R$ {vehicle.average_expense.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Despesas:</span>
                  <span>{vehicle.expenses_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Última:</span>
                  <span>{new Date(vehicle.last_expense_date).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
