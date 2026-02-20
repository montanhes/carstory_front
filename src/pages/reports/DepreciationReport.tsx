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

  const chartData = {
    labels: data.chart_data.labels,
    datasets: data.chart_data.datasets.map((dataset, index) => {
      const colors = [
        'rgb(16, 185, 129)',   // Aquisição - green
        'rgb(239, 68, 68)',    // Total Investido - red
      ];
      return {
        ...dataset,
        backgroundColor: `${colors[index]}cc`,
        borderColor: colors[index],
        borderWidth: 1
      };
    })
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Relatório de Depreciação</h1>

      {/* Gráfico Comparativo */}
      <ChartCard title="Investimento Total por Veículo">
        <Bar
          data={chartData}
          options={{
            ...defaultChartOptions,
            plugins: {
              ...defaultChartOptions.plugins,
              legend: {
                ...defaultChartOptions.plugins.legend,
                position: 'bottom' as const
              }
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
                  <span>{vehicle.months_owned} meses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Custo Mensal Médio:</span>
                  <span>
                    R$ {(vehicle.total_investment / vehicle.months_owned).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                  <th className="text-right">Meses</th>
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
                    <td className="text-right">{vehicle.months_owned}</td>
                    <td className="text-right">
                      R$ {(vehicle.total_investment / vehicle.months_owned).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
