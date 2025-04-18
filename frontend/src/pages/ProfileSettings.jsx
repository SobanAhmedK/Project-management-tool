"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/layout/Navbar"
import Sidebar from "../components/layout/Sidebar"
import { useAuth } from "../context/AuthContext"
import { useNotification } from "../context/NotificationContext"

const ProfileSettings = () => {
  const { currentUser } = useAuth()
  const { notify } = useNotification()

  const [profile, setProfile] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "",
    timezone: currentUser?.timezone || "UTC",
    notifications: {
      email: true,
      browser: true,
      mobile: false,
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value,
    })
  }

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        [name]: checked,
      },
    })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswords({
      ...passwords,
      [name]: value,
    })
  }

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    notify("Profile updated successfully!", "success")
    setIsEditing(false)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()

    // Validate passwords
    if (passwords.new !== passwords.confirm) {
      notify("New passwords do not match", "error")
      return
    }

    // In a real app, this would update the password
    notify("Password changed successfully!", "success")
    setIsChangingPassword(false)
    setPasswords({
      current: "",
      new: "",
      confirm: "",
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Profile Settings" />

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="card mb-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                  <button className="btn-secondary text-sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="input"
                        value={profile.name}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="input"
                        value={profile.email}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        name="bio"
                        rows="3"
                        className="input"
                        value={profile.bio}
                        onChange={handleProfileChange}
                        placeholder="Tell us about yourself"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                      <select name="timezone" className="input" value={profile.timezone} onChange={handleProfileChange}>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      </select>
                    </div>

                    <div className="flex justify-end">
                      <button className="btn-primary" onClick={handleSaveProfile}>
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500">Full Name</div>
                      <div className="col-span-2 text-sm text-gray-900">{profile.name}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500">Email Address</div>
                      <div className="col-span-2 text-sm text-gray-900">{profile.email}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500">Bio</div>
                      <div className="col-span-2 text-sm text-gray-900">{profile.bio || "No bio provided."}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-500">Timezone</div>
                      <div className="col-span-2 text-sm text-gray-900">{profile.timezone}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card mb-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Password</h2>
                  <button className="btn-secondary text-sm" onClick={() => setIsChangingPassword(!isChangingPassword)}>
                    {isChangingPassword ? "Cancel" : "Change Password"}
                  </button>
                </div>

                {isChangingPassword ? (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        name="current"
                        className="input"
                        value={passwords.current}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        name="new"
                        className="input"
                        value={passwords.new}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirm"
                        className="input"
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="btn-primary">
                        Update Password
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-sm text-gray-600">
                    Your password was last changed on {new Date().toLocaleDateString()}.
                  </p>
                )}
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="email"
                        className="sr-only peer"
                        checked={profile.notifications.email}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Browser Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="browser"
                        className="sr-only peer"
                        checked={profile.notifications.browser}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Mobile Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications on your mobile device</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="mobile"
                        className="sr-only peer"
                        checked={profile.notifications.mobile}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
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
