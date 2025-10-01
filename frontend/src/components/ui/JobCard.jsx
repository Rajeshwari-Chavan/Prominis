import { Link } from 'react-router-dom'
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  User, 
  Star,
  Calendar,
  Tag
} from 'lucide-react'

const JobCard = ({ job, showActions = false, onApply, onView }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
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
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {job.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {job.description}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
          {job.status.replace('_', ' ')}
        </span>
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="font-medium">${job.budget}</span>
          <span className="ml-1">budget</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>Due {formatDate(job.deadline)}</span>
        </div>

        {job.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{job.location}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>Posted by {job.requester?.firstName} {job.requester?.lastName}</span>
        </div>

        {job.requester?.rating && (
          <div className="flex items-center text-sm text-gray-600">
            <Star className="w-4 h-4 mr-2 text-warning-400" />
            <span>{job.requester.rating.toFixed(1)} ({job.requester.reviewCount} reviews)</span>
          </div>
        )}
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={skill}
                className={`px-2 py-1 text-xs font-medium rounded-full ${getSkillColor(index)}`}
              >
                <Tag className="w-3 h-3 inline mr-1" />
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium text-gray-500">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Job Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Posted {formatDate(job.createdAt)}</span>
        </div>
        {job.applicationCount > 0 && (
          <span>{job.applicationCount} applications</span>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2">
          <button
            onClick={() => onView && onView(job)}
            className="flex-1 btn-outline text-sm"
          >
            View Details
          </button>
          {job.status === 'OPEN' && (
            <button
              onClick={() => onApply && onApply(job)}
              className="flex-1 btn-primary text-sm"
            >
              Apply Now
            </button>
          )}
        </div>
      )}

      {/* Default Link */}
      {!showActions && (
        <Link
          to={`/jobs/${job.id}`}
          className="block w-full btn-primary text-center text-sm"
        >
          View Job
        </Link>
      )}
    </div>
  )
}

export default JobCard

