import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { prominApi } from '../../api/prominApi'
import { useProminPagination } from '../../utils/useProminFetch'
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock,
  Star,
  Users
} from 'lucide-react'
import JobCard from '../../components/ui/JobCard'

const JobBrowsePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkills, setSelectedSkills] = useState([])
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' })
  const [location, setLocation] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const availableSkills = [
    'Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing',
    'Data Analysis', 'Video Editing', 'Photography', 'Translation', 'Research',
    'Customer Service', 'Sales', 'Accounting', 'Legal', 'Consulting'
  ]

  const {
    data: jobs,
    loading,
    pagination,
    refetch
  } = useProminPagination(
    (params) => prominApi.jobs.search({
      ...params,
      search: searchQuery,
      skills: selectedSkills,
      minBudget: budgetRange.min,
      maxBudget: budgetRange.max,
      location,
      sortBy,
      sortOrder
    }),
    { page: 0, size: 12 }
  )

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'budget', label: 'Budget (High to Low)' },
    { value: 'budget_asc', label: 'Budget (Low to High)' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    refetch()
  }

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleBudgetChange = (field, value) => {
    setBudgetRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSortChange = (value) => {
    if (value === 'budget_asc') {
      setSortBy('budget')
      setSortOrder('asc')
    } else {
      setSortBy(value)
      setSortOrder('desc')
    }
    refetch()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSkills([])
    setBudgetRange({ min: '', max: '' })
    setLocation('')
    setSortBy('createdAt')
    setSortOrder('desc')
    refetch()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="text-gray-600 mt-2">Find the perfect job that matches your skills and interests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear all
              </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </form>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Skills</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableSkills.map((skill) => (
                  <label key={skill} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Budget Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={budgetRange.min}
                  onChange={(e) => handleBudgetChange('min', e.target.value)}
                  className="input-field text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={budgetRange.max}
                  onChange={(e) => handleBudgetChange('max', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Location</h3>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Apply Filters */}
            <button
              onClick={handleSearch}
              className="w-full btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-3">
          {/* Sort and Results */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {pagination?.totalElements || 0} jobs found
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy === 'budget' && sortOrder === 'asc' ? 'budget_asc' : sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input-field text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  showActions={true}
                  onView={(job) => window.location.href = `/tasker/jobs/${job.id}`}
                  onApply={(job) => window.location.href = `/tasker/jobs/${job.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center mt-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => refetch({ page: pagination.page - 1 })}
                  disabled={pagination.page === 0}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page + 1} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => refetch({ page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages - 1}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobBrowsePage
