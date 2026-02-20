import { useState, useEffect } from 'react';
import { reportService, type BudgetReport as BudgetReportData } from '../../services/api';
import { AlertCircle } from 'lucide-react';

export function BudgetReport() {
  const [data, setData] = useState<BudgetReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await reportService.getBudgetReport();
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Relatório de Orçamento</h1>

      {/* Alerta de Feature Planejada */}
      <div className="alert alert-warning shadow-lg">
        <AlertCircle size={24} />
        <div>
          <h3 className="font-bold">Funcionalidade em Desenvolvimento</h3>
          <div className="text-sm mt-1">
            <p><strong>Mensagem:</strong> {data.message}</p>
            <p className="mt-2"><strong>Nota:</strong> {data.note}</p>
          </div>
        </div>
      </div>

      {/* Informações sobre a Feature */}
      <div className="card bg-base-200 shadow-md border border-base-300">
        <div className="card-body">
          <h2 className="card-title">O que virá no Relatório de Orçamento?</h2>
          <div className="space-y-3 text-sm">
            <p>Esta funcionalidade está planejada e incluirá:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Definição de Orçamentos:</strong> Estabeleça limites de gastos mensais ou anuais por categoria
              </li>
              <li>
                <strong>Acompanhamento em Tempo Real:</strong> Visualize quanto já foi gasto vs. orçamento planejado
              </li>
              <li>
                <strong>Alertas de Limite:</strong> Receba notificações quando se aproximar ou exceder os limites
              </li>
              <li>
                <strong>Histórico de Orçamentos:</strong> Compare orçamentos planejados vs. realizados ao longo do tempo
              </li>
              <li>
                <strong>Projeções:</strong> Veja projeções de gastos baseadas no histórico
              </li>
              <li>
                <strong>Análise de Variação:</strong> Identifique onde os gastos diferem do planejado
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Próximos Passos */}
      <div className="card bg-primary text-primary-content shadow-md">
        <div className="card-body">
          <h2 className="card-title">Implementação Necessária</h2>
          <p className="text-sm">
            Para habilitar esta funcionalidade, será necessário:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm ml-4 mt-2">
            <li>Criar tabela <code className="bg-primary-content/20 px-1 rounded">budgets</code> no banco de dados</li>
            <li>Implementar endpoints de CRUD para orçamentos</li>
            <li>Desenvolver lógica de comparação orçado vs. realizado</li>
            <li>Criar interface de gerenciamento de orçamentos</li>
            <li>Implementar sistema de alertas automáticos</li>
          </ol>
        </div>
      </div>

      {/* Card de Sugestão */}
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div className="text-sm">
          <p className="font-semibold">Enquanto isso...</p>
          <p>
            Você pode usar o <strong>Extrato Detalhado</strong> e a <strong>Análise Temporal</strong> para
            acompanhar seus gastos e identificar padrões de despesas.
          </p>
        </div>
      </div>
    </div>
  );
}
