import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { reportService, type DashboardReport } from '../services/api';
import { MetricCard } from '../components/reports/MetricCard';
import { ChartCard } from '../components/reports/ChartCard';
import { Car, TrendingUp, DollarSign } from 'lucide-react';
import { defaultChartOptions } from '../config/chartConfig';

export default function Dashboard() {
  const [data, setData] = useState<DashboardReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'monthly' | 'yearly' | 'all'>('monthly');

  useEffect(() => {
    loadDashboard();
  }, [period]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const result = await reportService.getDashboard({ period });
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!data) return null;

  const chartData = {
    labels: data.expenses_over_time.labels,
    datasets: data.expenses_over_time.datasets.map(dataset => ({
      ...dataset,
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true
    }))
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <select
          className="select select-bordered select-sm md:select-md w-full sm:w-auto"
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
        >
          <option value="monthly">Mensal</option>
          <option value="yearly">Anual</option>
          <option value="all">Todos os períodos</option>
        </select>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Total de Veículos"
          value={data.vehicles_count}
          icon={Car}
          iconColor="text-primary"
          description={`${data.expenses_count} despesas registradas`}
        />
        <MetricCard
          title="Total de Despesas"
          value={`R$ ${data.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          iconColor="text-error"
          trend={{
            value: data.period_comparison.variation_percent,
            isPositive: data.period_comparison.variation_percent < 0
          }}
        />
        <MetricCard
          title="Média por Veículo"
          value={`R$ ${data.average_per_vehicle.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          iconColor="text-success"
        />
      </div>

      {/* Gráfico de Evolução */}
      <ChartCard title="Evolução de Despesas">
        <Line data={chartData} options={defaultChartOptions} />
      </ChartCard>
    </div>
  );
}
