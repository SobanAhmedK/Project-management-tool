"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { TrashIcon, PlusIcon, SaveIcon } from "@heroicons/react/outline"

// Using path aliases
import Navbar from "@layouts/Navbar"
import Sidebar from "@layouts/Sidebar"
import { useOrganization } from "@context/OrganizationContext"
import { useNotification } from "@context/NotificationContext"

const OrganizationSettings = () => {
  const { orgId } = useParams()
  const navigate = useNavigate()
  const { getOrganization, updateOrganization, deleteOrganization, removeMember } = useOrganization()
  const { notify } = useNotification()

  const [organization, setOrganization] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    const orgData = getOrganization(orgId)
    if (orgData) {
      setOrganization(orgData)
      setFormData({
        name: orgData.name,
        description: orgData.description || "",
      })
    }
  }, [orgId, getOrganization])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updatedOrg = {
        ...organization,
        name: formData.name,
        description: formData.description,
      }

      updateOrganization(updatedOrg)
      setOrganization(updatedOrg)
      notify("Organization settings updated successfully", "success")
    } catch (error) {
      notify("Failed to update organization settings", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteOrganization = () => {
    setIsLoading(true)

    try {
      deleteOrganization(orgId)
      notify("Organization deleted successfully", "success")
      navigate("/dashboard")
    } catch (error) {
      notify("Failed to delete organization", "error")
      setIsLoading(false)
    }
  }

  const handleRemoveMember = (memberId) => {
    try {
      removeMember(orgId, memberId)

      // Update local state to reflect the change
      setOrganization({
        ...organization,
        members: organization.members.filter((member) => member.id !== memberId),
      })

      notify("Member removed successfully", "success")
    } catch (error) {
      notify("Failed to remove member", "error")
    }
  }

  if (!organization) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={`${organization.name} Settings`} />

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Organization Settings</h1>
                <button className="btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
                  Delete Organization
                </button>
              </div>

              <div className="card mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">General Information</h2>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Describe the purpose of this organization"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="btn-primary flex items-center" disabled={isLoading}>
                        <SaveIcon className="w-5 h-5 mr-1" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="card mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Members</h2>
                  <button className="btn-secondary flex items-center text-sm">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Invite Member
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {organization.members.map((member) => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                                {member.name.charAt(0)}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              className="text-sm text-gray-900 bg-transparent border-0 focus:ring-0"
                              defaultValue={member.role}
                            >
                              <option value="Admin">Admin</option>
                              <option value="Member">Member</option>
                              <option value="Viewer">Viewer</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.email || "No email provided"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Danger Zone</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete an organization, there is no going back. Please be certain.
                </p>
                <button className="btn-danger flex items-center" onClick={() => setIsDeleteModalOpen(true)}>
                  <TrashIcon className="w-5 h-5 mr-1" />
                  Delete this organization
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Organization</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete <span className="font-semibold">{organization.name}</span>? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button type="button" className="btn-danger" onClick={handleDeleteOrganization} disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default OrganizationSettings
