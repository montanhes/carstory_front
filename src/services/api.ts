import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})


export const apiService = {
  async get(url: string, config?: any) {
    const response = await api.get(url, config)
    return response.data
  },

  async post(url: string, data?: any, config?: any) {
    const response = await api.post(url, data, config)
    return response.data
  },

  async put(url: string, data?: any, config?: any) {
    const response = await api.put(url, data, config)
    return response.data
  },

  async delete(url: string, config?: any) {
    const response = await api.delete(url, config)
    return response.data
  },

  async patch(url: string, data?: any, config?: any) {
    const response = await api.patch(url, data, config)
    return response.data
  },
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  disabled_at: string | null
  created_at: string
  updated_at: string
}

export const authService = {
  async getCsrfToken() {
    await api.get('/sanctum/csrf-cookie')
  },

  async login(email: string, password: string, remember: boolean = false) {
    await this.getCsrfToken()
    const response = await api.post('/api/login', { email, password, remember })
    return response.data
  },

  async logout() {
    await api.post('/api/logout')
  },

  async me() {
    const response = await api.get('/api/user')
    return response.data
  },
}

export interface EnumOption {
  value: number
  label: string
  category_id?: number // Para filtrar tipos por categoria
}

export interface ExpenseType {
  id: number
  label: string
}

export interface ExpenseCategoryWithTypes {
  id: number
  label: string
  types: ExpenseType[]
}

export const enumService = {
  async getBodyTypes(): Promise<EnumOption[]> {
    const response = await api.get('/api/enums/body-types')
    return response.data
  },

  async getFuelTypes(): Promise<EnumOption[]> {
    const response = await api.get('/api/enums/fuel-types')
    return response.data
  },

  async getTransmissionTypes(): Promise<EnumOption[]> {
    const response = await api.get('/api/enums/transmission-types')
    return response.data
  },

  async getExpenseCategories(): Promise<EnumOption[]> {
    const response = await api.get('/api/enums/expense-categories')
    return response.data
  },

  async getExpenseTypes(): Promise<EnumOption[]> {
    const response = await api.get('/api/enums/expense-types')
    return response.data
  },

  async getExpenseCategoriesWithTypes(): Promise<ExpenseCategoryWithTypes[]> {
    const response = await api.get('/api/enums/expense-categories-with-types')
    return response.data
  },

  async getPaymentMethods(): Promise<EnumOption[]> {
    const response = await api.get('/api/enums/payment-methods')
    return response.data
  },
}

export interface Vehicle {
  id: number
  name: string
  make: string
  model: string
  manufacturing_year: number
  model_year: number
  color: string
  license_plate: string | null
  fuel_label: string | null
  transmission_label: string | null
  formatted_acquisition_date: string | null
  formatted_initial_mileage: string
  created_at: string
}

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    const response = await api.get('/api/vehicles')
    return response.data
  },

  async createVehicle(data: any) {
    const response = await api.post('/api/vehicles', data)
    return response.data
  },

  async updateVehicle(id: number, data: any) {
    const response = await api.put(`/api/vehicles/${id}`, data)
    return response.data
  },

  async showVehicle(id: number): Promise<Vehicle> {
    const response = await api.get(`/api/vehicles/${id}`)
    return response.data
  },

  async deleteVehicle(id: number) {
    const response = await api.delete(`/api/vehicles/${id}`)
    return response.data
  },
}

export interface VehicleExpense {
  id: number
  vehicle_id: number
  user_id: number
  expense_category: number
  expense_type: number
  value: number
  payment_method: number
  expense_date: string
  odometer_mileage: number | null
  invoice_number: string | null
  receipt_attached: boolean
  is_recurring: boolean
  notes: string | null
  formatted_value: string
  expense_category_label: string
  expense_type_label: string
  payment_method_label: string
  formatted_expense_date: string
  formatted_odometer_mileage: string | null
  created_at: string
  updated_at: string
}

