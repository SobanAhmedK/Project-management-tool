
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@layouts/Navbar"
import Sidebar from "@layouts/Sidebar"
import { useOrganization } from "@context/OrganizationContext"
import { useProject } from "@context/ProjectContext"
import LoadingSpinner from "@components/ui/LoadingSpinner"
import OrganizationHeader from "@/components/ui/OrganizationHeader"
import StatsSection from "@/components/ui/StatsOrganization"
import MembersCard from "@/components/sections/OrgMembersSection"
import ProjectsCard from "@/components/sections/OrgProjectsSection"
import InviteMemberModal from "@components/modals/InviteMemberModal"
import ConfirmModal from "@components/modals/ConfirmationModal"
import ChangeRoleModal from "@components/modals/ChangeRoleModal"
import OrganizationNotFound from "@/components/ui/OrganizationNotFound"

const OrganizationPage = () => {
  const { orgId } = useParams()
  const { getOrganization, updateMemberRole, removeMember } = useOrganization()
  const { getProjects } = useProject()
  const [organization, setOrganization] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState({
    inviteMember: false,
    changeRole: false,
    currentMember: null
  })
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "member"
  })
  const [memberToDelete, setMemberToDelete] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const orgData = getOrganization(orgId)
        const allProjects = getProjects()
        
        const orgProjects = allProjects.filter(
          project => project.organization.id === orgId
        )
        
        setOrganization(orgData)
        setProjects(orgProjects)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [orgId, getOrganization, getProjects])

  const handleInvite = (e) => {
    e.preventDefault()
    console.log(`Inviting ${inviteData.email} as ${inviteData.role}`)
    setInviteData({ email: "", role: "member" })
    setModalState({ ...modalState, inviteMember: false })
  }

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await updateMemberRole(orgId, memberId, newRole)
      // Refresh organization data
      setOrganization(getOrganization(orgId))
    } catch (error) {
      console.error("Failed to update role:", error)
    }
  }

  const handleMemberDelete = async (memberId) => {
    try {
      await removeMember(orgId, memberId)
      // Refresh organization data
      setOrganization(getOrganization(orgId))
    } catch (error) {
      console.error("Failed to delete member:", error)
    } finally {
      setMemberToDelete(null)
    }
  }

  const openInviteMemberModal = () => {
    setModalState(prev => ({ ...prev, inviteMember: true }))
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!organization) {
    return <OrganizationNotFound />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={organization.name} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <OrganizationHeader 
                organization={organization} 
                onInviteClick={openInviteMemberModal} 
              />

              <StatsSection 
                membersCount={organization.members.length} 
                projectsCount={projects.length} 
                adminsCount={organization.members.filter(m => m.role === 'Admin').length} 
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MembersCard 
                  members={organization.members} 
                  onMenuAction={(action, member) => {
                    if (action === 'delete') {
                      setMemberToDelete(member)
                    } else {
                      setModalState({
                        ...modalState,
                        currentMember: member,
                        changeRole: true
                      })
                    }
                  }}
                />
                <ProjectsCard projects={projects} orgId={orgId} />
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <InviteMemberModal 
        isOpen={modalState.inviteMember}
        onClose={() => setModalState(prev => ({ ...prev, inviteMember: false }))}
        organizationName={organization?.name || ""}
        inviteEmail={inviteData.email}
        setInviteEmail={(email) => setInviteData(prev => ({ ...prev, email }))}
        inviteRole={inviteData.role}
        setInviteRole={(role) => setInviteData(prev => ({ ...prev, role }))}
        handleInvite={handleInvite}
      />

      <ChangeRoleModal
        isOpen={modalState.changeRole}
        onClose={() => setModalState(prev => ({ ...prev, changeRole: false }))}
        member={modalState.currentMember}
        currentRole={modalState.currentMember?.role}
        onSave={(newRole) => {
          if (modalState.currentMember) {
            handleRoleChange(modalState.currentMember.id, newRole)
            setModalState(prev => ({ ...prev, changeRole: false }))
          }
        }}
      />

      {/* Member Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={() => handleMemberDelete(memberToDelete?.id)}
        title="Remove Member"
        description={`Are you sure you want to remove ${memberToDelete?.name} from ${organization.name}?`}
        confirmButtonText="Remove Member"
      />
    </div>
  )
}

export default OrganizationPage