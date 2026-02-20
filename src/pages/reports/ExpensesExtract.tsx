import { useState, useEffect } from 'react';
import { reportService, vehicleService, type ExpensesExtract, type Vehicle } from '../../services/api';

export function ExpensesExtract() {
  const [data, setData] = useState<ExpensesExtract | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    vehicle_id: undefined as number | undefined,
    page: 1,
    per_page: 15
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadVehicles = async () => {
    try {
      const result = await vehicleService.getVehicles();
      setVehicles(result);
    } catch (err) {
      console.error('Erro ao carregar veículos:', err);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await reportService.getExpensesExtract(filters);
      setData(result);
    } catch (err) {
      console.error('Erro ao carregar extrato:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (loading && !data) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Extrato de Despesas</h1>

      {/* Filtros */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs">Data Inicial</span>
              </label>
              <input
                type="date"
                className="input input-bordered input-sm"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs">Data Final</span>
              </label>
              <input
                type="date"
                className="input input-bordered input-sm"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs">Veículo</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={filters.vehicle_id || ''}
                onChange={(e) => handleFilterChange('vehicle_id', e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <option value="">Todos</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs">Itens por página</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={filters.per_page}
                onChange={(e) => handleFilterChange('per_page', parseInt(e.target.value))}
              >
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      {data && (
        <div className="stats shadow bg-base-200 border border-base-300 w-full">
          <div className="stat">
            <div className="stat-title">Total</div>
            <div className="stat-value text-primary text-xl md:text-2xl">
              R$ {data.summary.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="stat-desc">{data.summary.count} despesas encontradas</div>
          </div>
        </div>
      )}

      {/* Tabela */}
      {data && (
        <div className="card bg-base-200 shadow-md border border-base-300">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-sm md:table-md">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Veículo</th>
                    <th>Categoria</th>
                    <th>Tipo</th>
                    <th className="text-right">Valor</th>
                    <th>Pagamento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((expense) => (
                    <tr key={expense.id}>
                      <td className="whitespace-nowrap">
                        {new Date(expense.expense_date).toLocaleDateString('pt-BR')}
                      </td>
                      <td>{expense.vehicle_name}</td>
                      <td>{expense.expense_category_label}</td>
                      <td>{expense.expense_type_label}</td>
                      <td className="text-right font-medium">
                        R$ {expense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td>{expense.payment_method_label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="flex justify-center gap-2 p-4 border-t border-base-300">
              <button
                className="btn btn-sm"
                disabled={data.pagination.current_page === 1 || loading}
                onClick={() => handlePageChange(data.pagination.current_page - 1)}
              >
                Anterior
              </button>
              <span className="flex items-center px-4 text-sm">
                Página {data.pagination.current_page} de {data.pagination.last_page}
              </span>
              <button
                className="btn btn-sm"
                disabled={data.pagination.current_page === data.pagination.last_page || loading}
                onClick={() => handlePageChange(data.pagination.current_page + 1)}
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
