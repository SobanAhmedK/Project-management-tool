import { useState, useRef } from "react"
import { 
  UserIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  CheckCircleIcon as SuccessIcon
} from "@heroicons/react/24/outline"

const ProfilePictureUpload = ({ currentUser, onCancel, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(currentUser?.profile_picture || null)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  const handleFile = (file) => {
    if (!file) return
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB')
      return
    }
    
    setSelectedFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }
  
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }
  
  const triggerFileInput = () => {
    fileInputRef.current.click()
  }
  
  const removeImage = () => {
    setSelectedFile(null)
    setPreviewUrl(currentUser?.profile_picture || null)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedFile && !previewUrl) {
      alert('Please select an image')
      return
    }
    
    setIsUploading(true)
    
    try {
      if (selectedFile) {
        // Create FormData for file upload
        const formData = new FormData()
        formData.append('profile_picture', selectedFile)
        
        // In a real application, you would send this to your API
        // const response = await fetch('/api/users/profile/picture', {
        //   method: 'POST',
        //   body: formData,
        //   credentials: 'include'
        // })
        
        // Mock successful response
        const response = { ok: true }
        const imageUrl = URL.createObjectURL(selectedFile) // Create a temporary URL for demo
        
        if (response.ok) {
          onSuccess(imageUrl)
        }
      } else {
        // If no new file but using existing image
        onSuccess(previewUrl)
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      alert('Failed to upload profile picture')
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleRemovePicture = async () => {
    setIsUploading(true)
    
    try {
      // In a real application, you would call your API to remove the profile picture
      // const response = await fetch('/api/users/profile/picture', {
      //   method: 'DELETE',
      //   credentials: 'include'
      // })
      
      // Mock successful response
      const response = { ok: true }
      
      if (response.ok) {
        setSelectedFile(null)
        setPreviewUrl(null)
        onSuccess(null)
      }
    } catch (error) {
      console.error('Error removing profile picture:', error)
      alert('Failed to remove profile picture')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 ${
          dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50'
        } transition-colors duration-200 flex flex-col items-center justify-center`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img 
                src={previewUrl} 
                alt="Profile preview" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute bottom-0 right-0 bg-gray-900 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-90 transition-opacity"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {selectedFile ? selectedFile.name : "Current profile picture"}
            </p>
            <button
              type="button"
              onClick={triggerFileInput}
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              <PhotoIcon className="w-4 h-4 mr-1" />
              Choose a different image
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-700 font-medium mb-2">Upload Profile Picture</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Drag and drop your image here, or click to select a file
            </p>
            <button
              type="button"
              onClick={triggerFileInput}
              className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors flex items-center"
            >
              <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
              Select Image
            </button>
          </>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Supported formats: JPG, PNG, GIF</p>
        <p>Maximum file size: 5MB</p>
      </div>
      
      <div className="flex justify-between pt-2">
        {currentUser?.profile_picture && (
          <button 
            type="button"
            onClick={handleRemovePicture}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center"
            disabled={isUploading}
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Remove Picture
          </button>
        )}
        
        <div className="flex ml-auto space-x-3">
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <SuccessIcon className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePictureUpload