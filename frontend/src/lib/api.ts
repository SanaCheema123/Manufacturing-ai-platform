import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/api/auth/login', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }),
  me: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
}

// Dashboard
export const dashboardApi = {
  overview: () => api.get('/api/dashboard/overview'),
  productionMetrics: () => api.get('/api/dashboard/production-metrics'),
  qualityTrends: (days = 30) => api.get(`/api/dashboard/quality-trends?days=${days}`),
  alerts: () => api.get('/api/dashboard/alerts'),
  machineHealth: () => api.get('/api/dashboard/machine-health'),
}

// Inspection
export const inspectionApi = {
  list: () => api.get('/api/inspection/list'),
  analyze: (data: any) => api.post('/api/inspection/analyze', data),
  stats: () => api.get('/api/inspection/stats'),
}

// Defects
export const defectsApi = {
  list: (severity?: string, machine?: string) => {
    let url = '/api/defects/list'
    const params = new URLSearchParams()
    if (severity) params.append('severity', severity)
    if (machine) params.append('machine', machine)
    if (params.toString()) url += `?${params}`
    return api.get(url)
  },
  analyze: (data: any) => api.post('/api/defects/analyze', data),
  categories: () => api.get('/api/defects/categories'),
  trends: () => api.get('/api/defects/trends'),
}

// Root Cause
export const rcaApi = {
  list: () => api.get('/api/rootcause/list'),
  analyze: (data: any) => api.post('/api/rootcause/analyze', data),
}

// Maintenance
export const maintenanceApi = {
  equipmentHealth: () => api.get('/api/maintenance/equipment-health'),
  schedule: () => api.get('/api/maintenance/schedule'),
  predict: (data: any) => api.post('/api/maintenance/predict', data),
  workOrders: () => api.get('/api/maintenance/work-orders'),
}

// Reports
export const reportsApi = {
  generate: (data: any) => api.post('/api/reports/generate', data),
  list: () => api.get('/api/reports/list'),
}

// Sensors
export const sensorsApi = {
  live: () => api.get('/api/sensors/live'),
  readings: (machineId: string, hours = 24) => api.get(`/api/sensors/readings/${machineId}?hours=${hours}`),
  thresholds: () => api.get('/api/sensors/thresholds'),
}

export default api
