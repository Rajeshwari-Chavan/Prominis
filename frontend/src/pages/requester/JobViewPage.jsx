import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { prominApi } from '../../api/prominApi'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  DollarSign, 
  Calendar, 
  MapPin,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  FileText,
  Clock
} from 'lucide-react'
import UserCard from '../../components/ui/UserCard'
import toast from 'react-hot-toast'

const JobViewPage = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobDetails()
  }, [id])

  const fetchJobDetails = async () => {
    try {
      const [jobResponse, applicationsResponse] = await Promise.all([
        prominApi.jobs.getById(id),
        prominApi.jobs.getById(id).then(job => 
          prominApi.jobs.getApplications(job.data.id)
        )
      ])
      
      setJob(jobResponse.data)
      setApplications(applicationsResponse.data)
    } catch (error) {
      console.error('Failed to fetch job details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptApplication = async (applicationId) => {
    try {
      await prominApi.jobs.acceptApplication(id, applicationId)
      toast.success('Application accepted successfully')
      fetchJobDetails()
    } catch (error) {
      toast.error('Failed to accept application')
    }
  }

  const handleRejectApplication = async (applicationId) => {
    try {
      await prominApi.jobs.rejectApplication(id, applicationId)
      toast.success('Application rejected')
      fetchJobDetails()
    } catch (error) {
      toast.error('Failed to reject application')
    }
  }

  const handleCompleteJob = async () => {
    try {
      await prominApi.jobs.complete(id)
      toast.success('Job marked as completed')
      fetchJobDetails()
    } catch (error) {
      toast.error('Failed to complete job')
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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <Link to="/requester/jobs" className="btn-primary">
            Back to Jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            to="/requester/jobs"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(job.status)}`}>
                {job.status.replace('_', ' ')}
              </span>
              <span className="text-sm text-gray-600">
                Posted {formatDate(job.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/requester/jobs/${job.id}/edit`}
            className="btn-outline flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button className="btn-danger flex items-center">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {/* Job Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(job.budget)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="font-semibold text-gray-900">{formatDate(job.deadline)}</p>
                </div>
              </div>
              {job.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{job.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Applications</p>
                  <p className="font-semibold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {job.attachments && job.attachments.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Attachments</h2>
              <div className="space-y-2">
                {job.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{attachment.name}</span>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Applications */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Applications</h2>
              <span className="text-sm text-gray-600">{applications.length} total</span>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {application.applicant.firstName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {application.applicant.firstName} {application.applicant.lastName}
                          </h4>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-warning-400 mr-1" />
                            <span className="text-sm text-gray-600">
                              {application.applicant.rating || 'No rating'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {application.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {application.proposal}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(application.proposedAmount)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {application.proposedDeadline}
                      </span>
                    </div>

                    {application.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcceptApplication(application.id)}
                          className="flex-1 btn-primary text-sm flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectApplication(application.id)}
                          className="flex-1 btn-outline text-sm flex items-center justify-center"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}

                    {application.status === 'ACCEPTED' && (
                      <div className="flex space-x-2">
                        <button className="flex-1 btn-outline text-sm flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </button>
                        {job.status === 'IN_PROGRESS' && (
                          <button
                            onClick={handleCompleteJob}
                            className="flex-1 btn-primary text-sm flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600">Applications will appear here when taskers apply for your job.</p>
              </div>
            )}
          </div>

          {/* Job Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Actions</h3>
            <div className="space-y-2">
              {job.status === 'OPEN' && (
                <button className="w-full btn-outline text-sm">
                  Pause Job
                </button>
              )}
              {job.status === 'IN_PROGRESS' && (
                <button
                  onClick={handleCompleteJob}
                  className="w-full btn-primary text-sm"
                >
                  Mark as Completed
                </button>
              )}
              <button className="w-full btn-outline text-sm">
                Duplicate Job
              </button>
              <button className="w-full btn-outline text-sm">
                Share Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobViewPage
