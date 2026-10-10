import api from './api';

export const authService = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignored
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  getCurrentUser: async () => {
    return api.get('/auth/me');
  }
};

export const campaignService = {
  getAll: async (params = {}) => {
    return api.get('/campaigns', { params });
  },
  getById: async (id) => {
    return api.get(`/campaigns/${id}`);
  },
  create: async (data) => {
    return api.post('/campaigns', data);
  },
  update: async (id, data) => {
    return api.patch(`/campaigns/${id}`, data);
  },
  delete: async (id) => {
    return api.delete(`/campaigns/${id}`);
  }
};

export const registrationService = {
  registerForCampaign: async (campaignId, data = {}) => {
    return api.post(`/campaigns/${campaignId}/register`, data);
  },
  getMyRegistrations: async (params = {}) => {
    return api.get('/registrations/me', { params });
  },
  getCampaignRegistrations: async (campaignId, params = {}) => {
    return api.get(`/campaigns/${campaignId}/registrations`, { params });
  },
  updateStatus: async (registrationId, status) => {
    return api.patch(`/registrations/${registrationId}/status`, { status });
  },
  cancelRegistration: async (registrationId) => {
    return api.delete(`/registrations/${registrationId}`);
  }
};

export const donationService = {
  recordDonation: async (data) => {
    return api.post('/donations', data);
  },
  getMyDonations: async (params = {}) => {
    return api.get('/donations/me', { params });
  },
  getAllDonations: async (params = {}) => {
    return api.get('/donations', { params });
  },
  getById: async (id) => {
    return api.get(`/donations/${id}`);
  }
};

export const dashboardService = {
  getAdminStats: async () => {
    return api.get('/dashboard/admin');
  },
  getDonorStats: async () => {
    return api.get('/dashboard/donor');
  }
};

export const userService = {
  getProfile: async () => {
    return api.get('/users/me');
  },
  updateProfile: async (data) => {
    return api.patch('/users/me', data);
  },
  getAllUsers: async (params = {}) => {
    return api.get('/users', { params });
  },
  toggleUserStatus: async (id, isActive) => {
    return api.patch(`/users/${id}/status`, { isActive });
  }
};
