import type { NextApiResponse } from 'next';
import { withAuth } from '@/middleware/withAuth';
import type { AuthenticatedRequest } from '@/middleware/withAuth';
import type { GeneratedImage } from '@/types/image';
import { Image } from '@/models/Image';
import { connectDB } from '@/utils/db';
import type { Document, Types } from 'mongoose';

interface ImageDocument extends Document {
  _id: Types.ObjectId;
  prompt: string;
  imageUrl: string;
  userId: string;
  createdAt: Date;
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<{ images: GeneratedImage[] } | { error: string } | { id: string }>
) {
  if (req.method === 'GET') {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await connectDB();

      const images = await Image.find({ userId })
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({
        images: images.map((image: ImageDocument) => ({
          id: image._id.toString(),
          prompt: image.prompt,
          imageUrl: image.imageUrl,
          createdAt: image.createdAt.toISOString(),
          userId: image.userId.toString(),
        })),
      });
    } catch (error) {
      console.error('Error fetching images:', error);
      return res.status(500).json({ error: 'Failed to fetch images' });
    }
  }

  if (req.method === 'POST') {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { prompt, imageUrl } = req.body;

      if (!prompt || !imageUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await connectDB();

      const image = await Image.create({
        prompt,
        imageUrl,
        userId,
      });

      return res.status(201).json({
        id: image._id.toString(),
      });
    } catch (error) {
      console.error('Error saving image:', error);
      return res.status(500).json({ error: 'Failed to save image' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler); 