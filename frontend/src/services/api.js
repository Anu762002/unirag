import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8005';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('academic_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Authentication APIs
  async register(data) {
    try {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error?.response?.data || { detail: 'Registration failed.' };
    }
  },

  async login(data) {
    try {
      const response = await apiClient.post('/auth/login', data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error?.response?.data || { detail: 'Invalid login credentials.' };
    }
  },

  async getMe() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error?.response?.data || { detail: 'Failed to fetch profile.' };
    }
  },

  // Document APIs
  async getDocuments() {
    try {
      const response = await apiClient.get('/documents');
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error?.response?.data || { detail: 'Failed to fetch documents.' };
    }
  },

  async uploadDocuments(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading documents:', error);
      throw error?.response?.data || { detail: 'Failed to upload document.' };
    }
  },

  async deleteDocument(docId) {
    try {
      const response = await apiClient.delete(`/documents/${docId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error?.response?.data || { detail: 'Failed to delete document.' };
    }
  },

  // Chat API
  async sendChat(question) {
    try {
      const response = await apiClient.post('/chat', { question });
      return response.data;
    } catch (error) {
      console.error('Error in chat API:', error);
      throw error?.response?.data || { detail: 'Failed to send query to Academic Assistant.' };
    }
  }
};
