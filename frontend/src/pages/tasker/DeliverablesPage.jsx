import { useState } from 'react'
import UploadWidget from '../../components/ui/UploadWidget'
import { prominApi } from '../../api/prominApi'
import toast from 'react-hot-toast'

const DeliverablesPage = () => {
  const [selectedJobId, setSelectedJobId] = useState('')
  const [files, setFiles] = useState([])

  const handleUpload = async (uploaded) => {
    setFiles(uploaded ? (Array.isArray(uploaded) ? uploaded : [uploaded]) : [])
  }

  const handleSubmit = async () => {
    if (!selectedJobId || files.length === 0) {
      toast.error('Select a job and upload at least one file')
      return
    }
    toast.success('Deliverables submitted')
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Deliverables</h1>
        <p className="text-gray-600 mt-2">Upload your work files and mark as delivered</p>
      </div>

      <div className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Job</label>
          <input className="input-field" placeholder="Enter Job ID" value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
          <UploadWidget onUpload={handleUpload} multiple={true} />
        </div>

        <div className="flex justify-end">
          <button onClick={handleSubmit} className="btn-primary">Submit Deliverables</button>
        </div>
      </div>
    </div>
  )
}

export default DeliverablesPage


