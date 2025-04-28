import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon, EnvelopeIcon, UserCircleIcon } from "@heroicons/react/24/outline"

const InviteMemberModal = ({ 
  isOpen, 
  onClose, 
  organizationName, 
  inviteEmail, 
  setInviteEmail, 
  inviteRole, 
  setInviteRole, 
  handleInvite 
}) => {
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
                  <UserCircleIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Invite to {organizationName}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleInvite} className="p-6">
              <div className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="member@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="mt-1">
                    <select
                      className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Send Invite
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default InviteMemberModal