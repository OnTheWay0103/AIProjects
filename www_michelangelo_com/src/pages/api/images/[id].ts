import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: '未登录' });
  }

  const { id } = req.query;
  const userId = session.user.id;

  // 检查图片是否存在且属于当前用户
  const image = await prisma.image.findFirst({
    where: {
      id: id as string,
      userId,
    },
  });

  if (!image) {
    return res.status(404).json({ error: '图片不存在' });
  }

  switch (req.method) {
    case 'DELETE':
      try {
        await prisma.image.delete({
          where: {
            id: id as string,
          },
        });
        return res.status(200).json({ message: '删除成功' });
      } catch (error) {
        console.error('Error deleting image:', error);
        return res.status(500).json({ error: '删除图片失败' });
      }

    case 'PATCH':
      try {
        const { isPublic } = req.body;
        const updatedImage = await prisma.image.update({
          where: {
            id: id as string,
          },
          data: {
            isPublic,
          },
        });
        return res.status(200).json(updatedImage);
      } catch (error) {
        console.error('Error updating image:', error);
        return res.status(500).json({ error: '更新图片失败' });
      }

    default:
      res.setHeader('Allow', ['DELETE', 'PATCH']);
      return res.status(405).json({ error: `方法 ${req.method} 不允许` });
  }
} 