"use client"

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
      { id: "user1", name: "John Doe", role: "Admin" },
      { id: "user2", name: "Jane Smith", role: "Member" },
      { id: "user2", name: "Jane Smith", role: "Member" },
      { id: "user2", name: "Jane Smith", role: "Member" },
      { id: "user2", name: "Jane Smith", role: "Member" },
      { id: "user2", name: "Jane Smith", role: "Member" },
    ],
  },
  {
    id: "org2",
    name: "Development Team",
    description: "The development team responsible for coding",
    members: [{ id: "user1", name: "John Doe", role: "Admin" }],
  },
]

export const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState(mockOrganizations)

  const getOrganizations = () => {
    return organizations
  }

  const getOrganization = (orgId) => {
    return organizations.find((org) => org.id === orgId)
  }

  const addOrganization = (newOrg) => {
    setOrganizations([...organizations, { ...newOrg, id: Date.now().toString() }])
  }

  const updateOrganization = (updatedOrg) => {
    setOrganizations(organizations.map((org) => (org.id === updatedOrg.id ? updatedOrg : org)))
  }

  const deleteOrganization = (orgId) => {
    setOrganizations(organizations.filter((org) => org.id !== orgId))
  }

  const addMember = (orgId, newMember) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === orgId) {
          return {
            ...org,
            members: [...org.members, newMember],
          }
        }
        return org
      }),
    )
  }

  const updateMember = (orgId, updatedMember) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === orgId) {
          return {
            ...org,
            members: org.members.map((member) => (member.id === updatedMember.id ? updatedMember : member)),
          }
        }
        return org
      }),
    )
  }

  const removeMember = (orgId, memberId) => {
    setOrganizations(
      organizations.map((org) => {
        if (org.id === orgId) {
          return {
            ...org,
            members: org.members.filter((member) => member.id !== memberId),
          }
        }
        return org
      }),
    )
  }

  const value = {
    getOrganizations,
    getOrganization,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    addMember,
    updateMember,
    removeMember,
  }

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
}

export const useOrganization = () => {
  return useContext(OrganizationContext)
}
