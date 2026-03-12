import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { reportService, type DepreciationReport as DepreciationReportData } from '../../services/api';
import { ChartCard } from '../../components/reports/ChartCard';
import { TrendingDown } from 'lucide-react';
import { defaultChartOptions } from '../../config/chartConfig';

export function DepreciationReport() {
  const [data, setData] = useState<DepreciationReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await reportService.getDepreciationReport();
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

  const DATASET_COLORS = [
    'rgb(16, 185, 129)',   // Aquisição - green
    'rgb(239, 68, 68)',    // Total Investido - red
  ];

  const chartData = {
    labels: data.chart_data.labels,
    datasets: data.chart_data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: `${DATASET_COLORS[index]}cc`,
      borderColor: DATASET_COLORS[index],
      borderWidth: 1
    }))
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Relatório de Depreciação</h1>

      {/* Gráfico Comparativo */}
      <ChartCard
        title="Investimento Total por Veículo"
        footer={
          <div className="flex flex-wrap justify-start gap-2 mt-4">
            {chartData.datasets.map((dataset, i) => (
              <span key={dataset.label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-base-300/50 text-xs text-base-content/80">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: DATASET_COLORS[i] }}
                />
                {dataset.label}
              </span>
            ))}
          </div>
        }
      >
        <Bar
          data={chartData}
          options={{
            ...defaultChartOptions,
            plugins: {
              ...defaultChartOptions.plugins,
              legend: { display: false },
            }
          }}
        />
      </ChartCard>

      {/* Cards por Veículo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.vehicles.map((vehicle) => (
          <div key={vehicle.vehicle_id} className="card bg-base-200 shadow-md border border-base-300">
            <div className="card-body p-4">
              <h3 className="card-title text-base flex items-center gap-2">
                <TrendingDown size={18} className="text-error" />
                {vehicle.name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Data Aquisição:</span>
                  <span>{new Date(vehicle.acquisition_date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Valor Aquisição:</span>
                  <span className="font-semibold text-success">
                    R$ {vehicle.acquisition_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Total Despesas:</span>
                  <span className="text-warning">
                    R$ {vehicle.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="divider my-1"></div>
                <div className="flex justify-between">
                  <span className="text-base-content/70 font-semibold">Investimento Total:</span>
                  <span className="font-bold text-error">
                    R$ {vehicle.total_investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Tempo de Posse:</span>
                  <span>{(() => {
                    const totalMonths = Math.round(vehicle.months_owned);
                    const years = Math.floor(totalMonths / 12);
                    const months = totalMonths % 12;
                    if (years === 0) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
                    if (months === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`;
                    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
                  })()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Custo Mensal Médio:</span>
                  <span>
                    R$ {(vehicle.months_owned > 0 ? vehicle.total_investment / Math.round(vehicle.months_owned) : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela Detalhada */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body p-4 md:p-6">
          <h2 className="card-title text-base md:text-lg mb-4">Análise Detalhada de Investimento</h2>
          <div className="overflow-x-auto">
            <table className="table table-sm md:table-md">
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th className="text-right">Aquisição</th>
                  <th className="text-right">Despesas</th>
                  <th className="text-right">Total Investido</th>
                  <th className="text-right">Posse</th>
                  <th className="text-right">Custo/Mês</th>
                </tr>
              </thead>
              <tbody>
                {data.vehicles.map((vehicle) => (
                  <tr key={vehicle.vehicle_id}>
                    <td className="font-medium">{vehicle.name}</td>
                    <td className="text-right text-success">
                      R$ {vehicle.acquisition_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-right text-warning">
                      R$ {vehicle.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-right font-semibold text-error">
                      R$ {vehicle.total_investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-right">{(() => {
                      const totalMonths = Math.round(vehicle.months_owned);
                      const years = Math.floor(totalMonths / 12);
                      const months = totalMonths % 12;
                      if (years === 0) return `${months}m`;
                      if (months === 0) return `${years}a`;
                      return `${years}a ${months}m`;
                    })()}</td>
                    <td className="text-right">
                      R$ {(vehicle.months_owned > 0 ? vehicle.total_investment / Math.round(vehicle.months_owned) : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
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
