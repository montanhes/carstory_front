import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { reportService, type MaintenanceReport as MaintenanceReportData } from '../../services/api';
import { ChartCard } from '../../components/reports/ChartCard';
import { Wrench } from 'lucide-react';
import { defaultChartOptions } from '../../config/chartConfig';

const MAINTENANCE_COLORS = [
  'rgb(239, 68, 68)',    // red
  'rgb(245, 158, 11)',   // amber
  'rgb(16, 185, 129)',   // green
  'rgb(99, 102, 241)',   // indigo
  'rgb(236, 72, 153)',   // pink
  'rgb(14, 165, 233)',   // sky
];

export function MaintenanceReport() {
  const [data, setData] = useState<MaintenanceReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await reportService.getMaintenanceReport();
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
      label: 'Gastos com Manutenção',
      data: data.chart_data.datasets[0].data,
      backgroundColor: MAINTENANCE_COLORS.slice(0, data.chart_data.labels.length),
      borderWidth: 2,
      borderColor: '#1c2635'
    }]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Relatório de Manutenção</h1>

      <div className="stats shadow bg-base-200 border border-base-300 w-full">
        <div className="stat">
          <div className="stat-figure text-error">
            <Wrench size={32} />
          </div>
          <div className="stat-title">Total em Manutenção</div>
          <div className="stat-value text-error">
            R$ {data.total_maintenance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico por Tipo */}
        <ChartCard title="Distribuição por Tipo de Manutenção" height="350px">
          <Pie data={chartData} options={{ ...defaultChartOptions, maintainAspectRatio: true }} />
        </ChartCard>

        {/* Cards por Veículo */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Manutenção por Veículo</h2>
          {data.by_vehicle.map((vehicle) => (
            <div key={vehicle.vehicle_id} className="card bg-base-200 shadow-md border border-base-300">
              <div className="card-body p-4">
                <h3 className="card-title text-base">{vehicle.vehicle_name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-base-content/70">Total:</span>
                    <span className="ml-2 font-semibold">R$ {vehicle.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="text-base-content/70">Manutenções:</span>
                    <span className="ml-2 font-semibold">{vehicle.count}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-base-content/70">Última manutenção:</span>
                    <span className="ml-2">{new Date(vehicle.last_maintenance).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela por Tipo */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body p-4 md:p-6">
          <h2 className="card-title text-base md:text-lg mb-4">Detalhamento por Tipo de Manutenção</h2>
          <div className="overflow-x-auto">
            <table className="table table-sm md:table-md">
              <thead>
                <tr>
                  <th>Tipo de Manutenção</th>
                  <th className="text-right">Quantidade</th>
                  <th className="text-right">Total Gasto</th>
                  <th className="text-right">Média</th>
                </tr>
              </thead>
              <tbody>
                {data.by_type.map((type, index) => (
                  <tr key={index}>
                    <td className="font-medium">{type.type}</td>
                    <td className="text-right">{type.count}</td>
                    <td className="text-right">R$ {type.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right">R$ {type.average.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabela por Veículo */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body p-4 md:p-6">
          <h2 className="card-title text-base md:text-lg mb-4">Resumo por Veículo</h2>
          <div className="overflow-x-auto">
            <table className="table table-sm md:table-md">
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th className="text-right">Total</th>
                  <th className="text-right">Manutenções</th>
                  <th>Última Manutenção</th>
                </tr>
              </thead>
              <tbody>
                {data.by_vehicle.map((vehicle) => (
                  <tr key={vehicle.vehicle_id}>
                    <td className="font-medium">{vehicle.vehicle_name}</td>
                    <td className="text-right">R$ {vehicle.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right">{vehicle.count}</td>
                    <td>{new Date(vehicle.last_maintenance).toLocaleDateString('pt-BR')}</td>
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
