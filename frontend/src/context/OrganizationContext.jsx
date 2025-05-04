import { createContext, useContext, useState } from "react"

// Create context
const OrganizationContext = createContext()

// Mock organization data - in a real app, this would come from an API
const mockOrganizations = [
  {
    id: "org1",
    name: "Design Team",
    description: "The design team responsible for UI/UX",
    members: [
      { id: "user3", name: "John Doe", role: "Admin" },
      { id: "user4", name: "Jane", role: "Member" },
      { id: "user5", name: "Ailen", role: "Manager" },
      { id: "user6", name: "NOOB", role: "Member" },
      { id: "user7", name: "BOB", role: "Member" },
      { id: "user8", name: "Popye", role: "Member" },
    ],
    isActive: true,
  },
  {
    id: "org2",
    name: "Development Team",
    description: "The development team responsible for coding",
    members: [{ id: "user1", name: "John Doe", role: "Admin" }],
    isActive: true,
  },
]

export const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState(mockOrganizations)
  const [currentOrganization, setCurrentOrganization] = useState(null)

  const getOrganizations = () => {
    return organizations
  }

  const getOrganization = (orgId) => {
    return organizations.find((org) => org.id === orgId)
  }

  const addOrganization = (newOrg) => {
    // Create a new org with a generated ID
    const orgWithId = { 
      ...newOrg, 
      id: `org${Date.now()}` 
    }
    
    // Add the new org to the state
    const updatedOrganizations = [...organizations, orgWithId]
    setOrganizations(updatedOrganizations)
    
    // Return the newly created org with its assigned ID
    return orgWithId
  }

  const updateOrganization = (updatedOrg) => {
    const updatedOrganizations = organizations.map((org) => 
      (org.id === updatedOrg.id ? updatedOrg : org)
    )
    setOrganizations(updatedOrganizations)
    return updatedOrg
  }

  const deleteOrganization = (orgId) => {
    const updatedOrganizations = organizations.filter((org) => org.id !== orgId)
    setOrganizations(updatedOrganizations)
    return true
  }

  const addMember = (orgId, newMember) => {
    const updatedOrganizations = organizations.map((org) => {
      if (org.id === orgId) {
        return {
          ...org,
          members: [...org.members, newMember],
        }
      }
      return org
    })
    
    setOrganizations(updatedOrganizations)
    return updatedOrganizations.find(org => org.id === orgId)
  }

  const updateMemberRole = (orgId, memberId, newRole) => {
    const updatedOrganizations = organizations.map((org) => {
      if (org.id === orgId) {
        return {
          ...org,
          members: org.members.map((member) => 
            member.id === memberId ? { ...member, role: newRole } : member
          ),
        }
      }
      return org
    })
    
    setOrganizations(updatedOrganizations)
    return updatedOrganizations.find(org => org.id === orgId)
  }
  const setOrganization = (orgname) => {
  setCurrentOrganization(orgname)
  console.log("Current Organization:", orgname)

  }


  const removeMember = (orgId, memberId) => {
    const updatedOrganizations = organizations.map((org) => {
      if (org.id === orgId) {
        return {
          ...org,
          members: org.members.filter((member) => member.id !== memberId),
        }
      }
      return org
    })
    
    setOrganizations(updatedOrganizations)
    return updatedOrganizations.find(org => org.id === orgId)
  }

  const value = {
    organizations,
    currentOrganization,
    setOrganization,
    getOrganizations,
    getOrganization,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    addMember,
    updateMemberRole,
    removeMember,
  }

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
}

export const useOrganization = () => {
  return useContext(OrganizationContext)
}