import type { NextApiResponse } from 'next';
import { withAuth } from '@/middleware/withAuth';
import type { AuthenticatedRequest } from '@/middleware/withAuth';
import { Image } from '@/models/Image';
import { connectDB } from '@/utils/db';
import mongoose from 'mongoose';

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<{ image: any } | { success: boolean } | { error: string }>
) {
  const { id } = req.query;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ error: 'Invalid image ID' });
  }

  await connectDB();

  if (req.method === 'GET') {
    try {
      const image = await Image.findOne({
        _id: id,
        userId,
      });

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      return res.status(200).json({
        image: {
          id: image._id.toString(),
          prompt: image.prompt,
          imageUrl: image.imageUrl,
          userId: image.userId.toString(),
          isPublic: image.isPublic,
          createdAt: image.createdAt.toISOString(),
        },
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      return res.status(500).json({ error: 'Failed to fetch image' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const image = await Image.findOne({
        _id: id,
        userId,
      });

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      await image.deleteOne();

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting image:', error);
      return res.status(500).json({ error: 'Failed to delete image' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler); 