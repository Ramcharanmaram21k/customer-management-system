import axios from 'axios'


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api'
// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error.response?.data || { message: 'Network error' })
  }
)

// Customer API functions
export const customerAPI = {
  // Create customer
  create: (customerData) => api.post('/customers', customerData),
  
  // Get all customers
  getAll: (params = {}) => api.get('/customers', { params }),
  
  // Get customer by ID
  getById: (id) => api.get(`/customers/${id}`),
  
  // Update customer
  update: (id, customerData) => api.put(`/customers/${id}`, customerData),
  
  // Delete customer
  delete: (id) => api.delete(`/customers/${id}`),
  
  // Search customers by location
  searchByLocation: (params) => api.get('/customers/search', { params })
}

// Address API functions
export const addressAPI = {
  // Create address
  create: (addressData) => api.post('/addresses', addressData),
  
  // Get addresses by customer ID
  getByCustomerId: (customerId) => api.get(`/addresses/customer/${customerId}`),
  
  // Get customers with multiple addresses
  getMultipleAddresses: () => api.get('/addresses/multiple'),
  
  // Update address
  update: (id, addressData) => api.put(`/addresses/${id}`, addressData),
  
  // Delete address
  delete: (id) => api.delete(`/addresses/${id}`)
}

export default api
