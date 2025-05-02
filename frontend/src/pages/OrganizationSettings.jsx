import { useState, useCallback, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  TrashIcon as TrashIconV2,
  PlusIcon as PlusIconV2,
  CheckIcon as CheckIconV2,
  PencilSquareIcon as EditIconV2,
  BuildingOffice2Icon as BuildingOfficeIconV2,
  ChevronRightIcon
} from "@heroicons/react/24/outline"

import Navbar from "@layouts/Navbar"
import Sidebar from "@layouts/Sidebar"
import { useOrganization } from "@context/OrganizationContext"
import { useProject } from "@context/ProjectContext"
import { useNotification } from "@context/NotificationContext"
import ConfirmModal from "@components/modals/ConfirmationModal"
import MembersSection from "@/components/sections/OrgSettingMembers"
import InviteMemberModal from "@components/modals/InviteMemberModal"
import ProjectModal from "@components/modals/ProjectEditModal"
import ProjectsSection from "@/components/sections/OrgSettingProject"
import {useAuth} from "@context/AuthContext"

const OrganizationSettings = () => {
  const { orgId } = useParams()
  const navigate = useNavigate()
  const { getOrganization, updateOrganization, deleteOrganization, removeMember, inviteMember } = useOrganization()
  const { getProjects, addProject, updateProject, deleteProject } = useProject()
  const { notify } = useNotification()

  const [organization, setOrganization] = useState(null)
  const [projects, setProjects] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const { currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState(null)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState(null)
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const orgData = getOrganization(orgId)
        const allProjects = getProjects() || []

        // Filter and validate projects
        const orgProjects = allProjects
          .filter(project => 
            project && 
            project.organization?.id === orgId && 
            project.id && 
            project.name
          )
          .map(project => ({
            id: project.id,
            name: project.name,
            description: project.description || "",
            organization: project.organization,
            created_by: project.created_by,
            members: project.members || [],
            tasks: project.tasks || [],
          }))

        if (orgData) {
          setOrganization(orgData)
          setFormData({
            name: orgData.name,
            description: orgData.description || "",
          })
          setProjects(orgProjects)
          // Debug: Log data to verify
          console.log("Organization Data:", orgData)
          console.log("All Projects:", allProjects)
          console.log("Filtered Projects:", orgProjects)
        } else {
          console.warn("No organization data found for orgId:", orgId)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error.message, error.stack)
        notify("Failed to load organization data", "error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [orgId, getOrganization, getProjects, notify])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updatedOrg = {
        ...organization,
        name: formData.name,
        description: formData.description,
      }

      await updateOrganization(updatedOrg)
      setOrganization(updatedOrg)
      setIsEditing(false)
      notify("Organization updated successfully", "success")
    } catch (error) {
      notify("Failed to update organization", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteOrganization = async () => {
    setIsLoading(true)
    try {
      await deleteOrganization(orgId)
      notify("Organization deleted successfully", "success")
      navigate("/dashboard")
    } catch (error) {
      notify("Failed to delete organization", "error")
    } finally {
      setIsLoading(false)
      setIsDeleteModalOpen(false)
    }
  }

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(orgId, memberId)
      setOrganization({
        ...organization,
        members: organization.members.filter((member) => member.id !== memberId),
      })
      notify("Member removed successfully", "success")
    } catch (error) {
      notify("Failed to remove member", "error")
    } finally {
      setMemberToRemove(null)
    }
  }

  const handleInviteMember = useCallback(async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await inviteMember(orgId, { email: inviteEmail, role: inviteRole })
      notify("Invitation sent successfully", "success")
      setInviteEmail("")
      setInviteRole("member")
      setIsInviteModalOpen(false)
    } catch (error) {
      notify("Failed to send invitation", "error")
    } finally {
      setIsLoading(false)
    }
  }, [orgId, inviteEmail, inviteRole, inviteMember, notify])

  const openInviteModal = () => {
    setIsInviteModalOpen(true)
  }

  const handleAddProject = () => {
    setProjectToEdit(null)
    setProjectFormData({ name: "", description: "" })
    setIsProjectModalOpen(true)
  }

  const handleEditProject = (project) => {
    setProjectToEdit(project)
    setProjectFormData({
      name: project.name || "",
      description: project.description || "",
    })
    setIsProjectModalOpen(true)
  }

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      if (projectToEdit) {
        // Update existing project
        const updatedProject = {
          ...projectToEdit,
          name: projectFormData.name,
          description: projectFormData.description,
        };
        console.log("Updating project with data:", updatedProject);
        const result = await updateProject(updatedProject);
        setProjects(projects.map((p) => (p.id === result.id ? result : p)));
        notify("Project updated successfully", "success");
      } else {
        // Create new project
        if (!orgId) {
          throw new Error("Organization ID is missing");
        }
        if (!organization) {
          throw new Error("Organization data is not loaded");
        }
        
        // Create a simpler project object with required fields
        const newProject = {
          name: projectFormData.name,
          description: projectFormData.description,
          organization: {
            id: orgId,
            name: organization.name,
          },
          // Use a default user if currentUser is not properly structured
          created_by: {
            id: "current_user",
            full_name: "Current User"
          },
          members: [],
          tasks: [],
        };
        
        console.log("Creating project with data:", newProject);
        const createdProject = await addProject(newProject);
        console.log("Created project:", createdProject);
        
        if (createdProject && createdProject.id && createdProject.name) {
          setProjects([...projects, createdProject]);
          notify("Project created successfully", "success");
        } else {
          throw new Error("Invalid project data returned from addProject");
        }
      }
      
      // Reset form state
      setIsProjectModalOpen(false);
      setProjectFormData({ name: "", description: "" });
      setProjectToEdit(null);
    } catch (error) {
      console.error("Failed to create/update project:", error.message, error.stack);
      notify(`Failed to ${projectToEdit ? "update" : "create"} project: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteProject = async (projectId) => {
    setIsLoading(true)
    try {
      await deleteProject(projectId)
      setProjects(projects.filter((project) => project.id !== projectId))
      notify("Project deleted successfully", "success")
    } catch (error) {
      console.error("Failed to delete project:", error.message, error.stack)
      notify("Failed to delete project: " + error.message, "error")
    } finally {
      setIsLoading(false)
      setProjectToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <BuildingOfficeIconV2 className="w-8 h-8 text-gray-400" />
              <span className="text-gray-500">Loading organization...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <span className="text-gray-500">Organization not found</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={`${organization.name} Settings`} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Header Section */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Organization Settings</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your organization's details, members, and projects
                  </p>
                </div>
              </div>

              {/* General Information Card */}
              <motion.div 
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-5"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-2">
                      <BuildingOfficeIconV2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">General Information</h2>
                  </div>
                  {!isEditing ? (
                    <motion.button
                      className="flex items-center px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(true)}
                    >
                      <EditIconV2 className="w-4 h-4 mr-1.5" />
                      Edit
                    </motion.button>
                  ) : null}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                        required
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                        placeholder="What's this organization about?"
                        disabled={!isEditing}
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-2 pt-2">
                        <motion.button
                          type="button"
                          className="px-3 py-1 text-sm text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setIsEditing(false)
                            setFormData({
                              name: organization.name,
                              description: organization.description || ""
                            })
                          }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          className="flex items-center px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isLoading}
                        >
                          <CheckIconV2 className="w-4 h-4 mr-1.5" />
                          {isLoading ? "Saving..." : "Save Changes"}
                        </motion.button>
                      </div>
                    )}
                  </div>
                </form>
              </motion.div>

              {/* Members Section */}
              <MembersSection 
                members={organization.members} 
                onRemoveMember={setMemberToRemove}
                onInviteMember={openInviteModal}
              />

              {/* Projects Section */}
              <ProjectsSection 
                projects={projects}
                onAddProject={handleAddProject}
                onEditProject={handleEditProject}
                onDeleteProject={setProjectToDelete}
              />

              {/* Danger Zone Card */}
              <motion.div 
                className="bg-white rounded-lg shadow-sm border border-red-100 overflow-hidden"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-2">
                      <TrashIconV2 className="w-4 h-4 text-red-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Danger Zone</h2>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">
                    Once deleted, this organization and all its data will be permanently removed.
                  </p>
                  <motion.button
                    className="flex items-center px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <TrashIconV2 className="w-4 h-4 mr-1.5" />
                    Delete Organization
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Organization Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOrganization}
        title="Delete Organization"
        description={`Are you sure you want to delete "${organization.name}"? This action cannot be undone.`}
        confirmButtonText={isLoading ? "Deleting..." : "Delete Organization"}
      />

      {/* Member Removal Confirmation Modal */}
      <ConfirmModal
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={() => handleRemoveMember(memberToRemove?.id)}
        title="Remove Member"
        description={`Are you sure you want to remove ${memberToRemove?.name} from the organization?`}
        confirmButtonText="Remove Member"
      />

      {/* Project Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={() => handleDeleteProject(projectToDelete?.id)}
        title="Delete Project"
        description={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone.`}
        confirmButtonText={isLoading ? "Deleting..." : "Delete Project"}
      />

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        organizationName={organization?.name || ""}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteRole={inviteRole}
        setInviteRole={setInviteRole}
        handleInvite={handleInviteMember}
      />

      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false)
          setProjectFormData({ name: "", description: "" })
          setProjectToEdit(null)
        }}
        onSave={handleSaveProject}
        formData={projectFormData}
        setFormData={setProjectFormData}
        isEditing={!!projectToEdit}
      />
    </div>
  )
}

export default OrganizationSettings