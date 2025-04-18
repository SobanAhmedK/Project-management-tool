// Create a utils directory with some helper functions

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
