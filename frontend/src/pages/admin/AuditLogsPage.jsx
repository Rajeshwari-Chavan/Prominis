import { useState, useEffect } from 'react'
import { prominApi } from '../../api/prominApi'
import { useProminPagination } from '../../utils/useProminFetch'
import { 
  Search, 
  Filter, 
  Calendar,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'

const AuditLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [userFilter, setUserFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const {
    data: logs,
    loading,
    pagination,
    refetch
  } = useProminPagination(
    (params) => prominApi.admin.getAuditLogs({
      ...params,
      search: searchQuery,
      action: actionFilter !== 'ALL' ? actionFilter : undefined,
      userId: userFilter,
      startDate: dateRange.start,
      endDate: dateRange.end
    }),
    { page: 0, size: 20 }
  )

  const actionOptions = [
    { value: 'ALL', label: 'All Actions' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'CREATE_JOB', label: 'Create Job' },
    { value: 'UPDATE_JOB', label: 'Update Job' },
    { value: 'DELETE_JOB', label: 'Delete Job' },
    { value: 'APPLY_JOB', label: 'Apply Job' },
    { value: 'ACCEPT_APPLICATION', label: 'Accept Application' },
    { value: 'REJECT_APPLICATION', label: 'Reject Application' },
    { value: 'COMPLETE_JOB', label: 'Complete Job' },
    { value: 'UPDATE_PROFILE', label: 'Update Profile' },
    { value: 'CHANGE_PASSWORD', label: 'Change Password' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    refetch()
  }

  const handleActionChange = (action) => {
    setActionFilter(action)
    refetch()
  }

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'LOGIN':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'LOGOUT':
        return <CheckCircle className="w-4 h-4 text-gray-600" />
      case 'CREATE_JOB':
        return <Activity className="w-4 h-4 text-blue-600" />
      case 'UPDATE_JOB':
        return <Activity className="w-4 h-4 text-yellow-600" />
      case 'DELETE_JOB':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'APPLY_JOB':
        return <Activity className="w-4 h-4 text-purple-600" />
      case 'ACCEPT_APPLICATION':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'REJECT_APPLICATION':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'COMPLETE_JOB':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'UPDATE_PROFILE':
        return <User className="w-4 h-4 text-blue-600" />
      case 'CHANGE_PASSWORD':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default:
        return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN':
        return 'bg-green-100 text-green-800'
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-800'
      case 'CREATE_JOB':
        return 'bg-blue-100 text-blue-800'
      case 'UPDATE_JOB':
        return 'bg-yellow-100 text-yellow-800'
      case 'DELETE_JOB':
        return 'bg-red-100 text-red-800'
      case 'APPLY_JOB':
        return 'bg-purple-100 text-purple-800'
      case 'ACCEPT_APPLICATION':
        return 'bg-green-100 text-green-800'
      case 'REJECT_APPLICATION':
        return 'bg-red-100 text-red-800'
      case 'COMPLETE_JOB':
        return 'bg-green-100 text-green-800'
      case 'UPDATE_PROFILE':
        return 'bg-blue-100 text-blue-800'
      case 'CHANGE_PASSWORD':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-2">Monitor system activity and user actions</p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </form>

          {/* Action Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={actionFilter}
              onChange={(e) => handleActionChange(e.target.value)}
              className="input-field"
            >
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Filter */}
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="User ID"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className="input-field"
            />
            <span className="text-gray-600">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              className="btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                  </tr>
                ))
              ) : logs && logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getActionIcon(log.action)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                          {log.action.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {log.user?.firstName?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {log.user?.firstName} {log.user?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{log.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.details}</div>
                      {log.resourceId && (
                        <div className="text-sm text-gray-500">Resource ID: {log.resourceId}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(log.timestamp)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {pagination.page * pagination.size + 1} to{' '}
              {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
              {pagination.totalElements} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => refetch({ page: pagination.page - 1 })}
                disabled={pagination.page === 0}
                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page + 1} of {pagination.totalPages}
              </span>
              <button
                onClick={() => refetch({ page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages - 1}
                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditLogsPage
