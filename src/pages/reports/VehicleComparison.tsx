import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { reportService, vehicleService, type VehicleComparison as VehicleComparisonData, type Vehicle } from '../../services/api';
import { ChartCard } from '../../components/reports/ChartCard';
import { Trophy } from 'lucide-react';
import { defaultChartOptions } from '../../config/chartConfig';

export function VehicleComparison() {
  const [data, setData] = useState<VehicleComparisonData | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicles.length > 0) {
      loadData();
    }
  }, [selectedVehicles]);

  const loadVehicles = async () => {
    try {
      const result = await vehicleService.getVehicles();
      setVehicles(result);
      // Selecionar todos os veículos por padrão
      setSelectedVehicles(result.map(v => v.id));
    } catch (err) {
      console.error('Erro ao carregar veículos:', err);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await reportService.getVehicleComparison({ vehicle_ids: selectedVehicles });
      setData(result);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVehicle = (vehicleId: number) => {
    setSelectedVehicles(prev =>
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  if (loading && !data) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  if (!data) return null;

  const chartData = {
    labels: data.comparison_chart.labels,
    datasets: data.comparison_chart.datasets.map((dataset, index) => {
      const colors = [
        'rgb(99, 102, 241)',   // Total - indigo
        'rgb(245, 158, 11)',   // Combustível - amber
        'rgb(239, 68, 68)',    // Manutenção - red
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
      <h1 className="text-2xl md:text-3xl font-bold">Comparação entre Veículos</h1>

      {/* Seleção de Veículos */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body p-4">
          <h3 className="font-semibold mb-2">Selecione os veículos para comparar:</h3>
          <div className="flex flex-wrap gap-2">
            {vehicles.map((vehicle) => (
              <label key={vehicle.id} className="label cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selectedVehicles.includes(vehicle.id)}
                  onChange={() => toggleVehicle(vehicle.id)}
                />
                <span className="label-text">{vehicle.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Veículo Mais Econômico */}
      <div className="stats shadow bg-base-200 border border-base-300 w-full">
        <div className="stat">
          <div className="stat-figure text-success">
            <Trophy size={32} />
          </div>
          <div className="stat-title">Veículo Mais Econômico</div>
          <div className="stat-value text-success text-xl md:text-2xl">{data.most_economical.name}</div>
          <div className="stat-desc">
            Total: R$ {data.most_economical.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Gráfico Comparativo */}
      <ChartCard title="Comparação de Gastos por Categoria">
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

      {/* Tabela Detalhada */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body p-4 md:p-6">
          <h2 className="card-title text-base md:text-lg mb-4">Detalhamento Comparativo</h2>
          <div className="overflow-x-auto">
            <table className="table table-sm md:table-md">
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th>Tipo Comb.</th>
                  <th className="text-right">Total</th>
                  <th className="text-right">Combustível</th>
                  <th className="text-right">Manutenção</th>
                  <th className="text-right">Média</th>
                  <th className="text-right">Despesas</th>
                </tr>
              </thead>
              <tbody>
                {data.vehicles.map((vehicle) => (
                  <tr key={vehicle.vehicle_id} className={vehicle.vehicle_id === data.most_economical.vehicle_id ? 'bg-success/10' : ''}>
                    <td className="font-medium">
                      {vehicle.name}
                      {vehicle.vehicle_id === data.most_economical.vehicle_id && (
                        <span className="ml-2 badge badge-success badge-sm">Mais econômico</span>
                      )}
                    </td>
                    <td>{vehicle.fuel_type}</td>
                    <td className="text-right font-semibold">R$ {vehicle.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right">R$ {vehicle.fuel_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right">R$ {vehicle.maintenance_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right">R$ {vehicle.average_expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right">{vehicle.expenses_count}</td>
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
