import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/layout/Navbar"
import Sidebar from "../components/layout/Sidebar"
import { useAuth } from "../context/AuthContext"
import { useNotification } from "../context/NotificationContext"
import ProfileUpdate from "@/components/Profile/ProfileUpdate"
import ProfilePictureUpload from "@/components/Profile/ProfilePictureUpload"
import {
  UserIcon as UserIconV2,
  BriefcaseIcon as JobIcon,
  PhoneIcon as PhoneIconV2,
  SunIcon as SunIconV2,
  BellIcon as BellIconV2,
  LockClosedIcon as LockIconV2,
  EnvelopeIcon as EmailIconV2,
  GlobeAltIcon as GlobeIconV2,
  PencilSquareIcon as EditIconV2,
  XMarkIcon as CancelIconV2,
  CheckCircleIcon as SuccessIconV2,
  CalendarIcon as DateIcon,
  PhotoIcon as ImageIconV2
} from "@heroicons/react/24/outline"

const ProfileSettings = () => {
  const { currentUser, updateProfilePicture } = useAuth()
  const { notify } = useNotification()

  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isChangingProfilePicture, setIsChangingProfilePicture] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Profile Settings" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Profile Picture Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mr-3">
                    <ImageIconV2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Profile Picture</h2>
                </div>
                <button 
                  onClick={() => setIsChangingProfilePicture(!isChangingProfilePicture)}
                  className={`flex items-center text-sm px-3 py-1.5 rounded-lg ${
                    isChangingProfilePicture 
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {isChangingProfilePicture ? (
                    <>
                      <CancelIconV2 className="w-4 h-4 mr-1" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <EditIconV2 className="w-4 h-4 mr-1" />
                      Change Picture
                    </>
                  )}
                </button>
              </div>

              <div className="p-6">
                {isChangingProfilePicture ? (
                  <ProfilePictureUpload 
                    currentUser={currentUser}
                    onCancel={() => setIsChangingProfilePicture(false)}
                    onSuccess={(imageUrl) => {
                      setIsChangingProfilePicture(false)
                      updateProfilePicture(imageUrl)
                      notify("Profile picture updated successfully!", "success")
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      {currentUser?.profile_picture ? (
                        <img 
                          src={currentUser.profile_picture} 
                          alt={currentUser.full_name} 
                          className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                          <UserIconV2 className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {currentUser?.profile_picture 
                        ? "Click 'Change Picture' to update your profile picture" 
                        : "You haven't uploaded a profile picture yet"}
                    </p>
                  </div>
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
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-3">
                    <UserIconV2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center text-sm px-3 py-1.5 rounded-lg ${
                    isEditing 
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <CancelIconV2 className="w-4 h-4 mr-1" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <EditIconV2 className="w-4 h-4 mr-1" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              <div className="p-6">
                {isEditing ? (
                  <ProfileUpdate 
                    currentUser={currentUser}
                    onCancel={() => setIsEditing(false)}
                    onSuccess={() => {
                      setIsEditing(false)
                      notify("Profile updated successfully!", "success")
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <UserIconV2 className="w-4 h-4 mr-2 text-gray-400" />
                        Full Name
                      </div>
                      <div className="col-span-2 text-sm text-gray-900">{currentUser?.full_name}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <EmailIconV2 className="w-4 h-4 mr-2 text-gray-400" />
                        Email Address
                      </div>
                      <div className="col-span-2 text-sm text-gray-900">{currentUser?.email}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500 flex items-start">
                        <EditIconV2 className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                        Bio
                      </div>
                      <div className="col-span-2 text-sm text-gray-900">
                        {currentUser?.bio || <span className="text-gray-400">No bio provided</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <JobIcon className="w-4 h-4 mr-2 text-gray-400" />
                        Job Title
                      </div>
                      <div className="col-span-2 text-sm text-gray-900">
                        {currentUser?.job_title || <span className="text-gray-400">Not specified</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <PhoneIconV2 className="w-4 h-4 mr-2 text-gray-400" />
                        Phone Number
                      </div>
                      <div className="col-span-2 text-sm text-gray-900">
                        {currentUser?.phone_number || <span className="text-gray-400">Not provided</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <GlobeIconV2 className="w-4 h-4 mr-2 text-gray-400" />
                        Time Zone
                      </div>
                      <div className="col-span-2 text-sm text-gray-900">{currentUser?.time_zone}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500 flex items-center">
                        <DateIcon className="w-4 h-4 mr-2 text-gray-400" />
                        Date Format
                      </div>
                      <div className="col-span-2 text-sm text-gray-900">{currentUser?.date_format}</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Password Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                    <LockIconV2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Password</h2>
                </div>
                <button 
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className={`flex items-center text-sm px-3 py-1.5 rounded-lg ${
                    isChangingPassword 
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                      : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                  }`}
                >
                  {isChangingPassword ? (
                    <>
                      <CancelIconV2 className="w-4 h-4 mr-1" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <EditIconV2 className="w-4 h-4 mr-1" />
                      Change Password
                    </>
                  )}
                </button>
              </div>

              <div className="p-6">
                {isChangingPassword ? (
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    setIsChangingPassword(false)
                    notify("Password changed successfully!", "success")
                  }} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockIconV2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="current"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockIconV2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="new"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockIconV2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="confirm"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                      >
                        <SuccessIconV2 className="w-5 h-5 mr-2" />
                        Update Password
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center text-sm text-gray-600">
                    <LockIconV2 className="w-4 h-4 mr-2 text-gray-400" />
                    Your password was last changed on {new Date().toLocaleDateString()}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Notifications Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center mr-3">
                    <BellIconV2 className="w-5 h-5 text-pink-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Notification Preferences</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center mr-3">
                        <EmailIconV2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="email_notifications"
                        className="sr-only peer"
                        defaultChecked={currentUser?.email_notifications}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center mr-3">
                        <BellIconV2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Task Assignment Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications when assigned to tasks</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="task_assignments_notifications"
                        className="sr-only peer"
                        defaultChecked={currentUser?.task_assignments_notifications}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-md bg-yellow-50 flex items-center justify-center mr-3">
                        <SunIconV2 className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Status Change Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications when task status changes</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="status_change_notifications"
                        className="sr-only peer"
                        defaultChecked={currentUser?.status_change_notifications}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProfileSettings