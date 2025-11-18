import { create } from 'zustand';
import { Image, Recommendation } from '@/types/image';

interface ImageStore {
  images: Image[];
  currentImage: Image | null;
  recommendations: Recommendation[];
  isUploading: boolean;
  isProcessing: boolean;
  uploadProgress: number;
  
  // Actions
  setImages: (images: Image[]) => void;
  setCurrentImage: (image: Image | null) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  setIsUploading: (uploading: boolean) => void;
  setIsProcessing: (processing: boolean) => void;
  setUploadProgress: (progress: number) => void;
  addImage: (image: Image) => void;
  clearRecommendations: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  currentImage: null,
  recommendations: [],
  isUploading: false,
  isProcessing: false,
  uploadProgress: 0,
  
  setImages: (images) => set({ images }),
  setCurrentImage: (currentImage) => set({ currentImage }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
  addImage: (image) => set((state) => ({ images: [image, ...state.images] })),
  clearRecommendations: () => set({ recommendations: [] }),
}));