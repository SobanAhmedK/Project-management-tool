
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { XMarkIcon, UserIcon, ShieldCheckIcon, UsersIcon } from "@heroicons/react/24/outline"

const ChangeRoleModal = ({ isOpen, onClose, member, currentRole, onSave }) => {
  const [selectedRole, setSelectedRole] = useState(currentRole || "member")
  const roles = [
    { value: "admin", label: "Admin", icon: ShieldCheckIcon, description: "Full access to all organization features" },
    { value: "manager", label: "Manager", icon: UserIcon, description: "Can manage projects and members" },
    { value: "member", label: "Member", icon: UsersIcon, description: "Can view and contribute to projects" }
  ]

  useEffect(() => {
    if (member && currentRole) {
      setSelectedRole(currentRole)
    }
  }, [member, currentRole])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-indigo-50">
                  <UserIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Change Member Role</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Changing role for <span className="font-semibold text-gray-800">{member?.name}</span>
              </p>

              <div className="space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon
                  return (
                    <motion.div
                      key={role.value}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedRole === role.value
                          ? 'border-indigo-300 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRole(role.value)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedRole === role.value
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id={`role-${role.value}`}
                              name="role"
                              checked={selectedRole === role.value}
                              onChange={() => setSelectedRole(role.value)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`role-${role.value}`} className="block text-sm font-medium text-gray-800">
                              {role.label}
                            </label>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 ml-6">{role.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSave(selectedRole)
                    onClose()
                  }}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ChangeRoleModal