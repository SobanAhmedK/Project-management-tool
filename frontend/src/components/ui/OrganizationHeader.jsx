// src/components/ui/OrganizationHeader.jsx
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { 
  UserPlusIcon, 
  Cog6ToothIcon 
} from "@heroicons/react/24/outline"

const OrganizationHeader = ({ organization, onInviteClick }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
        <p className="text-gray-600 mt-2 max-w-2xl">{organization.description}</p>
      </div>
      <motion.div className="flex flex-wrap gap-2">
        {/* Settings Button */}
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link
            to={`/organization/${organization.id}/settings`}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors hover:shadow-xs"
          >
            <Cog6ToothIcon className="w-4 h-4 text-gray-500" />
            <span>Settings</span>
          </Link>
        </motion.div>

        {/* Invite Button */}
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <button
            onClick={onInviteClick}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-cyan-50 rounded-lg text-sm font-medium text-cyan-600 hover:bg-cyan-100 transition-colors border border-cyan-100 hover:border-cyan-200"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-800 animate-pulse"></span>
            <span>Invite Member</span>
            <UserPlusIcon className="w-4 h-4 text-cyan-500" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default OrganizationHeader