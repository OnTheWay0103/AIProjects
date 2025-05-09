import React from 'react';
import Image from 'next/image';

interface ImageCardProps {
  image: {
    id: string;
    url: string;
    prompt: string;
    createdAt: string;
  };
}

export default function ImageCard({ image }: ImageCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <Image
        src={image.url}
        alt={image.prompt}
        width={512}
        height={512}
        className="w-full h-auto"
      />
      <div className="p-4">
        <p className="text-sm text-gray-600">{image.prompt}</p>
        <p className="text-xs text-gray-400">
          {new Date(image.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
} 