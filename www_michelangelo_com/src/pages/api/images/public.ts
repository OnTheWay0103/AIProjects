import type { NextApiRequest, NextApiResponse } from 'next';
import { Image } from '@/models/Image';
import { connectDB } from '@/utils/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ images: any[] } | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  try {
    const images = await Image.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      images: images.map((image) => ({
        id: image._id.toString(),
        prompt: image.prompt,
        imageUrl: image.imageUrl,
        userId: image.userId.toString(),
        isPublic: image.isPublic,
        createdAt: image.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching public images:', error);
    return res.status(500).json({ error: 'Failed to fetch public images' });
  }
} 