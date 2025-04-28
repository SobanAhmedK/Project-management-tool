import { motion } from "framer-motion"

const LoadingSpinner = ({ size = "md", color = "primary" }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  const colorClasses = {
    primary: "text-indigo-600",
    secondary: "text-gray-600",
    white: "text-white"
  }

  return (
    <div className={`inline-flex items-center justify-center ${sizeClasses[size]} ${colorClasses[color]}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className="origin-center"
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  )
}

export default LoadingSpinner