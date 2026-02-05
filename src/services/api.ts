import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
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
    localStorage.removeItem('token')
  },

  async me() {
    const response = await api.get('/api/user')
    return response.data
  },
}

export interface EnumOption {
  value: number
  label: string
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

  async deleteVehicle(id: number) {
    const response = await api.delete(`/api/vehicles/${id}`)
    return response.data
  },
}

export default api
