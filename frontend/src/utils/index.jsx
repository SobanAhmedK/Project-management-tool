import React from "react"
import { 
  CheckCircleIcon, 
  ChatBubbleBottomCenterTextIcon, 
  InformationCircleIcon 
} from "@heroicons/react/24/solid"

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return "No date"
  const d = new Date(date)
  return d.toLocaleDateString()
}

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 50) => {
  if (!str) return ""
  if (str.length <= length) return str
  return str.substring(0, length) + "..."
}

/**
 * Generate a random color
 * @returns {string} Random hex color
 */
export const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16)
}

/**
 * Group array items by a property
 * @param {Array} array - The array to group
 * @param {string} key - The property to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    ;(result[item[key]] = result[item[key]] || []).push(item)
    return result
  }, {})
}

export function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

/**
 * Get description for an activity based on its type
 * @param {Object} activity - The activity object
 * @returns {string} Activity description
 */
export const getActivityDescription = (activity) => {
  switch (activity.type) {
    case "task_completed":
      return "Task completed";
    case "comment_added":
      return "Comment added";
    // Add other cases as needed
    default:
      return "Activity occurred";
  }
}



/**
 * Get an aesthetic icon for an activity based on its type
 * @param {string} type - The activity type
 * @returns {JSX.Element} Icon representation for the activity.
 */
export const getActivityIcon = (type) => {
  switch (type) {
    case "task_completed":
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />
    case "comment_added":
      return <ChatAlt2Icon className="h-6 w-6 text-blue-500" />
    default:
      return <InformationCircleIcon className="h-6 w-6 text-gray-500" />
  }
}