import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

const Error404Page = () => {
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

        {/* 404 Content */}
        <div className="card">
          <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/"
              className="w-full btn-primary flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full btn-outline flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Still can't find what you're looking for?
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                to="/jobs"
                className="flex-1 btn-outline text-sm flex items-center justify-center"
              >
                <Search className="w-4 h-4 mr-1" />
                Browse Jobs
              </Link>
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

export default Error404Page
