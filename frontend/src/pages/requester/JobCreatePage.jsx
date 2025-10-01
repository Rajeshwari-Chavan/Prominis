import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { prominApi } from '../../api/prominApi'
import { validateForm, jobCreateSchema } from '../../utils/validation'
import { 
  Save, 
  X, 
  Plus, 
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Clock
} from 'lucide-react'
import UploadWidget from '../../components/ui/UploadWidget'
import toast from 'react-hot-toast'

const JobCreatePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    location: '',
    skills: [],
    attachments: []
  })
  const [errors, setErrors] = useState({})
  const [newSkill, setNewSkill] = useState('')

  const availableSkills = [
    'Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing',
    'Data Analysis', 'Video Editing', 'Photography', 'Translation', 'Research',
    'Customer Service', 'Sales', 'Accounting', 'Legal', 'Consulting'
  ]

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

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleFileUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, file]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validation = validateForm(formData, jobCreateSchema)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    try {
      await prominApi.jobs.create(formData)
      toast.success('Job posted successfully!')
      navigate('/requester/jobs')
    } catch (error) {
      toast.error('Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/requester/jobs')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
        <p className="text-gray-600 mt-2">Create a job posting to find the right talent for your project</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="e.g., Website Redesign, Content Writing, Logo Design"
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe the job requirements, deliverables, and any specific instructions..."
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.budget ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.deadline ? 'border-red-500' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Remote, New York, NY, United States"
              />
            </div>
          </div>
        </div>

        {/* Skills Required */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills Required</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Skills
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 input-field"
                  placeholder="Type a skill and press Enter"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="btn-outline flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </button>
              </div>
            </div>

            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Skills</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Skills */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Popular Skills</p>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      if (!formData.skills.includes(skill)) {
                        setFormData(prev => ({
                          ...prev,
                          skills: [...prev.skills, skill]
                        }))
                      }
                    }}
                    disabled={formData.skills.includes(skill)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.skills.includes(skill)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-800'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Attachments (Optional)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload any files that will help taskers understand your requirements better.
          </p>
          <UploadWidget
            onUpload={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            maxSize={8}
            multiple={true}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Post Job
          </button>
        </div>
      </form>
    </div>
  )
}

export default JobCreatePage
