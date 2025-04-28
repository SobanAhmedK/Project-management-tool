import { useState, useEffect } from "react";
import { 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  DocumentTextIcon,
  ClockIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { useProject } from "@context/ProjectContext";
import ConfirmModal from "@components/modals/ConfirmationModal";

const ProjectSettings = ({ project }) => {
  const { updateProject } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState(project?.name || "");
  const [projectDescription, setProjectDescription] = useState(project?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(project || {});

  // Update local state when project prop changes
  useEffect(() => {
    if (project) {
      setCurrentProject(project);
      setProjectName(project.name || "");
      setProjectDescription(project.description || "");
    }
  }, [project]);

  // Format date as Month Day, Year
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If we're currently editing and trying to cancel, confirm first
      setShowConfirmModal(true);
    } else {
      // Start editing
      setIsEditing(true);
      // Make sure we're using the latest values
      setProjectName(currentProject.name || "");
      setProjectDescription(currentProject.description || "");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProjectName(currentProject.name || "");
    setProjectDescription(currentProject.description || "");
    setShowConfirmModal(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create updated project object with all required fields
      const updatedProject = {
        ...currentProject,
        name: projectName,
        description: projectDescription
      };
      
      // Update project with new values
      // The context expects the entire project object, not just the changed fields
      updateProject(updatedProject);
      
      // Update local state with the new project data
      setCurrentProject(updatedProject);
      
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-cyan-50 to-indigo-50">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Project Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your project details and settings
          </p>
        </div>
        {!isEditing ? (
          <button 
            onClick={handleEditToggle}
            type="button"
            className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Edit Project</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button 
              onClick={handleEditToggle}
              type="button"
              className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-all duration-200 focus:outline-none"
              disabled={isSubmitting}
            >
              <XMarkIcon className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button 
              onClick={handleSubmit}
              type="button"
              className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <CheckIcon className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
          {/* Project Name */}
          <div className="mb-6">
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            {isEditing ? (
              <input
                type="text"
                id="project-name"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                required
                disabled={isSubmitting}
              />
            ) : (
              <div className="text-gray-900 font-medium text-lg">{currentProject.name}</div>
            )}
          </div>
          
          {/* Project Description */}
          <div className="mb-8">
            <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
              Project Description
            </label>
            {isEditing ? (
              <textarea
                id="project-description"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 min-h-[120px]"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Enter project description"
                disabled={isSubmitting}
              />
            ) : (
              <div className="text-gray-700 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 border border-gray-100">
                {currentProject.description || "No description provided."}
              </div>
            )}
          </div>

          {/* Project Information */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Project Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Created On</div>
                  <div className="text-sm text-gray-700 font-medium">
                    {currentProject.created_at ? formatDate(currentProject.created_at) : "Unknown date"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Team Members</div>
                  <div className="text-sm text-gray-700 font-medium">
                    {currentProject.members?.length || 0} members
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Tasks</div>
                  <div className="text-sm text-gray-700 font-medium">
                    {currentProject.tasks?.length || 0} tasks
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleCancel}
        title="Discard Changes?"
        description="You have unsaved changes that will be lost if you cancel. Are you sure you want to discard these changes?"
        confirmButtonText="Discard Changes"
      />
    </div>
  );
};

export default ProjectSettings;