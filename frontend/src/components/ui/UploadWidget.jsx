import { useState, useRef } from 'react'
import { Upload, X, File, Image, FileText } from 'lucide-react'
import { useProminFileUpload } from '../../utils/useProminFetch'

const UploadWidget = ({ 
  onUpload, 
  accept = 'image/*,.pdf,.doc,.docx', 
  maxSize = 8,
  multiple = false,
  className = ''
}) => {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const { uploadFile, uploading, progress } = useProminFileUpload()

  const handleFiles = async (fileList) => {
    const newFiles = Array.from(fileList)
    
    // Validate files
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Upload files
    const uploadedFiles = []
    for (const file of validFiles) {
      try {
        const result = await uploadFile(file)
        uploadedFiles.push({
          id: result.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: result.url
        })
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }

    const updatedFiles = multiple ? [...files, ...uploadedFiles] : uploadedFiles
    setFiles(updatedFiles)
    
    if (onUpload) {
      onUpload(multiple ? updatedFiles : updatedFiles[0])
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    
    if (onUpload) {
      onUpload(multiple ? updatedFiles : updatedFiles[0])
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return <Image className="w-4 h-4" />
    } else if (type === 'application/pdf') {
      return <FileText className="w-4 h-4" />
    } else {
      return <File className="w-4 h-4" />
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">
              {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Maximum file size: {maxSize}MB
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-outline text-sm"
            disabled={uploading}
          >
            Choose Files
          </button>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="w-full max-w-xs">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{progress}% uploaded</p>
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
          {files.map((file, index) => (
            <div
              key={file.id || index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-400">
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UploadWidget

