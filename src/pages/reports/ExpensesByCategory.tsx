import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { reportService, type ExpensesByCategory as ExpensesByCategoryData } from '../../services/api';
import { ChartCard } from '../../components/reports/ChartCard';
import { defaultChartOptions } from '../../config/chartConfig';

const CHART_COLORS = [
  'rgb(99, 102, 241)',   // indigo
  'rgb(236, 72, 153)',   // pink
  'rgb(168, 85, 247)',   // purple
  'rgb(59, 130, 246)',   // blue
  'rgb(16, 185, 129)',   // green
  'rgb(245, 158, 11)',   // amber
  'rgb(239, 68, 68)',    // red
  'rgb(14, 165, 233)',   // sky
];

export function ExpensesByCategory() {
  const [data, setData] = useState<ExpensesByCategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await reportService.getExpensesByCategory();
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
      label: 'Despesas por Categoria',
      data: data.chart_data.datasets[0].data,
      backgroundColor: CHART_COLORS.slice(0, data.chart_data.labels.length),
      borderWidth: 2,
      borderColor: '#1c2635'
    }]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Despesas por Categoria</h1>

      <div className="stats shadow bg-base-200 border border-base-300 w-full">
        <div className="stat">
          <div className="stat-title">Total Geral</div>
          <div className="stat-value text-primary">
            R$ {data.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Distribuição por Categoria" height="350px">
          <Pie data={chartData} options={{ ...defaultChartOptions, maintainAspectRatio: true }} />
        </ChartCard>

        <div className="card bg-base-200 shadow-md border border-base-300">
          <div className="card-body p-4 md:p-6">
            <h2 className="card-title text-base md:text-lg mb-4">Detalhamento</h2>
            <div className="overflow-x-auto">
              <table className="table table-sm md:table-md">
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th className="text-right">Total</th>
                    <th className="text-right">%</th>
                    <th className="text-right">Qtd</th>
                  </tr>
                </thead>
                <tbody>
                  {data.by_category.map((cat) => (
                    <tr key={cat.category_id}>
                      <td className="font-medium">{cat.category}</td>
                      <td className="text-right">R$ {cat.total.toLocaleString('pt-BR')}</td>
                      <td className="text-right">{cat.percentage.toFixed(1)}%</td>
                      <td className="text-right">{cat.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
