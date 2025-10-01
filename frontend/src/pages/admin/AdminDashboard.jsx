import { useState, useEffect } from 'react'
import { useAuth } from '../../context/ProminAuthContext'
import { prominApi } from '../../api/prominApi'
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  UserMinus,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, usersResponse, jobsResponse] = await Promise.all([
        prominApi.dashboard.getAdminStats(),
        prominApi.admin.getUsers({ page: 0, size: 5 }),
        prominApi.admin.getAllJobs({ page: 0, size: 5 })
      ])

      setStats(statsResponse.data)
      setRecentUsers(usersResponse.data.content || [])
      setRecentJobs(jobsResponse.data.content || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
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
  const userGrowthData = [
    { month: 'Jan', users: 120, jobs: 45 },
    { month: 'Feb', users: 190, jobs: 78 },
    { month: 'Mar', users: 300, jobs: 120 },
    { month: 'Apr', users: 280, jobs: 95 },
    { month: 'May', users: 189, jobs: 67 },
    { month: 'Jun', users: 239, jobs: 89 }
  ]

  const userRoleData = [
    { name: 'Requesters', value: stats?.requesterCount || 0, color: '#14b8a6' },
    { name: 'Taskers', value: stats?.taskerCount || 0, color: '#6366f1' },
    { name: 'Admins', value: stats?.adminCount || 0, color: '#f59e0b' }
  ]

  const jobStatusData = [
    { name: 'Open', value: stats?.openJobs || 0, color: '#10b981' },
    { name: 'In Progress', value: stats?.inProgressJobs || 0, color: '#3b82f6' },
    { name: 'Completed', value: stats?.completedJobs || 0, color: '#6b7280' },
    { name: 'Cancelled', value: stats?.cancelledJobs || 0, color: '#ef4444' }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalJobs || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.platformRevenue || 0)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">+{stats?.growthRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Growth Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User & Job Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#14b8a6" strokeWidth={2} />
                <Line type="monotone" dataKey="jobs" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* User Roles Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
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
          {/* Recent Users */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
              <a
                href="/admin/users"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </a>
            </div>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {user.firstName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-xs text-gray-600">{user.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
              <a
                href="/admin/jobs"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </a>
            </div>
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 text-sm truncate mb-1">{job.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{formatCurrency(job.budget)}</span>
                    <span>{formatDate(job.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending User Verifications</p>
                  <p className="text-xs text-yellow-600">5 users waiting for approval</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">Suspicious Activity</p>
                  <p className="text-xs text-red-600">2 jobs flagged for review</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">System Health</p>
                  <p className="text-xs text-green-600">All systems operational</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href="/admin/users"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 mr-3 text-primary-600" />
                <span>Manage Users</span>
              </a>
              <a
                href="/admin/jobs"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Briefcase className="w-5 h-5 mr-3 text-secondary-600" />
                <span>Manage Jobs</span>
              </a>
              <a
                href="/admin/analytics"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <TrendingUp className="w-5 h-5 mr-3 text-warning-600" />
                <span>View Analytics</span>
              </a>
              <a
                href="/admin/audit-logs"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                <span>Audit Logs</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
