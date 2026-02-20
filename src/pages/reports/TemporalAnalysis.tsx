import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { reportService, type TemporalAnalysis as TemporalAnalysisData } from '../../services/api';
import { ChartCard } from '../../components/reports/ChartCard';
import { MetricCard } from '../../components/reports/MetricCard';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { defaultChartOptions } from '../../config/chartConfig';

export function TemporalAnalysis() {
  const [data, setData] = useState<TemporalAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    loadData();
  }, [groupBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await reportService.getTemporalAnalysis({ group_by: groupBy });
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
    datasets: data.chart_data.datasets.map(dataset => ({
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
        <h1 className="text-2xl md:text-3xl font-bold">Análise Temporal</h1>
        <select
          className="select select-bordered select-sm md:select-md w-full sm:w-auto"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as any)}
        >
          <option value="day">Por Dia</option>
          <option value="week">Por Semana</option>
          <option value="month">Por Mês</option>
          <option value="quarter">Por Trimestre</option>
          <option value="year">Por Ano</option>
        </select>
      </div>

      {/* Métricas de Tendência */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Média do Período"
          value={`R$ ${data.trends.average_monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={Activity}
          iconColor="text-info"
        />
        <MetricCard
          title={`Maior (${data.trends.highest_month.period_label})`}
          value={`R$ ${data.trends.highest_month.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          iconColor="text-error"
        />
        <MetricCard
          title={`Menor (${data.trends.lowest_month.period_label})`}
          value={`R$ ${data.trends.lowest_month.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingDown}
          iconColor="text-success"
        />
      </div>

      {/* Gráfico de Evolução */}
      <ChartCard title="Evolução Temporal de Despesas">
        <Line data={chartData} options={defaultChartOptions} />
      </ChartCard>

      {/* Tabela de Dados */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body p-4 md:p-6">
          <h2 className="card-title text-base md:text-lg mb-4">Detalhamento por Período</h2>
          <div className="overflow-x-auto">
            <table className="table table-sm md:table-md">
              <thead>
                <tr>
                  <th>Período</th>
                  <th className="text-right">Total</th>
                  <th className="text-right">Qtd</th>
                  <th className="text-right">Média</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item, index) => (
                  <tr key={index}>
                    <td className="font-medium">{item.period_label}</td>
                    <td className="text-right">R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="text-right">{item.count}</td>
                    <td className="text-right">R$ {item.average.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
