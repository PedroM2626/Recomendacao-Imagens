import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { imageApi } from '@/services/api';

// Mock do axios
vi.mock('axios');
const mockedAxios = axios as any;

describe('ImageApi Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve fazer upload de imagem com progresso', async () => {
    const mockFile = new File(['conteudo'], 'teste.jpg', { type: 'image/jpeg' });
    const mockProgressCallback = vi.fn();
    
    const mockResponse = {
      data: {
        success: true,
        data: {
          id: 'test-123',
          filename: 'test.jpg',
          url: 'http://example.com/test.jpg',
          processing_status: 'pending'
        }
      }
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await imageApi.uploadImage(mockFile, mockProgressCallback);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/images/upload',
      expect.any(FormData),
      expect.objectContaining({
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    );

    expect(result).toEqual(mockResponse.data);
  });

  it('deve listar imagens com paginação', async () => {
    const mockResponse = {
      data: {
        images: [
          {
            id: '1',
            filename: 'test1.jpg',
            original_name: 'test1.jpg',
            file_size: 1024,
            mime_type: 'image/jpeg',
            width: 800,
            height: 600,
            url: 'http://example.com/test1.jpg',
            thumbnail_url: 'http://example.com/test1-thumb.jpg',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        limit: 20
      }
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await imageApi.getImages(1, 20);

    expect(mockedAxios.get).toHaveBeenCalledWith('/images', {
      params: { page: 1, limit: 20 }
    });

    expect(result).toEqual(mockResponse.data);
  });

  it('deve obter imagem específica', async () => {
    const imageId = 'test-123';
    const mockResponse = {
      data: {
        id: imageId,
        filename: 'test.jpg',
        original_name: 'test.jpg',
        file_size: 1024,
        mime_type: 'image/jpeg',
        width: 800,
        height: 600,
        url: 'http://example.com/test.jpg',
        thumbnail_url: 'http://example.com/test-thumb.jpg',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await imageApi.getImage(imageId);

    expect(mockedAxios.get).toHaveBeenCalledWith(`/images/${imageId}`);
    expect(result).toEqual(mockResponse.data);
  });

  it('deve obter recomendações', async () => {
    const imageId = 'test-123';
    const mockResponse = {
      data: {
        success: true,
        data: {
          recommendations: [
            {
              image: {
                id: 'rec-1',
                filename: 'rec1.jpg',
                original_name: 'rec1.jpg',
                file_size: 1024,
                mime_type: 'image/jpeg',
                width: 800,
                height: 600,
                url: 'http://example.com/rec1.jpg',
                thumbnail_url: 'http://example.com/rec1-thumb.jpg',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
              },
              similarity_score: 0.85,
              explanation: 'Similaridade baseada em cores'
            }
          ],
          processing_time_ms: 250
        }
      }
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await imageApi.getRecommendations(imageId, 10, 0.7);

    expect(mockedAxios.get).toHaveBeenCalledWith(`/images/${imageId}/recommendations`, {
      params: { limit: 10, threshold: 0.7 }
    });

    expect(result).toEqual(mockResponse.data);
  });

  it('deve processar imagem', async () => {
    const imageId = 'test-123';
    const mockResponse = { data: { message: 'Processamento iniciado' } };

    mockedAxios.post.mockResolvedValue(mockResponse);

    await imageApi.processImage(imageId);

    expect(mockedAxios.post).toHaveBeenCalledWith(`/images/${imageId}/process`);
  });

  it('deve obter estatísticas', async () => {
    const mockResponse = {
      data: {
        total_images: 10,
        processed_images: 8,
        average_processing_time: 2.5,
        top_tags: [
          { tag: 'natureza', count: 5 },
          { tag: 'paisagem', count: 3 }
        ],
        storage_usage: 10485760
      }
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await imageApi.getStats();

    expect(mockedAxios.get).toHaveBeenCalledWith('/stats');
    expect(result).toEqual(mockResponse.data);
  });

  it('deve lidar com erros de forma apropriada', async () => {
    const mockError = new Error('Network error');
    mockedAxios.post.mockRejectedValue(mockError);

    const mockFile = new File(['conteudo'], 'teste.jpg', { type: 'image/jpeg' });
    
    // Mock do console.error para não poluir os logs de teste
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(imageApi.uploadImage(mockFile)).rejects.toThrow(mockError);

    expect(consoleSpy).toHaveBeenCalledWith('API Error:', mockError);
    
    consoleSpy.mockRestore();
  });
});