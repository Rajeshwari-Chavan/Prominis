import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { prominApi } from '../../api/prominApi'
import { useProminPagination } from '../../utils/useProminFetch'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  DollarSign,
  Calendar
} from 'lucide-react'
import JobCard from '../../components/ui/JobCard'

const JobListPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const {
    data: jobs,
    loading,
    pagination,
    refetch
  } = useProminPagination(
    (params) => prominApi.jobs.getAll({
      ...params,
      search: searchQuery,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      sortBy,
      sortOrder
    }),
    { page: 0, size: 12 }
  )

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ]

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'budget', label: 'Budget' },
    { value: 'title', label: 'Title' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
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

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      await prominApi.jobs.delete(jobId)
      refetch()
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600 mt-2">Manage your job postings and track applications</p>
        </div>
        <Link
          to="/requester/jobs/create"
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post New Job
        </Link>
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
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </form>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
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

      {/* Jobs Grid */}
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
      ) : jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {job.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                  {job.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {job.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="font-medium">{formatCurrency(job.budget)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Due {formatDate(job.deadline)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{job.applicationCount || 0} applications</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to={`/requester/jobs/${job.id}`}
                  className="btn-outline text-sm flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Link>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter !== 'ALL' 
              ? 'Try adjusting your search or filters'
              : 'Get started by posting your first job'
            }
          </p>
          <Link
            to="/requester/jobs/create"
            className="btn-primary"
          >
            Post Your First Job
          </Link>
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

export default JobListPage
