export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  isPublic: boolean;
}

export interface GenerateImageResponse {
  image: {
    url: string;
  };
} 