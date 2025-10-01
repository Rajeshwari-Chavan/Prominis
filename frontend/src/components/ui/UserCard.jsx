import { Link } from 'react-router-dom'
import { 
  Star, 
  MapPin, 
  Calendar,
  Briefcase,
  Award,
  MessageCircle
} from 'lucide-react'

const UserCard = ({ user, showActions = false, onMessage, onView }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }

  const getRoleColor = (role) => {
    switch (role) {
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

  const getSkillColor = (index) => {
    const colors = [
      'bg-primary-100 text-primary-800',
      'bg-secondary-100 text-secondary-800',
      'bg-warning-100 text-warning-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-primary-600 font-semibold text-xl">
            {user.firstName?.charAt(0)}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{user.email}</p>
          
          {user.location && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{user.location}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Rating and Stats */}
      {user.role === 'TASKER' && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-warning-400 mr-1" />
              <span className="font-medium text-gray-900">
                {user.rating ? user.rating.toFixed(1) : 'No rating'}
              </span>
              <span className="text-gray-500 text-sm ml-1">
                ({user.reviewCount || 0} reviews)
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {user.completedJobs || 0} jobs completed
            </div>
          </div>
          
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={skill}
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getSkillColor(index)}`}
                >
                  {skill}
                </span>
              ))}
              {user.skills.length > 4 && (
                <span className="px-2 py-1 text-xs font-medium text-gray-500">
                  +{user.skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Requester Stats */}
      {user.role === 'REQUESTER' && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <div className="font-medium text-gray-900">{user.postedJobs || 0}</div>
                <div className="text-gray-500">Jobs Posted</div>
              </div>
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <div className="font-medium text-gray-900">{user.completedJobs || 0}</div>
                <div className="text-gray-500">Jobs Completed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bio */}
      {user.bio && (
        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-3">{user.bio}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2">
          <button
            onClick={() => onView && onView(user)}
            className="flex-1 btn-outline text-sm"
          >
            View Profile
          </button>
          <button
            onClick={() => onMessage && onMessage(user)}
            className="flex-1 btn-primary text-sm flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </button>
        </div>
      )}

      {/* Default Link */}
      {!showActions && (
        <Link
          to={`/users/${user.id}`}
          className="block w-full btn-primary text-center text-sm"
        >
          View Profile
        </Link>
      )}
    </div>
  )
}

export default UserCard

