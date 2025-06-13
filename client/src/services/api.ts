import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors by redirecting to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, name: string) => 
    api.post('/auth/register', { email, password, name }),
  
  getCurrentUser: () => 
    api.get('/profiles/me'),
};

// Profiles API
export const profilesAPI = {
  getProfiles: () => 
    api.get('/profiles'),
  
  getProfile: (userId: string) => 
    api.get(`/profiles/${userId}`),
  
  updateProfile: (profileData: any) => 
    api.put('/profiles', profileData),
  
  uploadPhoto: (formData: FormData) => 
    api.post('/profiles/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  setMainPhoto: (photoId: string) => 
    api.put(`/profiles/photos/${photoId}/main`),
  
  deletePhoto: (photoId: string) => 
    api.delete(`/profiles/photos/${photoId}`),
};

// Matches API
export const matchesAPI = {
  getMatches: () => 
    api.get('/matches'),
  
  likeProfile: (profileId: string) => 
    api.post(`/matches/like/${profileId}`),
  
  passProfile: (profileId: string) => 
    api.post(`/matches/pass/${profileId}`),
};

// Messages API
export const messagesAPI = {
  getConversations: () => 
    api.get('/messages/conversations'),
  
  getMessages: (matchId: string) => 
    api.get(`/messages/${matchId}`),
  
  sendMessage: (matchId: string, content: string) => 
    api.post(`/messages/${matchId}`, { content }),
  
  markAsRead: (messageId: string) => 
    api.put(`/messages/${messageId}/read`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => 
    api.get('/notifications'),
  
  markAsRead: (notificationId: string) => 
    api.put(`/notifications/${notificationId}/read`),
  
  markAllAsRead: () => 
    api.put('/notifications/read-all'),
};

export default api;
