import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/ProminAuthContext'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell,
  Search,
  Plus
} from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileOpen(false)
  }

  const getRoleBasedLinks = () => {
    if (!user) return []
    
    const baseLinks = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Profile', path: '/profile' },
      { name: 'Messages', path: '/messages' },
    ]

    switch (user.role) {
      case 'REQUESTER':
        return [
          ...baseLinks,
          { name: 'My Jobs', path: '/requester/jobs' },
          { name: 'Create Job', path: '/requester/jobs/create' },
        ]
      case 'TASKER':
        return [
          ...baseLinks,
          { name: 'Browse Jobs', path: '/tasker/jobs' },
          { name: 'My Applications', path: '/tasker/applications' },
          { name: 'Ratings', path: '/tasker/ratings' },
        ]
      case 'ADMIN':
        return [
          ...baseLinks,
          { name: 'Users', path: '/admin/users' },
          { name: 'Jobs', path: '/admin/jobs' },
          { name: 'Analytics', path: '/admin/analytics' },
        ]
      default:
        return baseLinks
    }
  }

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gradient">Prominis</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              {getRoleBasedLinks().map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
                </button>

                {/* Quick Actions */}
                {user.role === 'REQUESTER' && (
                  <Link
                    to="/requester/jobs/create"
                    className="hidden sm:flex items-center space-x-1 btn-primary text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post Job</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {user.firstName?.charAt(0)}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.firstName}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full mt-1">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && user && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {getRoleBasedLinks().map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

