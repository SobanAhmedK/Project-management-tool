import { createContext, useContext, useState, useEffect } from "react";
import { OrganizationAPI } from "@api/OrganizationApi";

// Create context
const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState([]);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const orgsData = await OrganizationAPI.getOrganizations();
      
      // For each organization, load its members
      const orgsWithMembers = await Promise.all(
        orgsData.map(async (org) => {
          try {
            // Get members for this organization
            const membersData = await OrganizationAPI.members.getAllMembers({
              organization: org.id
            });
            return {
              ...org,
              members: membersData,
              isActive: true, 
            };
          } catch (error) {
            console.error(`Error loading members for org ${org.id}:`, error);
            return {
              ...org,
              members: [],
              isActive: true,
            };
          }
        })
      );
      
      setOrganizations(orgsWithMembers);
    } catch (error) {
      console.error("Error loading organizations:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getOrganizations = () => {
    return organizations;
  };

  const getOrganization = (orgId) => {
    return organizations.find((org) => org.id === orgId);
  };

  const addOrganization = async (newOrg) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create organization via API
      const createdOrg = await OrganizationAPI.createOrganization({
        name: newOrg.name,
        description: newOrg.description,
      });
      
      // Add to local state with default values
      const orgWithDefaults = {
        ...createdOrg,
        members: [],
        isActive: true,
      };
      
      const updatedOrganizations = [...organizations, orgWithDefaults];
      setOrganizations(updatedOrganizations);
      
      return orgWithDefaults;
    } catch (error) {
      console.error("Error creating organization:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (updatedOrg) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update organization via API
      const updated = await OrganizationAPI.updateOrganization(updatedOrg.id, {
        name: updatedOrg.name,
        description: updatedOrg.description,
      });
      
      // Update local state
      const updatedOrganizations = organizations.map((org) =>
        org.id === updatedOrg.id ? { ...org, ...updated } : org
      );
      setOrganizations(updatedOrganizations);
      
      return updated;
    } catch (error) {
      console.error("Error updating organization:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrganization = async (orgId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Delete organization via API
      await OrganizationAPI.deleteOrganization(orgId);
      
      // Update local state
      const updatedOrganizations = organizations.filter((org) => org.id !== orgId);
      setOrganizations(updatedOrganizations);
      
      // Clear current organization if it was deleted
      if (currentOrganization?.id === orgId) {
        setCurrentOrganization(null);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting organization:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (orgId, newMember) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add member via API
      const memberData = {
        user: newMember.id || newMember.user,
        organization: orgId,
        role: newMember.role || 'Member',
      };
      
      const addedMember = await OrganizationAPI.members.addMember(memberData);
      
      // Update local state
      const updatedOrganizations = organizations.map((org) => {
        if (org.id === orgId) {
          return {
            ...org,
            members: [...org.members, addedMember],
          };
        }
        return org;
      });
      
      setOrganizations(updatedOrganizations);
      return updatedOrganizations.find((org) => org.id === orgId);
    } catch (error) {
      console.error("Error adding member:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateMemberRole = async (orgId, memberId, newRole) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the membership record ID from the member data
      const org = organizations.find((o) => o.id === orgId);
      const member = org?.members.find((m) => m.user === memberId || m.id === memberId);
      
      if (!member) {
        throw new Error("Member not found");
      }
      
      // Update member role via API
      const updatedMember = await OrganizationAPI.members.patchMember(member.id, {
        role: newRole,
      });
      
      // Update local state
      const updatedOrganizations = organizations.map((org) => {
        if (org.id === orgId) {
          return {
            ...org,
            members: org.members.map((member) =>
              member.id === updatedMember.id ? updatedMember : member
            ),
          };
        }
        return org;
      });
      
      setOrganizations(updatedOrganizations);
      return updatedOrganizations.find((org) => org.id === orgId);
    } catch (error) {
      console.error("Error updating member role:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (orgId, memberId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the membership record ID
      const org = organizations.find((o) => o.id === orgId);
      const member = org?.members.find((m) => m.user === memberId || m.id === memberId);
      
      if (!member) {
        throw new Error("Member not found");
      }
      
      // Remove member via API
      await OrganizationAPI.members.removeMember(member.id);
      
      // Update local state
      const updatedOrganizations = organizations.map((org) => {
        if (org.id === orgId) {
          return {
            ...org,
            members: org.members.filter((member) => member.id !== member.id),
          };
        }
        return org;
      });
      
      setOrganizations(updatedOrganizations);
      return updatedOrganizations.find((org) => org.id === orgId);
    } catch (error) {
      console.error("Error removing member:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = async (orgId, email, role = 'Member') => {
    try {
      setLoading(true);
      setError(null);
      
      const inviteData = {
        email,
        role,
        organization: orgId,
      };
      
      const result = await OrganizationAPI.invites.inviteUser(inviteData);
      return result;
    } catch (error) {
      console.error("Error inviting user:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const acceptInvite = async (inviteToken) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await OrganizationAPI.invites.acceptInvite({
        token: inviteToken,
      });
      
      // Reload organizations to reflect the new membership
      await loadOrganizations();
      
      return result;
    } catch (error) {
      console.error("Error accepting invite:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setOrganization = (orgname) => {
    setCurrentOrganization(orgname);
    console.log("Current Organization:", orgname);
  };

  const refreshOrganizations = () => {
    return loadOrganizations();
  };

  const value = {
    organizations,
    currentOrganization,
    loading,
    error,
    setOrganization,
    getOrganizations,
    getOrganization,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    addMember,
    updateMemberRole,
    removeMember,
    inviteUser,
    acceptInvite,
    refreshOrganizations,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
};