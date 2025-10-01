import { Link } from 'react-router-dom'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

const Error500Page = () => {
  const handleRefresh = () => {
    window.location.reload()
  }

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

        {/* 500 Content */}
        <div className="card">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-error-600" />
          </div>
          
          <div className="text-6xl font-bold text-error-600 mb-4">500</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Server Error</h1>
          <p className="text-gray-600 mb-8">
            Something went wrong on our end. We're working to fix this issue. 
            Please try again in a few moments or contact support if the problem persists.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              className="w-full btn-primary flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
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
              Still experiencing issues?
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="mailto:support@prominis.com"
                className="flex-1 btn-outline text-sm"
              >
                Contact Support
              </a>
              <Link
                to="/about"
                className="flex-1 btn-outline text-sm"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error500Page
