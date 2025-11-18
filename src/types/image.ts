export interface Image {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  width: number;
  height: number;
  url: string;
  thumbnail_url: string;
  features?: number[];
  metadata?: ImageMetadata;
  created_at: string;
  updated_at: string;
}

export interface ImageMetadata {
  colors: ColorInfo[];
  tags: string[];
  description?: string;
  confidence_score: number;
}

export interface ColorInfo {
  hex: string;
  percentage: number;
  name: string;
}

export interface Recommendation {
  image: Image;
  similarity_score: number;
  explanation: string;
}

export interface UploadResponse {
  success: boolean;
  data: {
    id: string;
    filename: string;
    url: string;
    processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  };
}

export interface RecommendationsResponse {
  success: boolean;
  data: {
    recommendations: Recommendation[];
    processing_time_ms: number;
  };
}