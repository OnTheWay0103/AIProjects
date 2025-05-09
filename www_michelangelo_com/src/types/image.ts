export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  userId: string;
}

export interface GenerateImageResponse {
  image: {
    url: string;
  };
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