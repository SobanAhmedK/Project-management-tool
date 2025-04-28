// src/pages/OrganizationPage/components/StatsSection.jsx
import { motion } from "framer-motion"
import { 
  UserGroupIcon,
  BriefcaseIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline"

const StatCard = ({ icon, label, value, bgColor, textColor }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
  >
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-lg ${bgColor} ${textColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  </motion.div>
)

const StatsOrganization = ({ membersCount, projectsCount, adminsCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard 
        icon={<UserGroupIcon className="w-6 h-6" />}
        label="Members"
        value={membersCount}
        bgColor="bg-indigo-50"
        textColor="text-indigo-600"
      />

      <StatCard 
        icon={<BriefcaseIcon className="w-6 h-6" />}
        label="Active Projects"
        value={projectsCount}
        bgColor="bg-emerald-50"
        textColor="text-emerald-600"
      />

      <StatCard 
        icon={<CheckBadgeIcon className="w-6 h-6" />}
        label="Admin"
        value={adminsCount}
        bgColor="bg-amber-50"
        textColor="text-amber-600"
      />
    </div>
  )
}

export default StatsOrganization