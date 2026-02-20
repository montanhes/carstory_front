import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { reportService, type ExpensesByVehicle as ExpensesByVehicleData } from '../../services/api';
import { ChartCard } from '../../components/reports/ChartCard';
import { defaultChartOptions } from '../../config/chartConfig';

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

  const chartData = {
    labels: data.chart_data.labels,
    datasets: [{
      label: 'Despesas por Veículo',
      data: data.chart_data.datasets[0].data,
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgb(99, 102, 241)',
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
        <Bar data={chartData} options={{ ...defaultChartOptions, indexAxis: 'y' }} />
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.vehicles.map((vehicle) => (
          <div key={vehicle.vehicle_id} className="card bg-base-200 shadow-md border border-base-300">
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
