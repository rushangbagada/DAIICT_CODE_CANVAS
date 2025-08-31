import axios from 'axios';

const ML_API_BASE_URL = '/ml-api';

const mlApiClient = axios.create({
  baseURL: ML_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example ML API call: get recommendations
export const mlAPI = {
  getRecommendations: async (payload) => {
    try {
      const response = await mlApiClient.post('/recommend', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get recommendations' };
    }
  },
  // Add more ML API methods as needed
};