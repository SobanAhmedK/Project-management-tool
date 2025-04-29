import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import Navbar from "../components/layout/Navbar"
import Sidebar from "../components/layout/Sidebar"
import { motion } from "framer-motion"
import {
  UserIcon as UserIconV2,
  BriefcaseIcon as JobIcon,
  PhoneIcon as PhoneIconV2,
  EnvelopeIcon as EmailIconV2,
  GlobeAltIcon as GlobeIconV2
} from "@heroicons/react/24/outline"

// Mock user data for testing
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  job_title: "Senior Software Engineer",
  phone_number: "+1 (555) 123-4567",
  time_zone: "America/New_York",
  bio: "Passionate about building scalable web applications and mentoring junior developers.",
  profile_picture: "https://via.placeholder.com/150"
}

const UserProfile = () => {
  const { userId } = useParams()
  const { currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        if (userId === "1" || userId=== "user1" || userId === "user2" || userId === "user3") {
          // Use mock user data if userId is "1"
          setProfileUser(mockUser)
        } else if (userId) {
          // Placeholder for future API call for other user IDs
          throw new Error("User not found (API not implemented)")
        } else {
          // If no userId, show current user's profile
          setProfileUser(currentUser)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setProfileUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId, currentUser])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-gray-600">User not found</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={`${profileUser.name}'s Profile`} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Profile Header Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  {profileUser.profile_picture ? (
                    <img 
                      src={profileUser.profile_picture} 
                      alt={profileUser.full_name} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                      <UserIconV2 className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {profileUser.full_name || "User"}
                </h1>
                {profileUser.job_title && (
                  <p className="text-lg text-gray-600 mt-1">
                    {profileUser.job_title}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Profile Information Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-3">
                    <UserIconV2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-500 flex items-center">
                      <UserIconV2 className="w-4 h-4 mr-2 text-gray-400" />
                      Full Name
                    </div>
                    <div className="col-span-2 text-sm text-gray-900">
                      {profileUser.full_name || <span className="text-gray-400">Not provided</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-500 flex items-center">
                      <EmailIconV2 className="w-4 h-4 mr-2 text-gray-400" />
                      Email Address
                    </div>
                    <div className="col-span-2 text-sm text-gray-900">
                      {profileUser.email || <span className="text-gray-400">Not provided</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-500 flex items-center">
                      <JobIcon className="w-4 h-4 mr-2 text-gray-400" />
                      Job Title
                    </div>
                    <div className="col-span-2 text-sm text-gray-900">
                      {profileUser.job_title || <span className="text-gray-400">Not specified</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-500 flex items-center">
                      <PhoneIconV2 className="w-4 h-4 mr-2 text-gray-400" />
                      Phone Number
                    </div>
                    <div className="col-span-2 text-sm text-gray-900">
                      {profileUser.phone_number || <span className="text-gray-400">Not provided</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-500 flex items-center">
                      <GlobeIconV2 className="w-4 h-4 mr-2 text-gray-400" />
                      Time Zone
                    </div>
                    <div className="col-span-2 text-sm text-gray-900">
                      {profileUser.time_zone || <span className="text-gray-400">Not set</span>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Additional Info Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <GlobeIconV2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">About</h2>
                </div>
              </div>
              <div className="p-6">
                {profileUser.bio ? (
                  <p className="text-gray-700">{profileUser.bio}</p>
                ) : (
                  <p className="text-gray-400 italic">No bio provided</p>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserProfile