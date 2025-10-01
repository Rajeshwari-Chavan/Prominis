import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

// Custom hook for API calls with loading states and error handling
export const useProminFetch = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiCall(...args)
      setData(response.data)
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    if (dependencies.length > 0) {
      fetchData()
    }
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Hook for mutations (POST, PUT, DELETE)
export const useProminMutation = (apiCall) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiCall(...args)
      toast.success('Operation completed successfully')
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall])

  return { mutate, loading, error }
}

// Hook for paginated data
export const useProminPagination = (apiCall, initialParams = {}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  })

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiCall({
        ...initialParams,
        ...params,
        page: params.page || pagination.page,
        size: params.size || pagination.size,
      })
      
      setData(response.data.content || response.data)
      setPagination({
        page: response.data.number || 0,
        size: response.data.size || 10,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
      })
      
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiCall, initialParams, pagination.page, pagination.size])

  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages - 1) {
      fetchData({ page: pagination.page + 1 })
    }
  }, [fetchData, pagination.page, pagination.totalPages])

  const prevPage = useCallback(() => {
    if (pagination.page > 0) {
      fetchData({ page: pagination.page - 1 })
    }
  }, [fetchData, pagination.page])

  const goToPage = useCallback((page) => {
    if (page >= 0 && page < pagination.totalPages) {
      fetchData({ page })
    }
  }, [fetchData, pagination.totalPages])

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    pagination,
    refetch: fetchData,
    nextPage,
    prevPage,
    goToPage,
  }
}

// Hook for file uploads
export const useProminFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadFile = useCallback(async (file, onProgress) => {
    setUploading(true)
    setProgress(0)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem('prominis_token')
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      // Fetch API does not support progress; fallback: instant success
      setProgress(100)
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      const result = await response.json()
      toast.success('File uploaded successfully')
      return result
    } catch (err) {
      const errorMessage = err.message || 'Upload failed'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [])

  return { uploadFile, uploading, progress, error }
}

