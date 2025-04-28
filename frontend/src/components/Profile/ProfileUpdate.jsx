import { useState } from "react"
import { 
  UserIcon,
  BriefcaseIcon,
  PhoneIcon,
  GlobeAltIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckCircleIcon as SuccessIcon
} from "@heroicons/react/24/outline"

const ProfileUpdate = ({ currentUser, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: currentUser?.full_name || '',
    bio: currentUser?.bio || '',
    job_title: currentUser?.job_title || '',
    phone_number: currentUser?.phone_number || '',
    time_zone: currentUser?.time_zone || 'UTC',
    date_format: currentUser?.date_format || 'MM/DD/YYYY'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real application, you would send this to your API
      // const response = await fetch('/api/users/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      //   credentials: 'include'
      // })

      // Mock successful response
      const response = { ok: true }

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeZones = [
    'UTC',
    'GMT',
    'EST',
    'PST',
    'CST',
    'IST',
    'AEST',
    'JST',
    'CET'
  ]

  const dateFormats = [
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'YYYY-MM-DD',
    'MMMM D, YYYY'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Tell us a little about yourself..."
          />
        </div>

        {/* Job Title */}
        <div>
          <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BriefcaseIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="job_title"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your professional role"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Time Zone */}
        <div>
          <label htmlFor="time_zone" className="block text-sm font-medium text-gray-700 mb-1">
            Time Zone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GlobeAltIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="time_zone"
              name="time_zone"
              value={formData.time_zone}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
            >
              {timeZones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Format */}
        <div>
          <label htmlFor="date_format" className="block text-sm font-medium text-gray-700 mb-1">
            Date Format
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PencilSquareIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="date_format"
              name="date_format"
              value={formData.date_format}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
            >
              {dateFormats.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          disabled={isSubmitting}
        >
          <XMarkIcon className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <SuccessIcon className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ProfileUpdate