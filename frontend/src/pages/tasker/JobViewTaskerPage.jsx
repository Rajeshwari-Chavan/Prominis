import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { prominApi } from '../../api/prominApi'
import { ArrowLeft, DollarSign, Calendar, MapPin, Tag, FileText, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const JobViewTaskerPage = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [proposal, setProposal] = useState('')
  const [amount, setAmount] = useState('')
  const [deadline, setDeadline] = useState('')

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await prominApi.jobs.getById(id)
        setJob(res.data)
      } catch (e) {
        toast.error('Failed to load job')
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const handleApply = async (e) => {
    e.preventDefault()
    try {
      await prominApi.jobs.apply(id, {
        proposal,
        proposedAmount: parseFloat(amount),
        proposedDeadline: deadline,
      })
      toast.success('Application submitted')
    } catch (e) {
      toast.error('Failed to submit application')
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
          <Link to="/tasker/jobs" className="btn-primary">
            Back to Jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/tasker/jobs" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>{formatCurrency(job.budget)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
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
                  <p className="font-semibold text-gray-900">{new Date(job.deadline).toLocaleDateString()}</p>
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
            </div>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span key={s} className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                    <Tag className="w-3 h-3 inline mr-1" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.attachments && job.attachments.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Attachments</h2>
              <div className="space-y-2">
                {job.attachments.map((a, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{a.name}</span>
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700">Download</a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply to this job</h3>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proposal</label>
                <textarea className="input-field" rows={5} value={proposal} onChange={(e) => setProposal(e.target.value)} placeholder="Describe your approach and experience..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Amount (USD)</label>
                <input type="number" className="input-field" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Deadline</label>
                <input type="date" className="input-field" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center">
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobViewTaskerPage


