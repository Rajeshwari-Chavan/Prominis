import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prominis_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('prominis_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const prominApi = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    verify: () => api.get('/auth/verify'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  },

  // User endpoints
  user: {
    getProfile: () => api.get('/user/profile'),
    updateProfile: (data) => api.put('/user/profile', data),
    uploadAvatar: (file) => {
      const formData = new FormData()
      formData.append('file', file)
      return api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    changePassword: (data) => api.put('/user/password', data),
    deleteAccount: () => api.delete('/user'),
  },

  // Job endpoints
  jobs: {
    getAll: (params) => api.get('/jobs', { params }),
    getById: (id) => api.get(`/jobs/${id}`),
    create: (data) => api.post('/jobs', data),
    update: (id, data) => api.put(`/jobs/${id}`, data),
    delete: (id) => api.delete(`/jobs/${id}`),
    search: (params) => api.get('/jobs/search', { params }),
    apply: (id, data) => api.post(`/jobs/${id}/apply`, data),
    acceptApplication: (jobId, applicationId) => api.post(`/jobs/${jobId}/applications/${applicationId}/accept`),
    rejectApplication: (jobId, applicationId) => api.post(`/jobs/${jobId}/applications/${applicationId}/reject`),
    complete: (id) => api.post(`/jobs/${id}/complete`),
    rate: (id, data) => api.post(`/jobs/${id}/rate`, data),
    getApplications: (id, params) => api.get(`/jobs/${id}/applications`, { params }),
  },

  // Application endpoints
  applications: {
    getMyApplications: () => api.get('/applications'),
    getApplicationById: (id) => api.get(`/applications/${id}`),
    updateApplication: (id, data) => api.put(`/applications/${id}`, data),
    withdrawApplication: (id) => api.delete(`/applications/${id}`),
  },

  // File endpoints
  files: {
    upload: (file) => {
      const formData = new FormData()
      formData.append('file', file)
      return api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    download: (id) => api.get(`/files/${id}/download`, { responseType: 'blob' }),
    delete: (id) => api.delete(`/files/${id}`),
  },

  // Admin endpoints
  admin: {
    getUsers: (params) => api.get('/admin/users', { params }),
    getUserById: (id) => api.get(`/admin/users/${id}`),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getAllJobs: (params) => api.get('/admin/jobs', { params }),
    deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
    flagJob: (id) => api.post(`/admin/jobs/${id}/flag`),
    getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
    getAnalytics: (params) => api.get('/admin/analytics', { params }),
    exportData: (type) => api.get(`/admin/export/${type}`, { responseType: 'blob' }),
  },

  // Dashboard endpoints
  dashboard: {
    getRequesterStats: () => api.get('/dashboard/requester'),
    getTaskerStats: () => api.get('/dashboard/tasker'),
    getAdminStats: () => api.get('/dashboard/admin'),
  },

  // Message endpoints
  messages: {
    getConversations: () => api.get('/messages'),
    getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
    sendMessage: (data) => api.post('/messages', data),
    markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  },

  // Notification endpoints
  notifications: {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
  },
}

export default api

