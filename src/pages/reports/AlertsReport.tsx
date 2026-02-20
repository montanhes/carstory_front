import { useState, useEffect } from 'react';
import { reportService, type AlertsReport as AlertsReportData } from '../../services/api';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export function AlertsReport() {
  const [data, setData] = useState<AlertsReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await reportService.getAlertsReport();
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

  const filteredAlerts = filter === 'all'
    ? data.alerts
    : data.alerts.filter(alert => alert.priority === filter);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="text-error" size={24} />;
      case 'medium':
        return <AlertCircle className="text-warning" size={24} />;
      case 'low':
        return <Info className="text-info" size={24} />;
      default:
        return <Info className="text-info" size={24} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="badge badge-error badge-sm">Alta</span>;
      case 'medium':
        return <span className="badge badge-warning badge-sm">Média</span>;
      case 'low':
        return <span className="badge badge-info badge-sm">Baixa</span>;
      default:
        return <span className="badge badge-ghost badge-sm">{priority}</span>;
    }
  };

  const alertsByPriority = {
    high: data.alerts.filter(a => a.priority === 'high').length,
    medium: data.alerts.filter(a => a.priority === 'medium').length,
    low: data.alerts.filter(a => a.priority === 'low').length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Alertas e Lembretes</h1>

      {/* Resumo de Alertas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stats shadow bg-base-200 border border-base-300">
          <div className="stat">
            <div className="stat-figure text-error">
              <AlertTriangle size={32} />
            </div>
            <div className="stat-title">Prioridade Alta</div>
            <div className="stat-value text-error">{alertsByPriority.high}</div>
          </div>
        </div>

        <div className="stats shadow bg-base-200 border border-base-300">
          <div className="stat">
            <div className="stat-figure text-warning">
              <AlertCircle size={32} />
            </div>
            <div className="stat-title">Prioridade Média</div>
            <div className="stat-value text-warning">{alertsByPriority.medium}</div>
          </div>
        </div>

        <div className="stats shadow bg-base-200 border border-base-300">
          <div className="stat">
            <div className="stat-figure text-info">
              <Info size={32} />
            </div>
            <div className="stat-title">Prioridade Baixa</div>
            <div className="stat-value text-info">{alertsByPriority.low}</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
        >
          Todos ({data.alerts.length})
        </button>
        <button
          className={`btn btn-sm ${filter === 'high' ? 'btn-error' : 'btn-outline btn-error'}`}
          onClick={() => setFilter('high')}
        >
          Alta ({alertsByPriority.high})
        </button>
        <button
          className={`btn btn-sm ${filter === 'medium' ? 'btn-warning' : 'btn-outline btn-warning'}`}
          onClick={() => setFilter('medium')}
        >
          Média ({alertsByPriority.medium})
        </button>
        <button
          className={`btn btn-sm ${filter === 'low' ? 'btn-info' : 'btn-outline btn-info'}`}
          onClick={() => setFilter('low')}
        >
          Baixa ({alertsByPriority.low})
        </button>
      </div>

      {/* Lista de Alertas */}
      {filteredAlerts.length === 0 ? (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Nenhum alerta encontrado para este filtro!</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert, index) => (
            <div
              key={index}
              className={`alert ${
                alert.priority === 'high' ? 'alert-error' :
                alert.priority === 'medium' ? 'alert-warning' :
                'alert-info'
              } shadow-md`}
            >
              <div className="flex items-start gap-3 w-full">
                {getPriorityIcon(alert.priority)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{alert.vehicle_name}</span>
                    {getPriorityBadge(alert.priority)}
                    <span className="badge badge-ghost badge-sm">{alert.type}</span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    Data: {new Date(alert.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Informação */}
      {data.alerts.length === 0 && (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Tudo certo!</h3>
            <div className="text-xs">Não há alertas ou lembretes pendentes para seus veículos.</div>
          </div>
        </div>
      )}
    </div>
  );
}
