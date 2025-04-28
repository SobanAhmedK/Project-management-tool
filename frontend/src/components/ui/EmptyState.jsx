import { motion } from "framer-motion"

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  small = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center p-6 ${
        small ? "py-4" : "py-8"
      }`}
    >
      <div className={`flex items-center justify-center ${
        small ? "w-10 h-10 mb-3" : "w-16 h-16 mb-4"
      }`}>
        {icon}
      </div>
      
      <h3 className={`font-medium text-gray-900 ${
        small ? "text-base" : "text-lg"
      }`}>
        {title}
      </h3>
      
      {description && (
        <p className={`text-gray-500 mt-1 ${
          small ? "text-sm max-w-xs" : "text-base max-w-md"
        }`}>
          {description}
        </p>
      )}
      
      {action && (
        <div className={`mt-4 ${small ? "mt-3" : "mt-6"}`}>
          {action}
        </div>
      )}
    </motion.div>
  )
}

export default EmptyState