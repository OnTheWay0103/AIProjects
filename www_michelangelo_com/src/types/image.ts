export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
}

export interface ImageGenerationResponse {
  imageUrl: string;
}

export interface SaveImageRequest {
  prompt: string;
  imageUrl: string;
}

export interface SaveImageResponse {
  id: string;
  imageUrl: string;
} 