import type { NextApiResponse } from 'next';
import { withAuth } from '@/middleware/withAuth';
import type { AuthenticatedRequest } from '@/middleware/withAuth';
import { Image } from '@/models/Image';
import { connectDB } from '@/utils/db';
import mongoose from 'mongoose';

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<{ success: boolean } | { error: string }>
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

  if (req.method === 'POST') {
    try {
      const image = await Image.findOne({
        _id: id,
        userId,
      });

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      image.isPublic = true;
      await image.save();

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sharing image:', error);
      return res.status(500).json({ error: 'Failed to share image' });
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

      image.isPublic = false;
      await image.save();

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error unsharing image:', error);
      return res.status(500).json({ error: 'Failed to unshare image' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler); 