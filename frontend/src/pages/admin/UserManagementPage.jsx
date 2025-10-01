import { useState, useEffect } from 'react'
import { prominApi } from '../../api/prominApi'
import { useProminPagination } from '../../utils/useProminFetch'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Shield,
  Mail,
  Calendar,
  Eye
} from 'lucide-react'
import UserCard from '../../components/ui/UserCard'

const UserManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const {
    data: users,
    loading,
    pagination,
    refetch
  } = useProminPagination(
    (params) => prominApi.admin.getUsers({
      ...params,
      search: searchQuery,
      role: roleFilter !== 'ALL' ? roleFilter : undefined,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      sortBy,
      sortOrder
    }),
    { page: 0, size: 12 }
  )

  const roleOptions = [
    { value: 'ALL', label: 'All Roles' },
    { value: 'REQUESTER', label: 'Requester' },
    { value: 'TASKER', label: 'Tasker' },
    { value: 'ADMIN', label: 'Admin' }
  ]

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'PENDING', label: 'Pending' }
  ]

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'firstName', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'lastLoginAt', label: 'Last Login' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    refetch()
  }

  const handleRoleChange = (role) => {
    setRoleFilter(role)
    refetch()
  }

  const handleStatusChange = (status) => {
    setStatusFilter(status)
    refetch()
  }

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    refetch()
  }

  const handleApproveUser = async (userId) => {
    try {
      await prominApi.admin.updateUser(userId, { status: 'ACTIVE' })
      refetch()
    } catch (error) {
      console.error('Failed to approve user:', error)
    }
  }

  const handleSuspendUser = async (userId) => {
    try {
      await prominApi.admin.updateUser(userId, { status: 'SUSPENDED' })
      refetch()
    } catch (error) {
      console.error('Failed to suspend user:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await prominApi.admin.deleteUser(userId)
      refetch()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'REQUESTER':
        return 'bg-primary-100 text-primary-800'
      case 'TASKER':
        return 'bg-secondary-100 text-secondary-800'
      case 'ADMIN':
        return 'bg-warning-100 text-warning-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage users, roles, and permissions</p>
      </div>

      {/* Filters and Search */}
      <div className="card mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </form>

          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="input-field"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="input-field"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="input-field"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleSortChange(sortBy)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : users && users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {user.firstName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Joined</span>
                  <span className="text-sm text-gray-900">{formatDate(user.createdAt)}</span>
                </div>
                {user.lastLoginAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Login</span>
                    <span className="text-sm text-gray-900">{formatDate(user.lastLoginAt)}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 btn-outline text-sm flex items-center justify-center">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                {user.status === 'PENDING' && (
                  <button
                    onClick={() => handleApproveUser(user.id)}
                    className="flex-1 btn-primary text-sm flex items-center justify-center"
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                )}
                {user.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleSuspendUser(user.id)}
                    className="flex-1 btn-warning text-sm flex items-center justify-center"
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Suspend
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center mt-8">
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
  )
}

export default UserManagementPage
