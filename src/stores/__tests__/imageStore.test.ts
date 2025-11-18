import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useImageStore } from '@/stores/imageStore';

describe('ImageStore', () => {
  it('deve inicializar com estado padrão', () => {
    const { result } = renderHook(() => useImageStore());
    
    expect(result.current.images).toEqual([]);
    expect(result.current.currentImage).toBeNull();
    expect(result.current.recommendations).toEqual([]);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.uploadProgress).toBe(0);
  });

  it('deve adicionar imagem ao array', () => {
    const { result } = renderHook(() => useImageStore());
    
    const mockImage = {
      id: 'test-123',
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
    };

    act(() => {
      result.current.addImage(mockImage);
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.images[0]).toEqual(mockImage);
  });

  it('deve definir imagem atual', () => {
    const { result } = renderHook(() => useImageStore());
    
    const mockImage = {
      id: 'test-123',
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
    };

    act(() => {
      result.current.setCurrentImage(mockImage);
    });

    expect(result.current.currentImage).toEqual(mockImage);
  });

  it('deve definir recomendações', () => {
    const { result } = renderHook(() => useImageStore());
    
    const mockRecommendations = [
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
    ];

    act(() => {
      result.current.setRecommendations(mockRecommendations);
    });

    expect(result.current.recommendations).toEqual(mockRecommendations);
  });

  it('deve limpar recomendações', () => {
    const { result } = renderHook(() => useImageStore());
    
    const mockRecommendations = [
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
    ];

    act(() => {
      result.current.setRecommendations(mockRecommendations);
    });

    expect(result.current.recommendations).toHaveLength(1);

    act(() => {
      result.current.clearRecommendations();
    });

    expect(result.current.recommendations).toEqual([]);
  });

  it('deve atualizar estado de upload', () => {
    const { result } = renderHook(() => useImageStore());
    
    expect(result.current.isUploading).toBe(false);
    expect(result.current.uploadProgress).toBe(0);

    act(() => {
      result.current.setIsUploading(true);
      result.current.setUploadProgress(50);
    });

    expect(result.current.isUploading).toBe(true);
    expect(result.current.uploadProgress).toBe(50);
  });

  it('deve atualizar estado de processamento', () => {
    const { result } = renderHook(() => useImageStore());
    
    expect(result.current.isProcessing).toBe(false);

    act(() => {
      result.current.setIsProcessing(true);
    });

    expect(result.current.isProcessing).toBe(true);
  });

  it('deve definir array completo de imagens', () => {
    const { result } = renderHook(() => useImageStore());
    
    const mockImages = [
      {
        id: 'test-1',
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
      },
      {
        id: 'test-2',
        filename: 'test2.jpg',
        original_name: 'test2.jpg',
        file_size: 2048,
        mime_type: 'image/png',
        width: 1200,
        height: 800,
        url: 'http://example.com/test2.jpg',
        thumbnail_url: 'http://example.com/test2-thumb.jpg',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z'
      }
    ];

    act(() => {
      result.current.setImages(mockImages);
    });

    expect(result.current.images).toEqual(mockImages);
    expect(result.current.images).toHaveLength(2);
  });
});