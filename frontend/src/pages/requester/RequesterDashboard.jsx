import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/ProminAuthContext'
import { prominApi } from '../../api/prominApi'
import { 
  Plus, 
  Briefcase, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const RequesterDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, jobsResponse, applicationsResponse] = await Promise.all([
        prominApi.dashboard.getRequesterStats(),
        prominApi.jobs.getAll({ page: 0, size: 5 }),
        prominApi.jobs.getAll({ page: 0, size: 10, status: 'OPEN' })
      ])

      setStats(statsResponse.data)
      setRecentJobs(jobsResponse.data.content || [])
      setApplications(applicationsResponse.data.content || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'text-green-600 bg-green-100'
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100'
      case 'COMPLETED':
        return 'text-gray-600 bg-gray-100'
      case 'CANCELLED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
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
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Mock data for charts
  const jobStatusData = [
    { name: 'Open', value: stats?.openJobs || 0, color: '#10b981' },
    { name: 'In Progress', value: stats?.inProgressJobs || 0, color: '#3b82f6' },
    { name: 'Completed', value: stats?.completedJobs || 0, color: '#6b7280' },
    { name: 'Cancelled', value: stats?.cancelledJobs || 0, color: '#ef4444' }
  ]

  const monthlySpendingData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1900 },
    { month: 'Mar', amount: 3000 },
    { month: 'Apr', amount: 2800 },
    { month: 'May', amount: 1890 },
    { month: 'Jun', amount: 2390 }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
        </div>
        <Link
          to="/requester/jobs/create"
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post New Job
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalJobs || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeApplications || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalSpent || 0)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.averageRating || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Monthly Spending Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySpendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                <Bar dataKey="amount" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Job Status Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-8">
          {/* Recent Jobs */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
              <Link
                to="/requester/jobs"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{job.title}</h4>
                    <p className="text-xs text-gray-600">{formatDate(job.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Applications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Applications</h3>
              <Link
                to="/requester/jobs"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {applications.slice(0, 5).map((application) => (
                <div key={application.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{application.jobTitle}</h4>
                    <span className="text-xs text-gray-500">{formatDate(application.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{application.applicantName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-900">{formatCurrency(application.proposedAmount)}</span>
                    <div className="flex space-x-1">
                      <button className="text-xs text-green-600 hover:text-green-700">Accept</button>
                      <button className="text-xs text-red-600 hover:text-red-700">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/requester/jobs/create"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 mr-3 text-primary-600" />
                <span>Post New Job</span>
              </Link>
              <Link
                to="/requester/jobs"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Briefcase className="w-5 h-5 mr-3 text-secondary-600" />
                <span>Manage Jobs</span>
              </Link>
              <Link
                to="/messages"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 mr-3 text-warning-600" />
                <span>View Messages</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequesterDashboard
