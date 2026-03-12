import { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { reportService, type FuelAnalysis as FuelAnalysisData } from '../../services/api';
import { ChartCard } from '../../components/reports/ChartCard';
import { Fuel } from 'lucide-react';
import { defaultChartOptions } from '../../config/chartConfig';

const FUEL_COLORS = [
  'rgb(245, 158, 11)',   // amber
  'rgb(16, 185, 129)',   // green
  'rgb(99, 102, 241)',   // indigo
  'rgb(236, 72, 153)',   // pink
  'rgb(14, 165, 233)',   // sky
  'rgb(168, 85, 247)',   // purple
];

const VEHICLE_COLORS = [
  { bg: 'rgba(99, 102, 241, 0.8)',  border: 'rgb(99, 102, 241)' },
  { bg: 'rgba(244, 63, 94, 0.8)',   border: 'rgb(244, 63, 94)' },
  { bg: 'rgba(34, 197, 94, 0.8)',   border: 'rgb(34, 197, 94)' },
  { bg: 'rgba(251, 146, 60, 0.8)',  border: 'rgb(251, 146, 60)' },
  { bg: 'rgba(139, 92, 246, 0.8)',  border: 'rgb(139, 92, 246)' },
  { bg: 'rgba(14, 165, 233, 0.8)',  border: 'rgb(14, 165, 233)' },
  { bg: 'rgba(236, 72, 153, 0.8)',  border: 'rgb(236, 72, 153)' },
  { bg: 'rgba(234, 179, 8, 0.8)',   border: 'rgb(234, 179, 8)' },
  { bg: 'rgba(20, 184, 166, 0.8)',  border: 'rgb(20, 184, 166)' },
  { bg: 'rgba(168, 85, 247, 0.8)',  border: 'rgb(168, 85, 247)' },
  { bg: 'rgba(239, 68, 68, 0.8)',   border: 'rgb(239, 68, 68)' },
  { bg: 'rgba(59, 130, 246, 0.8)',  border: 'rgb(59, 130, 246)' },
];

export function FuelAnalysis() {
  const [data, setData] = useState<FuelAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await reportService.getFuelAnalysis();
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

  const vehicleColors = data.chart_data.labels.map((_: string, i: number) => VEHICLE_COLORS[i % VEHICLE_COLORS.length]);

  const chartData = {
    labels: data.chart_data.labels,
    datasets: [{
      label: 'Gastos com Combustível',
      data: data.chart_data.datasets[0].data,
      backgroundColor: vehicleColors.map((c: typeof VEHICLE_COLORS[number]) => c.bg),
      borderColor: vehicleColors.map((c: typeof VEHICLE_COLORS[number]) => c.border),
      borderWidth: 1
    }]
  };

  const fuelTypeChartData = {
    labels: data.by_fuel_type.map(f => f.fuel_type),
    datasets: [{
      label: 'Por Tipo de Combustível',
      data: data.by_fuel_type.map(f => f.total),
      backgroundColor: FUEL_COLORS.slice(0, data.by_fuel_type.length),
      borderWidth: 2,
      borderColor: '#1c2635'
    }]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Análise de Combustível</h1>

      <div className="stats shadow bg-base-200 border border-base-300 w-full">
        <div className="stat">
          <div className="stat-figure text-warning">
            <Fuel size={32} />
          </div>
          <div className="stat-title">Total Gasto com Combustível</div>
          <div className="stat-value text-warning">
            R$ {data.total_fuel_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico por Veículo */}
        <ChartCard title="Gastos por Veículo">
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

        {/* Gráfico por Tipo de Combustível */}
        <ChartCard
          title="Distribuição por Tipo de Combustível"
          height="350px"
          footer={
            <div className="flex flex-wrap justify-start gap-2 mt-4">
              {data.by_fuel_type.map((fuel, i) => (
                <span key={fuel.fuel_type} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-base-300/50 text-xs text-base-content/80">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: FUEL_COLORS[i % FUEL_COLORS.length] }}
                  />
                  {fuel.fuel_type}
                </span>
              ))}
            </div>
          }
        >
          <Doughnut data={fuelTypeChartData} options={{
            ...defaultChartOptions,
            maintainAspectRatio: false,
            scales: {},
            plugins: {
              ...defaultChartOptions.plugins,
              legend: { display: false },
              tooltip: {
                ...defaultChartOptions.plugins.tooltip,
                callbacks: {
                  label: function(context: any) {
                    const label = context.label || '';
                    const value = context.parsed;
                    return `${label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                  }
                }
              }
            }
          }} />
        </ChartCard>
      </div>

      {/* Tabela por Veículo */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body p-4 md:p-6">
          <h2 className="card-title text-base md:text-lg mb-4">Detalhamento por Veículo</h2>
          <div className="overflow-x-auto">
            <table className="table table-sm md:table-md">
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th>Tipo Combustível</th>
                  <th className="text-right">Total Gasto</th>
                  <th className="text-right">Abastecimentos</th>
                  <th className="text-right">Média por Abast.</th>
                </tr>
              </thead>
              <tbody>
                {data.by_vehicle.map((vehicle) => (
                  <tr key={vehicle.vehicle_id}>
                    <td className="font-medium">{vehicle.vehicle_name}</td>
                    <td>{vehicle.fuel_type}</td>
                    <td className="text-right">R$ {vehicle.total_spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right">{vehicle.count}</td>
                    <td className="text-right">R$ {vehicle.average_per_fill.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabela por Tipo de Combustível */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body p-4 md:p-6">
          <h2 className="card-title text-base md:text-lg mb-4">Resumo por Tipo de Combustível</h2>
          <div className="overflow-x-auto">
            <table className="table table-sm md:table-md">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th className="text-right">Total</th>
                  <th className="text-right">Abastecimentos</th>
                  <th className="text-right">Média</th>
                </tr>
              </thead>
              <tbody>
                {data.by_fuel_type.map((fuel, index) => (
                  <tr key={index}>
                    <td className="font-medium">{fuel.fuel_type}</td>
                    <td className="text-right">R$ {fuel.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right">{fuel.count}</td>
                    <td className="text-right">R$ {fuel.average.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
