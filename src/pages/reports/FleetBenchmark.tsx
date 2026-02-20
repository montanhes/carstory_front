import { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { reportService, type FleetBenchmark as FleetBenchmarkData } from '../../services/api';
import { ChartCard } from '../../components/reports/ChartCard';
import { MetricCard } from '../../components/reports/MetricCard';
import { Car, TrendingUp, TrendingDown } from 'lucide-react';
import { defaultChartOptions } from '../../config/chartConfig';

const CATEGORY_COLORS = [
  'rgb(99, 102, 241)',   // indigo
  'rgb(245, 158, 11)',   // amber
  'rgb(239, 68, 68)',    // red
  'rgb(16, 185, 129)',   // green
  'rgb(236, 72, 153)',   // pink
  'rgb(14, 165, 233)',   // sky
];

export function FleetBenchmark() {
  const [data, setData] = useState<FleetBenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await reportService.getFleetBenchmark();
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

  const distributionChartData = {
    labels: data.distribution.labels,
    datasets: [{
      label: 'Distribuição de Custos',
      data: data.distribution.datasets[0].data,
      backgroundColor: CATEGORY_COLORS.slice(0, data.distribution.labels.length),
      borderWidth: 2,
      borderColor: '#1c2635'
    }]
  };

  const categoryChartData = {
    labels: data.by_category.map(c => c.category),
    datasets: [{
      label: 'Média por Veículo',
      data: data.by_category.map(c => c.average_per_vehicle),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 1
    }]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Benchmark de Frota</h1>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Tamanho da Frota"
          value={data.fleet_size}
          icon={Car}
          iconColor="text-primary"
          description="veículos cadastrados"
        />
        <MetricCard
          title="Total de Despesas"
          value={`R$ ${data.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          iconColor="text-error"
        />
        <MetricCard
          title="Média por Veículo"
          value={`R$ ${data.average_per_vehicle.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          iconColor="text-info"
        />
      </div>

      {/* Veículos Extremos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stats shadow bg-base-200 border border-base-300">
          <div className="stat">
            <div className="stat-figure text-success">
              <TrendingDown size={32} />
            </div>
            <div className="stat-title">Mais Econômico</div>
            <div className="stat-value text-success text-xl md:text-2xl">{data.most_economical.name}</div>
            <div className="stat-desc">
              R$ {data.most_economical.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="stats shadow bg-base-200 border border-base-300">
          <div className="stat">
            <div className="stat-figure text-error">
              <TrendingUp size={32} />
            </div>
            <div className="stat-title">Mais Custoso</div>
            <div className="stat-value text-error text-xl md:text-2xl">{data.most_expensive.name}</div>
            <div className="stat-desc">
              R$ {data.most_expensive.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Distribuição de Custos da Frota" height="350px">
          <Doughnut data={distributionChartData} options={{ ...defaultChartOptions, maintainAspectRatio: true }} />
        </ChartCard>

        <ChartCard title="Média por Veículo por Categoria">
          <Bar data={categoryChartData} options={{ ...defaultChartOptions, indexAxis: 'y' }} />
        </ChartCard>
      </div>

      {/* Tabela por Categoria */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body p-4 md:p-6">
          <h2 className="card-title text-base md:text-lg mb-4">Análise por Categoria</h2>
          <div className="overflow-x-auto">
            <table className="table table-sm md:table-md">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th className="text-right">Total da Frota</th>
                  <th className="text-right">Média por Veículo</th>
                  <th className="text-right">% do Total</th>
                </tr>
              </thead>
              <tbody>
                {data.by_category.map((category, index) => (
                  <tr key={index}>
                    <td className="font-medium">{category.category}</td>
                    <td className="text-right">
                      R$ {category.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-right">
                      R$ {category.average_per_vehicle.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-right">
                      {((category.total / data.total_expenses) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div className="text-sm">
          <p className="font-semibold">Insights da Frota:</p>
          <p>
            A diferença entre o veículo mais econômico e mais custoso é de{' '}
            <strong>R$ {(data.most_expensive.total - data.most_economical.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.
            Considere revisar a estratégia de manutenção do veículo mais custoso.
          </p>
        </div>
      </div>
    </div>
  );
}
