import axios from 'axios';
import { Image, UploadResponse, RecommendationsResponse } from '@/types/image';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const imageApi = {
  // Upload de imagem
  uploadImage: async (file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    
    return response.data;
  },

  // Listar imagens
  getImages: async (page: number = 1, limit: number = 20): Promise<{ images: Image[]; total: number }> => {
    const response = await api.get('/images', {
      params: { page, limit },
    });
    return response.data;
  },

  // Obter imagem específica
  getImage: async (imageId: string): Promise<Image> => {
    const response = await api.get(`/images/${imageId}`);
    return response.data;
  },

  // Obter recomendações
  getRecommendations: async (
    imageId: string, 
    limit: number = 10, 
    threshold: number = 0.7
  ): Promise<RecommendationsResponse> => {
    const response = await api.get(`/images/${imageId}/recommendations`, {
      params: { limit, threshold },
    });
    return response.data;
  },

  // Processar imagem
  processImage: async (imageId: string): Promise<void> => {
    await api.post(`/images/${imageId}/process`);
  },

  // Obter estatísticas
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
};

export default api;