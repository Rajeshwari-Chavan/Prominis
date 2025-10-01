import { useState, useEffect } from 'react'
import { prominApi } from '../../api/prominApi'
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  Users,
  Briefcase,
  DollarSign,
  Calendar
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
  Cell,
  AreaChart,
  Area
} from 'recharts'

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      const response = await prominApi.admin.getAnalytics({ period: dateRange })
      setAnalytics(response.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type) => {
    try {
      const response = await prominApi.admin.exportData(type)
      const blob = new Blob([response.data], { type: 'application/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num)
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

  const revenueData = [
    { month: 'Jan', revenue: 1200, commission: 120 },
    { month: 'Feb', revenue: 1900, commission: 190 },
    { month: 'Mar', revenue: 3000, commission: 300 },
    { month: 'Apr', revenue: 2800, commission: 280 },
    { month: 'May', revenue: 1890, commission: 189 },
    { month: 'Jun', revenue: 2390, commission: 239 }
  ]

  const jobCategoryData = [
    { name: 'Web Development', value: 35, color: '#14b8a6' },
    { name: 'Design', value: 25, color: '#6366f1' },
    { name: 'Writing', value: 20, color: '#f59e0b' },
    { name: 'Marketing', value: 15, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#6b7280' }
  ]

  const userRoleData = [
    { name: 'Requesters', value: analytics?.requesterCount || 0, color: '#14b8a6' },
    { name: 'Taskers', value: analytics?.taskerCount || 0, color: '#6366f1' },
    { name: 'Admins', value: analytics?.adminCount || 0, color: '#f59e0b' }
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Platform performance and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={() => handleExport('analytics')}
            className="btn-outline flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics?.totalUsers || 0)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+12%</span>
              </div>
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
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics?.totalJobs || 0)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+8%</span>
              </div>
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
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics?.platformRevenue || 0)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+15%</span>
              </div>
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
              <p className="text-2xl font-bold text-gray-900">+{analytics?.growthRate || 0}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User & Job Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#14b8a6" fill="#14b8a6" />
              <Area type="monotone" dataKey="jobs" stackId="2" stroke="#6366f1" fill="#6366f1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Commission</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
              <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} />
              <Line type="monotone" dataKey="commission" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Job Categories */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {jobCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Roles */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userRoleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performing Categories */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
          <div className="space-y-4">
            {jobCategoryData.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: category.color }}></div>
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{category.value}%</div>
                  <div className="text-xs text-gray-500">{formatNumber(category.value * 10)} jobs</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Job completed</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payment processed</p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New job posted</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
          <div className="space-y-3">
            <button
              onClick={() => handleExport('users')}
              className="w-full btn-outline text-sm flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Users
            </button>
            <button
              onClick={() => handleExport('jobs')}
              className="w-full btn-outline text-sm flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Jobs
            </button>
            <button
              onClick={() => handleExport('transactions')}
              className="w-full btn-outline text-sm flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Transactions
            </button>
            <button
              onClick={() => handleExport('analytics')}
              className="w-full btn-outline text-sm flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
