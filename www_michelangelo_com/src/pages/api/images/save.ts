import type { NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { withAuth } from '@/middleware/withAuth';
import type { AuthenticatedRequest } from '@/middleware/withAuth';
import type { SaveImageRequest, SaveImageResponse } from '@/types/image';

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<SaveImageResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, imageUrl } = req.body as SaveImageRequest;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!prompt || !imageUrl) {
      return res.status(400).json({ error: 'Prompt and imageUrl are required' });
    }

    // TODO: 保存图片到数据库
    const image = {
      id: uuidv4(),
      userId,
      prompt,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return res.status(201).json({
      id: image.id,
      imageUrl: image.imageUrl,
    });
  } catch (error) {
    console.error('Error saving image:', error);
    return res.status(500).json({ error: 'Failed to save image' });
  }
}

export default withAuth(handler); 