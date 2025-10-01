import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

const RatingsPage = () => {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setRatings([
        { id: 1, reviewer: 'John Doe', rating: 5, comment: 'Great work and communication!', date: new Date().toISOString() },
        { id: 2, reviewer: 'Alice Johnson', rating: 4, comment: 'Good quality, minor delays.', date: new Date().toISOString() },
      ])
      setLoading(false)
    }, 500)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ratings & Reviews</h1>
        <p className="text-gray-600 mt-2">Feedback from requesters</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse h-20"></div>
          ))}
        </div>
      ) : ratings.length > 0 ? (
        <div className="space-y-3">
          {ratings.map((r) => (
            <div key={r.id} className="card">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900">{r.reviewer}</h3>
                <div className="flex items-center">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{r.comment}</p>
              <p className="text-xs text-gray-500 mt-2">{new Date(r.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">Complete jobs to start receiving reviews.</p>
        </div>
      )}
    </div>
  )
}

export default RatingsPage