export interface ExpenseFilters {
  category?: number
  type?: number
  payment_method?: number
  date_from?: string
  date_to?: string
  value_from?: number
  value_to?: number
  is_recurring?: boolean
  receipt_attached?: boolean
  sort_by?: 'expense_date' | 'value' | 'odometer_mileage' | 'created_at'
  sort_direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export interface PaginatedResponse<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    page: number | null
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export const expenseService = {
  async getExpenses(vehicleId: number, filters?: ExpenseFilters): Promise<PaginatedResponse<VehicleExpense>> {
    const params = new URLSearchParams()

    if (filters) {
      if (filters.category) params.append('category', filters.category.toString())
      if (filters.type) params.append('type', filters.type.toString())
      if (filters.payment_method) params.append('payment_method', filters.payment_method.toString())
      if (filters.date_from) params.append('date_from', filters.date_from)
      if (filters.date_to) params.append('date_to', filters.date_to)
      if (filters.value_from !== undefined) params.append('value_from', filters.value_from.toString())
      if (filters.value_to !== undefined) params.append('value_to', filters.value_to.toString())
      if (filters.is_recurring !== undefined) params.append('is_recurring', filters.is_recurring.toString())
      if (filters.receipt_attached !== undefined) params.append('receipt_attached', filters.receipt_attached.toString())
      if (filters.sort_by) params.append('sort_by', filters.sort_by)
      if (filters.sort_direction) params.append('sort_direction', filters.sort_direction)
      if (filters.per_page) params.append('per_page', filters.per_page.toString())
      if (filters.page) params.append('page', filters.page.toString())
    }

    const queryString = params.toString()
    const url = `/api/vehicles/${vehicleId}/expenses${queryString ? `?${queryString}` : ''}`
    const response = await api.get(url)
    return response.data
  },

  async createExpense(vehicleId: number, data: any): Promise<VehicleExpense> {
    const response = await api.post(`/api/vehicles/${vehicleId}/expenses`, data)
    return response.data
  },

  async showExpense(vehicleId: number, expenseId: number): Promise<VehicleExpense> {
    const response = await api.get(`/api/vehicles/${vehicleId}/expenses/${expenseId}`)
    return response.data
  },

  async updateExpense(vehicleId: number, expenseId: number, data: any): Promise<VehicleExpense> {
    const response = await api.put(`/api/vehicles/${vehicleId}/expenses/${expenseId}`, data)
    return response.data
  },

  async deleteExpense(vehicleId: number, expenseId: number) {
    const response = await api.delete(`/api/vehicles/${vehicleId}/expenses/${expenseId}`)
    return response.data
  },
}

// Interfaces de Relatórios
export interface DashboardReport {
  total_expenses: number;
  average_per_vehicle: number;
  period_comparison: {
    current: number;
    previous: number;
    variation_percent: number;
  };
  expenses_over_time: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
  vehicles_count: number;
  expenses_count: number;
}

export interface ExpensesByCategory {
  total: number;
  by_category: Array<{
    category: string;
    category_id: number;
    total: number;
    percentage: number;
    count: number;
  }>;
  chart_data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
}

export interface ExpensesByVehicle {
  total: number;
  vehicles: Array<{
    vehicle_id: number;
    vehicle_name: string;
    total_expenses: number;
    expenses_count: number;
    average_expense: number;
    last_expense_date: string;
  }>;
  chart_data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
}

export interface ExpensesExtract {
  data: Array<{
    id: number;
    vehicle_name: string;
    expense_category_label: string;
    expense_type_label: string;
    value: number;
    formatted_value: string;
    payment_method_label: string;
    expense_date: string;
    odometer_mileage: number | null;
    notes: string | null;
  }>;
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  summary: {
    total_value: number;
    count: number;
  };
}

export interface ReportFilters {
  period?: 'monthly' | 'yearly' | 'all';
  start_date?: string;
  end_date?: string;
  vehicle_id?: number;
  category?: number;
  expense_type?: number;
  payment_method?: number;
  per_page?: number;
  page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  group_by?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  vehicle_ids?: number[];
}

// Fase 2 - Interfaces
export interface TemporalAnalysis {
  period: string;
  data: Array<{
    period: string;
    period_label: string;
    total: number;
    count: number;
    average: number;
  }>;
  chart_data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
  trends: {
    average_monthly: number;
    highest_month: {
      period: string;
      period_label: string;
      value: number;
    };
    lowest_month: {
      period: string;
      period_label: string;
      value: number;
    };
  };
}

export interface FuelAnalysis {
  total_fuel_expenses: number;
  by_vehicle: Array<{
    vehicle_id: number;
    vehicle_name: string;
    fuel_type: string;
    total_spent: number;
    count: number;
    average_per_fill: number;
  }>;
  by_fuel_type: Array<{
    fuel_type: string;
    total: number;
    count: number;
    average: number;
  }>;
  chart_data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
}

export interface VehicleComparison {
  vehicles: Array<{
    vehicle_id: number;
    name: string;
    fuel_type: string;
    total_expenses: number;
    fuel_expenses: number;
    maintenance_expenses: number;
    average_expense: number;
    expenses_count: number;
  }>;
  comparison_chart: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
  most_economical: {
    vehicle_id: number;
    name: string;
    total_expenses: number;
  };
}

export interface MaintenanceReport {
  total_maintenance: number;
  by_vehicle: Array<{
    vehicle_id: number;
    vehicle_name: string;
    total: number;
    count: number;
    last_maintenance: string;
  }>;
  by_type: Array<{
    type: string;
    count: number;
    total: number;
    average: number;
  }>;
  chart_data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
}

// Fase 3 - Interfaces
export interface DepreciationReport {
  vehicles: Array<{
    vehicle_id: number;
    name: string;
    acquisition_date: string;
    acquisition_price: number;
    total_expenses: number;
    total_investment: number;
    months_owned: number;
  }>;
  chart_data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
}

export interface FleetBenchmark {
  fleet_size: number;
  total_expenses: number;
  average_per_vehicle: number;
  most_economical: {
    vehicle_id: number;
    name: string;
    total: number;
  };
  most_expensive: {
    vehicle_id: number;
    name: string;
    total: number;
  };
  distribution: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
  by_category: Array<{
    category: string;
    total: number;
    average_per_vehicle: number;
  }>;
}

export interface AlertsReport {
  alerts: Array<{
    type: string;
    priority: 'high' | 'medium' | 'low';
    vehicle_id: number;
    vehicle_name: string;
    message: string;
    date: string;
  }>;
}

export interface BudgetReport {
  message: string;
  note: string;
}

// Report Service
export const reportService = {
  async getDashboard(filters?: ReportFilters): Promise<DashboardReport> {
    const params = new URLSearchParams();
    if (filters?.period) params.append('period', filters.period);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.vehicle_id) params.append('vehicle_id', filters.vehicle_id.toString());

    const query = params.toString();
    const response = await api.get(`/api/reports/dashboard${query ? `?${query}` : ''}`);
    return response.data;
  },

