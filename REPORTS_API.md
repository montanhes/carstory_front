# 📊 Moviu API - Documentação de Relatórios

Documentação completa dos endpoints de relatórios da Moviu API para integração com frontend React + Chart.js.

## 🔐 Autenticação

Todos os endpoints de relatórios requerem autenticação via Laravel Sanctum.

```javascript
// Configuração do Axios
const api = axios.create({
  baseURL: 'http://localhost/api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});
```

---

## 📋 Índice de Endpoints

### Fase 1 - Essenciais
1. [Dashboard Consolidado](#1-dashboard-consolidado)
2. [Despesas por Categoria](#2-despesas-por-categoria)
3. [Despesas por Veículo](#3-despesas-por-veículo)
4. [Extrato Detalhado](#4-extrato-detalhado)

### Fase 2 - Análise
5. [Análise Temporal](#5-análise-temporal)
6. [Análise de Combustível](#6-análise-de-combustível)
7. [Comparação entre Veículos](#7-comparação-entre-veículos)
8. [Relatório de Manutenção](#8-relatório-de-manutenção)

### Fase 3 - Avançados
9. [Relatório de Depreciação](#9-relatório-de-depreciação)
10. [Benchmark de Frota](#10-benchmark-de-frota)
11. [Alertas e Lembretes](#11-alertas-e-lembretes)
12. [Relatório de Orçamento](#12-relatório-de-orçamento)

---

## 1. Dashboard Consolidado

**Endpoint:** `GET /api/reports/dashboard`

**Descrição:** Retorna visão consolidada das despesas com comparação de períodos e evolução temporal.

### Query Parameters

| Parâmetro | Tipo | Obrigatório | Valores | Descrição |
|-----------|------|-------------|---------|-----------|
| `period` | string | Não | `monthly`, `yearly`, `all` | Período de análise (padrão: `monthly`) |
| `start_date` | string | Não | `YYYY-MM-DD` | Data inicial (sobrescreve `period`) |
| `end_date` | string | Não | `YYYY-MM-DD` | Data final (sobrescreve `period`) |
| `vehicle_id` | integer | Não | ID do veículo | Filtrar por veículo específico |

### Response

```json
{
  "total_expenses": 15847.50,
  "average_per_vehicle": 5282.50,
  "period_comparison": {
    "current": 15847.50,
    "previous": 12340.00,
    "variation_percent": 28.4
  },
  "expenses_over_time": {
    "labels": ["Jan", "Fev", "Mar"],
    "datasets": [
      {
        "label": "Despesas",
        "data": [5200, 4800, 5847.50]
      }
    ]
  },
  "vehicles_count": 3,
  "expenses_count": 47
}
```

### Exemplo React + Chart.js

```jsx
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

function DashboardReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get('/reports/dashboard', {
          params: { period: 'monthly' }
        });
        setData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Métricas */}
      <div className="metrics">
        <div className="metric">
          <span>Total de Despesas</span>
          <strong>R$ {data.total_expenses.toLocaleString('pt-BR')}</strong>
        </div>
        <div className="metric">
          <span>Média por Veículo</span>
          <strong>R$ {data.average_per_vehicle.toLocaleString('pt-BR')}</strong>
        </div>
        <div className="metric">
          <span>Variação</span>
          <strong className={data.period_comparison.variation_percent > 0 ? 'negative' : 'positive'}>
            {data.period_comparison.variation_percent.toFixed(1)}%
          </strong>
        </div>
      </div>

      {/* Gráfico */}
      <Line
        data={data.expenses_over_time}
        options={{
          responsive: true,
          plugins: {
            title: { display: true, text: 'Evolução de Despesas' }
          }
        }}
      />
    </div>
  );
}
```

---

## 2. Despesas por Categoria

**Endpoint:** `GET /api/reports/expenses/by-category`

**Descrição:** Agrupa despesas por categoria com percentuais e contagens.

### Query Parameters

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `start_date` | string | Não | Data inicial (YYYY-MM-DD) |
| `end_date` | string | Não | Data final (YYYY-MM-DD) |
| `vehicle_id` | integer | Não | Filtrar por veículo |

### Response

```json
{
  "total": 15847.50,
  "by_category": [
    {
      "category": "Combustível",
      "category_id": 1,
      "total": 8500.00,
      "percentage": 53.6,
      "count": 25
    },
    {
      "category": "Manutenção",
      "category_id": 2,
      "total": 4200.00,
      "percentage": 26.5,
      "count": 12
    }
  ],
  "chart_data": {
    "labels": ["Combustível", "Manutenção", "Seguros"],
    "datasets": [
      {
        "label": "Despesas por Categoria",
        "data": [8500, 4200, 3147.50]
      }
    ]
  }
}
```

### Exemplo React + Chart.js (Gráfico Pizza)

```jsx
import { Pie } from 'react-chartjs-2';

function ExpensesByCategoryReport() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/reports/expenses/by-category')
      .then(res => setData(res.data));
  }, []);

  if (!data) return <div>Carregando...</div>;

  // Cores para o gráfico
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
  ];

  const chartData = {
    labels: data.chart_data.labels,
    datasets: [{
      label: 'Despesas por Categoria',
      data: data.chart_data.datasets[0].data,
      backgroundColor: colors.slice(0, data.chart_data.labels.length),
      borderWidth: 2
    }]
  };

  return (
    <div>
      <h2>Despesas por Categoria</h2>
      <p>Total: R$ {data.total.toLocaleString('pt-BR')}</p>

      {/* Tabela */}
      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Total</th>
            <th>%</th>
            <th>Qtd</th>
          </tr>
        </thead>
        <tbody>
          {data.by_category.map(cat => (
            <tr key={cat.category_id}>
              <td>{cat.category}</td>
              <td>R$ {cat.total.toLocaleString('pt-BR')}</td>
              <td>{cat.percentage.toFixed(1)}%</td>
              <td>{cat.count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Gráfico Pizza */}
      <Pie data={chartData} />
    </div>
  );
}
```

---

## 3. Despesas por Veículo

**Endpoint:** `GET /api/reports/expenses/by-vehicle`

**Descrição:** Agrupa despesas por veículo com ranking e médias.

### Query Parameters

| Parâmetro | Tipo | Valores | Descrição |
|-----------|------|---------|-----------|
| `start_date` | string | YYYY-MM-DD | Data inicial |
| `end_date` | string | YYYY-MM-DD | Data final |
| `sort_by` | string | `total`, `count`, `average` | Critério de ordenação (padrão: `total`) |

### Response

```json
{
  "total": 15847.50,
  "vehicles": [
    {
      "vehicle_id": 1,
      "vehicle_name": "Toyota Corolla",
      "total_expenses": 8500.00,
      "expenses_count": 28,
      "average_expense": 303.57,
      "last_expense_date": "2026-02-10"
    }
  ],
  "chart_data": {
    "labels": ["Toyota Corolla", "Honda Civic"],
    "datasets": [
      {
        "label": "Total de Despesas",
        "data": [8500, 7347.50]
      }
    ]
  }
}
```

### Exemplo React

```jsx
import { Bar } from 'react-chartjs-2';

function ExpensesByVehicleReport() {
  const [data, setData] = useState(null);
  const [sortBy, setSortBy] = useState('total');

  useEffect(() => {
    api.get('/reports/expenses/by-vehicle', {
      params: { sort_by: sortBy }
    }).then(res => setData(res.data));
  }, [sortBy]);

  if (!data) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Despesas por Veículo</h2>

      {/* Filtro de ordenação */}
      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="total">Ordenar por Total</option>
        <option value="count">Ordenar por Quantidade</option>
        <option value="average">Ordenar por Média</option>
      </select>

      {/* Gráfico de Barras */}
      <Bar
        data={data.chart_data}
        options={{
          indexAxis: 'y', // Barras horizontais
          responsive: true
        }}
      />

      {/* Lista de veículos */}
      {data.vehicles.map(vehicle => (
        <div key={vehicle.vehicle_id} className="vehicle-card">
          <h3>{vehicle.vehicle_name}</h3>
          <p>Total: R$ {vehicle.total_expenses.toLocaleString('pt-BR')}</p>
          <p>Média: R$ {vehicle.average_expense.toFixed(2)}</p>
          <p>Despesas: {vehicle.expenses_count}</p>
          <p>Última: {new Date(vehicle.last_expense_date).toLocaleDateString('pt-BR')}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 4. Extrato Detalhado

**Endpoint:** `GET /api/reports/expenses/extract`

**Descrição:** Lista paginada e filtrada de todas as despesas com detalhes completos.

### Query Parameters

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `start_date` | string | Data inicial (YYYY-MM-DD) |
| `end_date` | string | Data final (YYYY-MM-DD) |
| `vehicle_id` | integer | Filtrar por veículo |
| `category` | integer | Filtrar por categoria (ID) |
| `expense_type` | integer | Filtrar por tipo de despesa (ID) |
| `payment_method` | integer | Filtrar por método de pagamento (ID) |
| `per_page` | integer | Itens por página (padrão: 15, máx: 100) |
| `sort_by` | string | `date` (padrão) ou `value` |
| `sort_order` | string | `desc` (padrão) ou `asc` |
| `page` | integer | Número da página |

### Response

```json
{
  "data": [
    {
      "id": 45,
      "vehicle_name": "Toyota Corolla",
      "expense_category_label": "Combustível",
      "expense_type_label": "Gasolina",
      "value": 250.00,
      "formatted_value": "R$ 250,00",
      "payment_method_label": "Cartão de Crédito",
      "expense_date": "2026-02-15",
      "odometer_mileage": 50280,
      "notes": "Posto Shell"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 47,
    "last_page": 4
  },
  "summary": {
    "total_value": 15847.50,
    "count": 47
  }
}
```

### Exemplo React com Filtros e Paginação

```jsx
function ExtractReport() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    vehicle_id: '',
    page: 1
  });

  useEffect(() => {
    api.get('/reports/expenses/extract', { params: filters })
      .then(res => setData(res.data));
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (!data) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Extrato de Despesas</h2>

      {/* Filtros */}
      <div className="filters">
        <input
          type="date"
          value={filters.start_date}
          onChange={e => handleFilterChange('start_date', e.target.value)}
          placeholder="Data inicial"
        />
        <input
          type="date"
          value={filters.end_date}
          onChange={e => handleFilterChange('end_date', e.target.value)}
          placeholder="Data final"
        />
        <select
          value={filters.vehicle_id}
          onChange={e => handleFilterChange('vehicle_id', e.target.value)}
        >
          <option value="">Todos os veículos</option>
          {/* Carregar lista de veículos */}
        </select>
      </div>

      {/* Resumo */}
      <div className="summary">
        <p>Total: R$ {data.summary.total_value.toLocaleString('pt-BR')}</p>
        <p>Despesas: {data.summary.count}</p>
      </div>

      {/* Tabela */}
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Veículo</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Pagamento</th>
            <th>KM</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map(expense => (
            <tr key={expense.id}>
              <td>{new Date(expense.expense_date).toLocaleDateString('pt-BR')}</td>
              <td>{expense.vehicle_name}</td>
              <td>{expense.expense_category_label}</td>
              <td>{expense.expense_type_label}</td>
              <td>R$ {expense.value.toLocaleString('pt-BR')}</td>
              <td>{expense.payment_method_label}</td>
              <td>{expense.odometer_mileage?.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="pagination">
        <button
          disabled={data.pagination.current_page === 1}
          onClick={() => handlePageChange(data.pagination.current_page - 1)}
        >
          Anterior
        </button>
        <span>Página {data.pagination.current_page} de {data.pagination.last_page}</span>
        <button
          disabled={data.pagination.current_page === data.pagination.last_page}
          onClick={() => handlePageChange(data.pagination.current_page + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
```

---

## 5. Análise Temporal

**Endpoint:** `GET /api/reports/temporal-analysis`

**Descrição:** Analisa despesas agrupadas por período de tempo com identificação de tendências.

### Query Parameters

| Parâmetro | Tipo | Valores | Descrição |
|-----------|------|---------|-----------|
| `group_by` | string | `day`, `week`, `month`, `quarter`, `year` | Agrupamento temporal (padrão: `month`) |
| `start_date` | string | YYYY-MM-DD | Data inicial |
| `end_date` | string | YYYY-MM-DD | Data final |
| `vehicle_id` | integer | ID | Filtrar por veículo |

### Response

```json
{
  "period": "month",
  "data": [
    {
      "period": "2025-12",
      "period_label": "Dez/25",
      "total": 4200.00,
      "count": 12,
      "average": 350.00
    },
    {
      "period": "2026-01",
      "period_label": "Jan/26",
      "total": 5800.00,
      "count": 18,
      "average": 322.22
    }
  ],
  "chart_data": {
    "labels": ["Dez/25", "Jan/26", "Fev/26"],
    "datasets": [
      {
        "label": "Despesas",
        "data": [4200, 5800, 5847.50]
      }
    ]
  },
  "trends": {
    "average_monthly": 5282.50,
    "highest_month": {
      "period": "2026-02",
      "period_label": "Fev/26",
      "value": 5847.50
    },
    "lowest_month": {
      "period": "2025-12",
      "period_label": "Dez/25",
      "value": 4200.00
    }
  }
}
```

### Exemplo React

```jsx
import { Line } from 'react-chartjs-2';

function TemporalAnalysisReport() {
  const [data, setData] = useState(null);
  const [groupBy, setGroupBy] = useState('month');

  useEffect(() => {
    api.get('/reports/temporal-analysis', {
      params: { group_by: groupBy }
    }).then(res => setData(res.data));
  }, [groupBy]);

  if (!data) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Análise Temporal</h2>

      {/* Seletor de período */}
      <select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
        <option value="day">Por Dia</option>
        <option value="week">Por Semana</option>
        <option value="month">Por Mês</option>
        <option value="quarter">Por Trimestre</option>
        <option value="year">Por Ano</option>
      </select>

      {/* Tendências */}
      <div className="trends">
        <div className="trend-card">
          <span>Média</span>
          <strong>R$ {data.trends.average_monthly.toLocaleString('pt-BR')}</strong>
        </div>
        <div className="trend-card">
          <span>Maior ({data.trends.highest_month.period_label})</span>
          <strong>R$ {data.trends.highest_month.value.toLocaleString('pt-BR')}</strong>
        </div>
        <div className="trend-card">
          <span>Menor ({data.trends.lowest_month.period_label})</span>
          <strong>R$ {data.trends.lowest_month.value.toLocaleString('pt-BR')}</strong>
        </div>
      </div>

      {/* Gráfico de linha */}
      <Line
        data={data.chart_data}
        options={{
          responsive: true,
          plugins: {
            title: { display: true, text: 'Evolução Temporal de Despesas' }
          }
        }}
      />
    </div>
  );
}
```

---

## 6. Análise de Combustível

**Endpoint:** `GET /api/reports/fuel-analysis`

**Descrição:** Análise específica de despesas com combustível por veículo e tipo.

### Query Parameters

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `start_date` | string | Data inicial (YYYY-MM-DD) |
| `end_date` | string | Data final (YYYY-MM-DD) |
| `vehicle_id` | integer | Filtrar por veículo |

### Response

```json
{
  "total_fuel_expenses": 8500.00,
  "by_vehicle": [
    {
      "vehicle_id": 1,
      "vehicle_name": "Toyota Corolla",
      "fuel_type": "Flex",
      "total_spent": 5200.00,
      "count": 18,
      "average_per_fill": 288.89
    }
  ],
  "by_fuel_type": [
    {
      "fuel_type": "Gasolina",
      "total": 5200.00,
      "count": 18,
      "average": 288.89
    },
    {
      "fuel_type": "Etanol",
      "total": 3300.00,
      "count": 15,
      "average": 220.00
    }
  ],
  "chart_data": {
    "labels": ["Toyota Corolla", "Honda Civic"],
    "datasets": [
      {
        "label": "Gastos com Combustível",
        "data": [5200, 3300]
      }
    ]
  }
}
```

---

## 7. Comparação entre Veículos

**Endpoint:** `GET /api/reports/vehicle-comparison`

**Descrição:** Compara múltiplas métricas entre veículos identificando o mais econômico.

### Query Parameters

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `start_date` | string | Data inicial |
| `end_date` | string | Data final |
| `vehicle_ids[]` | array | IDs dos veículos para comparar |

### Response

```json
{
  "vehicles": [
    {
      "vehicle_id": 1,
      "name": "Toyota Corolla",
      "fuel_type": "Flex",
      "total_expenses": 8500.00,
      "fuel_expenses": 5200.00,
      "maintenance_expenses": 2800.00,
      "average_expense": 303.57,
      "expenses_count": 28
    }
  ],
  "comparison_chart": {
    "labels": ["Toyota Corolla", "Honda Civic"],
    "datasets": [
      {
        "label": "Total",
        "data": [8500, 7347.50]
      },
      {
        "label": "Combustível",
        "data": [5200, 4500]
      },
      {
        "label": "Manutenção",
        "data": [2800, 2400]
      }
    ]
  },
  "most_economical": {
    "vehicle_id": 2,
    "name": "Honda Civic",
    "total_expenses": 7347.50
  }
}
```

---

## 8. Relatório de Manutenção

**Endpoint:** `GET /api/reports/maintenance`

**Descrição:** Análise específica de despesas com manutenção.

### Response

```json
{
  "total_maintenance": 4200.00,
  "by_vehicle": [
    {
      "vehicle_id": 1,
      "vehicle_name": "Toyota Corolla",
      "total": 2800.00,
      "count": 8,
      "last_maintenance": "2026-02-10"
    }
  ],
  "by_type": [
    {
      "type": "Troca de óleo",
      "count": 5,
      "total": 1500.00,
      "average": 300.00
    }
  ],
  "chart_data": {
    "labels": ["Troca de óleo", "Pneus", "Freios"],
    "datasets": [
      {
        "label": "Gastos com Manutenção",
        "data": [1500, 1200, 1500]
      }
    ]
  }
}
```

---

## 9. Relatório de Depreciação

**Endpoint:** `GET /api/reports/depreciation`

**Descrição:** Calcula investimento total e tempo de posse por veículo.

### Response

```json
{
  "vehicles": [
    {
      "vehicle_id": 1,
      "name": "Toyota Corolla",
      "acquisition_date": "2020-01-15",
      "acquisition_price": 50000.00,
      "total_expenses": 15847.50,
      "total_investment": 65847.50,
      "months_owned": 73
    }
  ],
  "chart_data": {
    "labels": ["Toyota Corolla"],
    "datasets": [
      {
        "label": "Valor Aquisição",
        "data": [50000]
      },
      {
        "label": "Total Investido",
        "data": [65847.50]
      }
    ]
  }
}
```

---

## 10. Benchmark de Frota

**Endpoint:** `GET /api/reports/fleet-benchmark`

**Descrição:** Análise agregada da frota completa com identificação de extremos.

### Response

```json
{
  "fleet_size": 3,
  "total_expenses": 15847.50,
  "average_per_vehicle": 5282.50,
  "most_economical": {
    "vehicle_id": 2,
    "name": "Honda Civic",
    "total": 4500.00
  },
  "most_expensive": {
    "vehicle_id": 1,
    "name": "Toyota Corolla",
    "total": 8500.00
  },
  "distribution": {
    "labels": ["Toyota Corolla", "Honda Civic", "Fiat Uno"],
    "datasets": [
      {
        "label": "Distribuição de Custos",
        "data": [8500, 4500, 2847.50]
      }
    ]
  },
  "by_category": [
    {
      "category": "Combustível",
      "total": 8500.00,
      "average_per_vehicle": 2833.33
    }
  ]
}
```

---

## 11. Alertas e Lembretes

**Endpoint:** `GET /api/reports/alerts`

**Descrição:** Retorna alertas baseados em heurísticas (manutenção atrasada, gastos elevados).

### Response

```json
{
  "alerts": [
    {
      "type": "maintenance_due",
      "priority": "high",
      "vehicle_id": 1,
      "vehicle_name": "Toyota Corolla",
      "message": "Última manutenção há 6 meses",
      "date": "2025-08-10"
    }
  ]
}
```

---

## 12. Relatório de Orçamento

**Endpoint:** `GET /api/reports/budget`

**Descrição:** ⚠️ Feature planejada - requer implementação de tabela `budgets`.

### Response

```json
{
  "message": "Relatório de orçamento requer tabela budgets",
  "note": "Feature planejada para implementação futura"
}
```

---

## 🔧 Tratamento de Erros

### Códigos de Status HTTP

| Código | Significado | Ação Recomendada |
|--------|-------------|------------------|
| `200` | Sucesso | Processar dados normalmente |
| `401` | Não autenticado | Redirecionar para login |
| `403` | Sem permissão | Mostrar mensagem de acesso negado |
| `422` | Validação falhou | Mostrar erros de validação |
| `500` | Erro no servidor | Mostrar mensagem genérica de erro |

### Exemplo de Tratamento de Erros

```jsx
async function fetchReport(endpoint, params = {}) {
  try {
    const response = await api.get(endpoint, { params });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Redirecionar para login
          window.location.href = '/login';
          break;
        case 422:
          // Erros de validação
          return {
            success: false,
            errors: error.response.data.errors
          };
        case 500:
          return {
            success: false,
            message: 'Erro no servidor. Tente novamente mais tarde.'
          };
        default:
          return {
            success: false,
            message: 'Erro desconhecido. Contate o suporte.'
          };
      }
    } else {
      // Erro de rede
      return {
        success: false,
        message: 'Erro de conexão. Verifique sua internet.'
      };
    }
  }
}
```

---

## 📊 Configuração do Chart.js

### Instalação

```bash
npm install react-chartjs-2 chart.js
```

### Setup Global

```jsx
// chartConfig.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Configurações globais
ChartJS.defaults.font.family = 'Inter, sans-serif';
ChartJS.defaults.color = '#666';

export const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          label += 'R$ ' + context.parsed.y.toLocaleString('pt-BR');
          return label;
        }
      }
    }
  }
};
```

---

## 🎨 Componente Reutilizável

```jsx
// ReportCard.jsx
import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

function ReportCard({
  title,
  endpoint,
  params = {},
  chartType = 'line',
  renderSummary
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await fetchReport(endpoint, params);

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }
    fetchData();
  }, [endpoint, JSON.stringify(params)]);

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return null;

  const ChartComponent = {
    line: Line,
    bar: Bar,
    pie: Pie
  }[chartType];

  return (
    <div className="report-card">
      <h2>{title}</h2>

      {renderSummary && renderSummary(data)}

      {data.chart_data && (
        <div className="chart-container">
          <ChartComponent
            data={data.chart_data}
            options={defaultOptions}
          />
        </div>
      )}
    </div>
  );
}

// Uso
<ReportCard
  title="Dashboard"
  endpoint="/reports/dashboard"
  params={{ period: 'monthly' }}
  chartType="line"
  renderSummary={data => (
    <div className="summary">
      <p>Total: R$ {data.total_expenses.toLocaleString('pt-BR')}</p>
      <p>Variação: {data.period_comparison.variation_percent}%</p>
    </div>
  )}
/>
```

---

## 🚀 Performance e Cache

### Estratégia de Cache

```jsx
import { useQuery } from '@tanstack/react-query';

function useDashboard(params) {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => api.get('/reports/dashboard', { params }).then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000 // 10 minutos
  });
}

// Uso
function Dashboard() {
  const { data, isLoading, error } = useDashboard({ period: 'monthly' });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return <div>{/* Renderizar dashboard */}</div>;
}
```

---

## 📱 Responsividade

### Media Queries para Gráficos

```css
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 250px;
  }
}
```

---

## ✅ Checklist de Integração

- [ ] Configurar autenticação Sanctum
- [ ] Instalar Chart.js e react-chartjs-2
- [ ] Criar componente de tratamento de erros
- [ ] Implementar loading states
- [ ] Adicionar cache com React Query
- [ ] Testar todos os endpoints
- [ ] Implementar filtros de data
- [ ] Adicionar responsividade
- [ ] Implementar export para PDF/Excel (opcional)
- [ ] Adicionar testes unitários

---

## 🐛 Debug e Troubleshooting

### Problemas Comuns

**1. Erro 401 (Não autenticado)**
```javascript
// Verificar se o token está sendo enviado
console.log(axios.defaults.headers.common['Authorization']);

// Verificar se o token está válido
await api.get('/user'); // Deve retornar 200
```

**2. Dados não aparecem**
```javascript
// Verificar response
api.get('/reports/dashboard')
  .then(res => console.log('Response:', res.data))
  .catch(err => console.error('Error:', err.response));
```

**3. Gráfico não renderiza**
```javascript
// Verificar estrutura de dados
console.log('Chart data:', data.chart_data);

// Verificar se Chart.js está registrado
import { Chart } from 'chart.js';
console.log('Registered:', Chart.registry);
```

---

## 📞 Suporte

Para dúvidas ou problemas:
- Verificar logs do Laravel: `sail artisan tail`
- Consultar CLAUDE.md do projeto
- Criar issue no repositório

---

**Documentação gerada em:** 2026-02-16
**Versão da API:** 1.0.0
**Framework:** Laravel 12 + Sanctum
