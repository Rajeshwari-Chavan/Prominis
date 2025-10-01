import { Link } from 'react-router-dom'
import { Shield, Home, LogIn } from 'lucide-react'

const Error401Page = () => {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="text-3xl font-bold text-gradient">Prominis</span>
        </div>

        {/* 401 Content */}
        <div className="card">
          <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-warning-600" />
          </div>
          
          <div className="text-6xl font-bold text-warning-600 mb-4">401</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. 
            Please sign in with the correct account or contact support if you believe this is an error.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full btn-primary flex items-center justify-center"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
            <Link
              to="/"
              className="w-full btn-outline flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Need help accessing your account?
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                to="/forgot-password"
                className="flex-1 btn-outline text-sm"
              >
                Reset Password
              </Link>
              <Link
                to="/register"
                className="flex-1 btn-outline text-sm"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error401Page