  async getExpensesByCategory(filters?: ReportFilters): Promise<ExpensesByCategory> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.vehicle_id) params.append('vehicle_id', filters.vehicle_id.toString());

    const query = params.toString();
    const response = await api.get(`/api/reports/expenses/by-category${query ? `?${query}` : ''}`);
    return response.data;
  },

  async getExpensesByVehicle(filters?: ReportFilters): Promise<ExpensesByVehicle> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);

    const query = params.toString();
    const response = await api.get(`/api/reports/expenses/by-vehicle${query ? `?${query}` : ''}`);
    return response.data;
  },

  async getExpensesExtract(filters?: ReportFilters): Promise<ExpensesExtract> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.vehicle_id) params.append('vehicle_id', filters.vehicle_id.toString());
    if (filters?.category) params.append('category', filters.category.toString());
    if (filters?.expense_type) params.append('expense_type', filters.expense_type.toString());
    if (filters?.payment_method) params.append('payment_method', filters.payment_method.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);

    const query = params.toString();
    const response = await api.get(`/api/reports/expenses/extract${query ? `?${query}` : ''}`);
    return response.data;
  },

  // Fase 2 - Métodos
  async getTemporalAnalysis(filters?: ReportFilters): Promise<TemporalAnalysis> {
    const params = new URLSearchParams();
    if (filters?.group_by) params.append('group_by', filters.group_by);
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.vehicle_id) params.append('vehicle_id', filters.vehicle_id.toString());

    const query = params.toString();
    const response = await api.get(`/api/reports/temporal-analysis${query ? `?${query}` : ''}`);
    return response.data;
  },

  async getFuelAnalysis(filters?: ReportFilters): Promise<FuelAnalysis> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.vehicle_id) params.append('vehicle_id', filters.vehicle_id.toString());

    const query = params.toString();
    const response = await api.get(`/api/reports/fuel-analysis${query ? `?${query}` : ''}`);
    return response.data;
  },

  async getVehicleComparison(filters?: ReportFilters): Promise<VehicleComparison> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.vehicle_ids) {
      filters.vehicle_ids.forEach(id => params.append('vehicle_ids[]', id.toString()));
    }

    const query = params.toString();
    const response = await api.get(`/api/reports/vehicle-comparison${query ? `?${query}` : ''}`);
    return response.data;
  },

  async getMaintenanceReport(filters?: ReportFilters): Promise<MaintenanceReport> {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.vehicle_id) params.append('vehicle_id', filters.vehicle_id.toString());

    const query = params.toString();
    const response = await api.get(`/api/reports/maintenance${query ? `?${query}` : ''}`);
    return response.data;
  },

  // Fase 3 - Métodos
  async getDepreciationReport(): Promise<DepreciationReport> {
    const response = await api.get('/api/reports/depreciation');
    return response.data;
  },

  async getFleetBenchmark(): Promise<FleetBenchmark> {
    const response = await api.get('/api/reports/fleet-benchmark');
    return response.data;
  },

  async getAlertsReport(): Promise<AlertsReport> {
    const response = await api.get('/api/reports/alerts');
    return response.data;
  },

  async getBudgetReport(): Promise<BudgetReport> {
    const response = await api.get('/api/reports/budget');
    return response.data;
  }
};

export default api
