"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "@layouts/Navbar"
import Sidebar from "@layouts/Sidebar"
import { useOrganization } from "@context/OrganizationContext"
import { useProject } from "@context/ProjectContext"
import { PlusIcon, UserAddIcon, CogIcon } from "@heroicons/react/outline"

const OrganizationPage = () => {
  const { orgId } = useParams()
  const { getOrganization } = useOrganization()
  const { getProjects } = useProject()
  const [organization, setOrganization] = useState(null)
  const [projects, setProjects] = useState([])
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")

  useEffect(() => {
    // Fetch organization data
    const orgData = getOrganization(orgId)
    setOrganization(orgData)

    // Fetch projects for this organization
    const allProjects = getProjects()
    const orgProjects = allProjects.filter((project) => project.organizationId === orgId)
    setProjects(orgProjects)
  }, [orgId, getOrganization, getProjects])

  const handleInvite = (e) => {
    e.preventDefault()
    // In a real app, this would send an invitation
    console.log(`Inviting ${inviteEmail} as ${inviteRole}`)
    setInviteEmail("")
    setIsInviteModalOpen(false)
  }

  if (!organization) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={organization.name} />

        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{organization.name}</h1>
                <div className="flex space-x-2">
                  {/* Add Settings button */}
                  <Link to={`/organization/${orgId}/settings`} className="btn-secondary flex items-center">
                    <CogIcon className="w-5 h-5 mr-1" />
                    Settings
                  </Link>
                  <button className="btn-primary flex items-center" onClick={() => setIsInviteModalOpen(true)}>
                    <UserAddIcon className="w-5 h-5 mr-1" />
                    Invite Member
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{organization.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Members</h2>
                  <ul className="divide-y divide-gray-200">
                    {organization.members.map((member) => (
                      <li key={member.id} className="py-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        {member.role === "Admin" && (
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Admin</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
                    <button className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
                      <PlusIcon className="w-4 h-4 mr-1" />
                      New Project
                    </button>
                  </div>

                  {projects.length > 0 ? (
                    <ul className="space-y-3">
                      {projects.map((project) => (
                        <li key={project.id} className="border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                          <Link to={`/project/${project.id}`} className="block">
                            <h3 className="text-sm font-medium text-gray-800">{project.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">{project.tasks.length} tasks</span>
                              <div className="flex -space-x-2">
                                {project.members.slice(0, 3).map((member) => (
                                  <div
                                    key={member.id}
                                    className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs border border-white"
                                    title={member.name}
                                  >
                                    {member.name.charAt(0)}
                                  </div>
                                ))}
                                {project.members.length > 3 && (
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs border border-white">
                                    +{project.members.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No projects in this organization yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Invite Member</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsInviteModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  className="input"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="input" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button type="button" className="btn-secondary" onClick={() => setIsInviteModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default OrganizationPage
