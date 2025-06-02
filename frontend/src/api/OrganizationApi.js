import apiClient from './ApiClient';

// Organization CRUD operations
export const organizationApi = {
  // Get all organizations
  getOrganizations: async () => {
    try {
      const response = await apiClient.get('organizations/');
      console.log("Fetched organizations:", response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single organization by ID
  getOrganization: async (orgId) => {
    try {
      const response = await apiClient.get(`organizations/${orgId}/`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new organization
  createOrganization: async (organizationData) => {
    try {
      const response = await apiClient.post('organizations/', organizationData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update organization
  updateOrganization: async (orgId, organizationData) => {
    try {
      const response = await apiClient.put(`organizations/${orgId}/`, organizationData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Partially update organization
  patchOrganization: async (orgId, organizationData) => {
    try {
      const response = await apiClient.patch(`organizations/${orgId}/`, organizationData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete organization
  deleteOrganization: async (orgId) => {
    try {
      const response = await apiClient.delete(`organizations/${orgId}/`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Organization membership operations
export const organizationMemberApi = {
  // Get all members of all organizations (with filtering if needed)
  getAllMembers: async (params = {}) => {
    try {
      const response = await apiClient.get('organization-members/', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get specific member by ID
  getMember: async (memberId) => {
    try {
      const response = await apiClient.get(`organization-members/${memberId}/`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add member to organization
  addMember: async (memberData) => {
    try {
      const response = await apiClient.post('organization-members/', memberData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update member role
  updateMember: async (memberId, memberData) => {
    try {
      const response = await apiClient.put(`organization-members/${memberId}/`, memberData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Partially update member
  patchMember: async (memberId, memberData) => {
    try {
      const response = await apiClient.patch(`organization-members/${memberId}/`, memberData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Remove member from organization
  removeMember: async (memberId) => {
    try {
      const response = await apiClient.delete(`organization-members/${memberId}/`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Organization invite operations
export const organizationInviteApi = {
  // Send invitation to user
  inviteUser: async (inviteData) => {
    try {
      const response = await apiClient.post('organizations/invite/', inviteData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Accept invitation
  acceptInvite: async (inviteData) => {
    try {
      const response = await apiClient.post('organizations/invite/accept/', inviteData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Combined API object for easier imports
export const OrganizationAPI = {
  ...organizationApi,
  members: organizationMemberApi,
  invites: organizationInviteApi,
};

export default OrganizationAPI;