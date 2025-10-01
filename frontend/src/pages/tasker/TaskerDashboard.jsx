import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/ProminAuthContext'
import { prominApi } from '../../api/prominApi'
import { 
  Search, 
  Briefcase, 
  Star, 
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
  LineChart,
  Line
} from 'recharts'
import JobCard from '../../components/ui/JobCard'

const TaskerDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [availableJobs, setAvailableJobs] = useState([])
  const [myApplications, setMyApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, jobsResponse, applicationsResponse] = await Promise.all([
        prominApi.dashboard.getTaskerStats(),
        prominApi.jobs.search({ page: 0, size: 6, status: 'OPEN' }),
        prominApi.applications.getMyApplications()
      ])

      setStats(statsResponse.data)
      setAvailableJobs(jobsResponse.data.content || [])
      setMyApplications(applicationsResponse.data || [])
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
  const earningsData = [
    { month: 'Jan', amount: 800 },
    { month: 'Feb', amount: 1200 },
    { month: 'Mar', amount: 1500 },
    { month: 'Apr', amount: 1800 },
    { month: 'May', amount: 2200 },
    { month: 'Jun', amount: 2500 }
  ]

  const applicationStatusData = [
    { status: 'Pending', count: stats?.pendingApplications || 0 },
    { status: 'Accepted', count: stats?.acceptedApplications || 0 },
    { status: 'Completed', count: stats?.completedJobs || 0 },
    { status: 'Rejected', count: stats?.rejectedApplications || 0 }
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
          to="/tasker/jobs"
          className="btn-primary flex items-center"
        >
          <Search className="w-5 h-5 mr-2" />
          Browse Jobs
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
              <p className="text-sm font-medium text-gray-600">Jobs Applied</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalApplications || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Jobs Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.completedJobs || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalEarned || 0)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.averageRating || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Earnings Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Earnings']} />
                <Line type="monotone" dataKey="amount" stroke="#14b8a6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Application Status Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-8">
          {/* Available Jobs */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Jobs</h3>
              <Link
                to="/tasker/jobs"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {availableJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 text-sm truncate mb-1">{job.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{formatCurrency(job.budget)}</span>
                    <span>{formatDate(job.deadline)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Applications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
              <Link
                to="/tasker/applications"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {myApplications.slice(0, 5).map((application) => (
                <div key={application.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{application.jobTitle}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{formatCurrency(application.proposedAmount)}</span>
                    <span>{formatDate(application.createdAt)}</span>
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
                to="/tasker/jobs"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 mr-3 text-primary-600" />
                <span>Browse Jobs</span>
              </Link>
              <Link
                to="/tasker/applications"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Briefcase className="w-5 h-5 mr-3 text-secondary-600" />
                <span>My Applications</span>
              </Link>
              <Link
                to="/tasker/deliverables"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <CheckCircle className="w-5 h-5 mr-3 text-warning-600" />
                <span>Deliverables</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Star className="w-5 h-5 mr-3 text-green-600" />
                <span>Update Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskerDashboard
