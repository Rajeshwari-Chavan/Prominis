import { useEffect, useState } from 'react'
import { prominApi } from '../../api/prominApi'
import { useProminPagination } from '../../utils/useProminFetch'
import { Calendar, DollarSign } from 'lucide-react'

const MyApplicationsPage = () => {
  const { data: applications, loading, pagination, refetch } = useProminPagination(
    () => prominApi.applications.getMyApplications(),
    { page: 0, size: 10 }
  )

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-2">Track the status of your job applications</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse h-20"></div>
          ))}
        </div>
      ) : applications && applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="card">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900">{a.jobTitle || a.job?.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  a.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  a.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                  a.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {a.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>{formatCurrency(a.proposedAmount)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(a.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600">Browse jobs and submit your first application.</p>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center space-x-2">
            <button onClick={() => refetch({ page: pagination.page - 1 })} disabled={pagination.page === 0} className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <span className="text-sm text-gray-600">Page {pagination.page + 1} of {pagination.totalPages}</span>
            <button onClick={() => refetch({ page: pagination.page + 1 })} disabled={pagination.page === pagination.totalPages - 1} className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyApplicationsPage


