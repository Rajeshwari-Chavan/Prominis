import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/ProminAuthContext'
import { 
  LayoutDashboard,
  User,
  MessageSquare,
  Settings,
  Briefcase,
  Plus,
  Search,
  FileText,
  Star,
  Users,
  BarChart3,
  Shield,
  FileCheck,
  Activity
} from 'lucide-react'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const getNavigationItems = () => {
    if (!user) return []

    const baseItems = [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'Messages', path: '/messages', icon: MessageSquare },
      { name: 'Settings', path: '/settings', icon: Settings },
    ]

    switch (user.role) {
      case 'REQUESTER':
        return [
          ...baseItems,
          { name: 'My Jobs', path: '/requester/jobs', icon: Briefcase },
          { name: 'Create Job', path: '/requester/jobs/create', icon: Plus },
        ]
      case 'TASKER':
        return [
          ...baseItems,
          { name: 'Browse Jobs', path: '/tasker/jobs', icon: Search },
          { name: 'My Applications', path: '/tasker/applications', icon: FileText },
          { name: 'Deliverables', path: '/tasker/deliverables', icon: FileCheck },
          { name: 'Ratings', path: '/tasker/ratings', icon: Star },
        ]
      case 'ADMIN':
        return [
          ...baseItems,
          { name: 'User Management', path: '/admin/users', icon: Users },
          { name: 'Job Management', path: '/admin/jobs', icon: Briefcase },
          { name: 'Audit Logs', path: '/admin/audit-logs', icon: Shield },
          { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        ]
      default:
        return baseItems
    }
  }

  const getRoleColor = () => {
    switch (user?.role) {
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

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'REQUESTER':
        return Briefcase
      case 'TASKER':
        return User
      case 'ADMIN':
        return Shield
      default:
        return User
    }
  }

  const RoleIcon = getRoleIcon()

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto scrollbar-hide">
      <div className="p-6">
        {/* User Info */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-lg">
                {user?.firstName?.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <div className="flex items-center space-x-2">
                <RoleIcon className="w-4 h-4" />
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor()}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {getNavigationItems().map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Quick Stats */}
        {user && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h4>
            <div className="space-y-2">
              {user.role === 'REQUESTER' && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jobs Posted</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Jobs</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-medium">$2,450</span>
                  </div>
                </>
              )}
              {user.role === 'TASKER' && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jobs Applied</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jobs Completed</span>
                    <span className="font-medium">6</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">4.8★</span>
                  </div>
                </>
              )}
              {user.role === 'ADMIN' && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Users</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Jobs</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-medium">$45,678</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar

