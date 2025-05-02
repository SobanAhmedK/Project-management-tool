import { useState, useEffect } from "react";
import { useProject } from "@context/ProjectContext";
import { useAuth } from "@context/AuthContext";
import { useOrganization } from "@context/OrganizationContext";
import { XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";              

const AddProjectModal = ({ orgId, isOpen, onClose }) => {
  const { addProject } = useProject();
  const { getOrganization } = useOrganization();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { currentUser } = useAuth();
  const [userOrgRole, setUserOrgRole] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Get user's role in the organization
  useEffect(() => {
    if (orgId && currentUser) {
      try {
        const organization = getOrganization(orgId);
        if (organization) {
          const member = organization.members.find(m => m.id === currentUser.id);
          if (member) {
            setUserOrgRole(member.role);
          } else {
            // User is not a member of this organization
            setUserOrgRole("Member"); // Default role if not found
          }
        }
      } catch (error) {
        console.error("Error getting user's role in organization:", error);
        setUserOrgRole("Member"); // Default fallback role
      }
    }
  }, [orgId, currentUser, getOrganization]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addProject({
        ...formData,
        organization: { id: orgId },
        created_by: {
          id: currentUser.id,
          full_name: currentUser.name,
          email: currentUser.email || "unknown@example.com"
        },
        members: [{ 
          id: currentUser.id, 
          full_name: currentUser.name, 
          role: userOrgRole || "Member" // Use the fetched role or default to "Member"
        }],
        tasks: [],
      });
      onClose();
      setFormData({ name: "", description: "" });
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 500 }
    },
    exit: { opacity: 0, y: 20 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
        >
          <motion.div
            variants={modalVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/10">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Create New Project
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="e.g. Website Redesign"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="Brief description of the project..."
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all ${
                    isSubmitting || !formData.name
                      ? "bg-emerald-400 dark:bg-emerald-500 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  }`}
                  disabled={isSubmitting || !formData.name}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Project"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddProjectModal;