import { useState, useEffect } from 'react'
import { useAuth } from '../../context/ProminAuthContext'
import { prominApi } from '../../api/prominApi'
import { validateForm, profileUpdateSchema } from '../../utils/validation'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X,
  Upload,
  Star,
  Award,
  Briefcase
} from 'lucide-react'
import UploadWidget from '../../components/ui/UploadWidget'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validation = validateForm(formData, profileUpdateSchema)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    try {
      const response = await prominApi.user.updateProfile(formData)
      updateUser(response.data)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      bio: user.bio || ''
    })
    setErrors({})
    setIsEditing(false)
  }

  const handleAvatarUpload = async (file) => {
    try {
      const response = await prominApi.user.uploadAvatar(file)
      updateUser({ avatar: response.data.url })
      toast.success('Avatar updated successfully')
    } catch (error) {
      toast.error('Failed to update avatar')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-600 font-semibold text-2xl">
                      {user.firstName?.charAt(0)}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2">
                    <UploadWidget
                      onUpload={handleAvatarUpload}
                      accept="image/*"
                      maxSize={2}
                      className="w-8 h-8"
                    />
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {user.firstName} {user.lastName}
              </h2>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
              <p className="text-gray-600 mt-2">{user.email}</p>

              {/* Stats */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">{formatDate(user.createdAt)}</span>
                </div>
                
                {user.role === 'TASKER' && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-warning-400 mr-1" />
                        <span className="font-medium">{user.rating || 'No rating'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Jobs completed</span>
                      <span className="font-medium">{user.completedJobs || 0}</span>
                    </div>
                  </>
                )}

                {user.role === 'REQUESTER' && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Jobs posted</span>
                      <span className="font-medium">{user.postedJobs || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total spent</span>
                      <span className="font-medium">${user.totalSpent || 0}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-outline flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-outline flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary flex items-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`input-field ${errors.location ? 'border-red-500' : ''}`}
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className={`input-field ${errors.bio ? 'border-red-500' : ''}`}
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{user.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {user.bio && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Bio</p>
                    <p className="text-gray-900">{user.bio}</p>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member since</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
