import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  UserCircleIcon, 
  PaperAirplaneIcon,
  EllipsisVerticalIcon, 
  PlusIcon, 
  EnvelopeIcon,
  VideoCameraIcon,
  ChatBubbleLeftEllipsisIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon
} from "@heroicons/react/24/outline"
import { useProject } from "@context/ProjectContext"
import { useParams } from "react-router-dom"
import { useAuth } from "@context/AuthContext"
import ConfirmModal from "@components/modals/ConfirmationModal"

const ProjectMembers = () => {
  const { projectId } = useParams()
  const { getProject } = useProject()
  const { currentUser } = useAuth()
  const project = getProject(projectId)
  const [selectedMemberId, setSelectedMemberId] = useState(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const dropdownRefs = useRef({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [modalConfig, setModalConfig] = useState({
    action: null,
    memberId: null,
    memberName: ""
  })

  // Check if current user is admin/manager
  const isAdminOrManager = project?.members?.find(m => m.id === currentUser?.id)?.role === "admin" || 
                          project?.members?.find(m => m.id === currentUser?.id)?.role === "manager"

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close dropdown if we're not clicking on a modal-related element
      if (
        event.target.closest('[data-modal-container]') || 
        event.target.closest('[data-modal-trigger]')
      ) {
        return;
      }
      
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setSelectedMemberId(null)
        }
      })
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleAddMember = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    try {
      console.log("Adding member:", newMemberEmail)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setNewMemberEmail("")
      setShowAddMember(false)
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleMemberMenu = (memberId, event) => {
    event.stopPropagation()
    setSelectedMemberId(selectedMemberId === memberId ? null : memberId)
  }

  const handleRemoveMember = async (memberId) => {
    setIsProcessing(true)
    try {
      console.log("Removing member:", memberId)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSelectedMemberId(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLeaveProject = async () => {
    setIsProcessing(true)
    try {
      console.log("Leaving project")
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSelectedMemberId(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const openConfirmationModal = (action, memberId, memberName) => {
    // Use setTimeout to separate the events and ensure the modal opens
    setTimeout(() => {
      setModalConfig({
        action,
        memberId,
        memberName
      })
      setShowConfirmModal(true)
      setSelectedMemberId(null) // Close the dropdown
    }, 50)
  }

  const handleConfirmAction = () => {
    if (modalConfig.action === 'leave') {
      handleLeaveProject()
    } else if (modalConfig.action === 'remove') {
      handleRemoveMember(modalConfig.memberId)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gradient-to-r from-cyan-50 to-indigo-50">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
          <p className="text-sm text-gray-600 mt-1">
            {project?.members?.length || 0} members in this project
          </p>
        </div>
        {isAdminOrManager && (
          <button 
            onClick={() => setShowAddMember(!showAddMember)}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isProcessing}
          >
            <UserPlusIcon className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      {/* Add Member Form */}
      <AnimatePresence>
        {showAddMember && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 overflow-hidden border-b border-gray-200 bg-gray-50"
          >
            <form onSubmit={handleAddMember} className="py-4 flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="member-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Invite by Email
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="member-email"
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-70"
                    placeholder="team@example.com"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-md hover:from-cyan-600 hover:to-indigo-700 transition-all shadow-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isProcessing || !newMemberEmail}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members List */}
      <div className="divide-y divide-gray-200 overflow-visible">
        {project?.members?.map((member) => (
          <div 
            key={member.id} 
            className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors relative group"
            ref={el => dropdownRefs.current[member.id] = el}
          >
            <div className="flex items-center min-w-0 gap-4">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-100 to-indigo-100 flex items-center justify-center">
                  <UserCircleIcon className="w-7 h-7 text-cyan-600" />
                </div>
                {(member.role === "manager" || member.role === "admin") && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full ${
                      member.role === "admin" 
                        ? "bg-purple-100 text-purple-600" 
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      <ShieldCheckIcon className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {member.full_name}
                  </h3>
                  {member.id === currentUser?.id && (
                    <span className="text-xs px-1.5 py-0.5 bg-cyan-100 text-cyan-800 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {member.email || "No email provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Communication buttons - only show if not current user */}
              {member.id !== currentUser?.id && (
                <>
                  <button 
                    className="p-2 text-gray-400 hover:text-cyan-600 transition-colors z-10 hover:bg-cyan-50 rounded-full"
                    title="Start video call"
                  >
                    <VideoCameraIcon className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors z-10 hover:bg-indigo-50 rounded-full"
                    title="Send message"
                  >
                    <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                  </button>
                </>
              )}
              
              {/* Menu button - only show if admin/manager or for current user */}
              {(isAdminOrManager || member.id === currentUser?.id) && (
                <button 
                  onClick={(e) => toggleMemberMenu(member.id, e)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors z-10"
                  aria-label="Member options"
                >
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Member Actions Dropdown */}
            <AnimatePresence>
              {selectedMemberId === member.id && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-4 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-[1000]"
                >
                  <div className="py-1">
                    {member.id === currentUser?.id ? (
                      <button 
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfirmationModal('leave', member.id, member.full_name);
                        }}
                        disabled={isProcessing}
                        data-modal-trigger="true"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                        Leave Project
                        {isProcessing && <span className="ml-2">...</span>}
                      </button>
                    ) : isAdminOrManager ? (
                      <button 
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfirmationModal('remove', member.id, member.full_name);
                        }}
                        disabled={isProcessing}
                        data-modal-trigger="true"
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Remove Member
                        {isProcessing && <span className="ml-2">...</span>}
                      </button>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {project?.members?.length === 0 && (
        <div className="p-8 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-cyan-50 to-indigo-50 flex items-center justify-center mb-4">
            <UserCircleIcon className="h-10 w-10 text-cyan-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No team members yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Invite your team members to collaborate on this project
          </p>
          {isAdminOrManager && (
            <div className="mt-6">
              <button
                onClick={() => setShowAddMember(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Invite Team Members
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
        title={modalConfig.action === 'leave' 
          ? "Leave Project?" 
          : `Remove ${modalConfig.memberName}?`}
        description={modalConfig.action === 'leave'
          ? "You will no longer have access to this project. This action cannot be undone."
          : `${modalConfig.memberName} will be removed from this project. This action cannot be undone.`}
        confirmButtonText={modalConfig.action === 'leave' 
          ? "Leave Project" 
          : "Remove Member"}
      />
    </div>
  )
}

export default ProjectMembers