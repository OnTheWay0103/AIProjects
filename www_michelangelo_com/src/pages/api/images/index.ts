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

  const userId = session.user.id;

  switch (req.method) {
    case 'GET':
      try {
        const images = await prisma.image.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        return res.status(200).json(images);
      } catch (error) {
        console.error('Error fetching images:', error);
        return res.status(500).json({ error: '获取图片列表失败' });
      }

    case 'POST':
      try {
        const { url, prompt } = req.body;

        if (!url || !prompt) {
          return res.status(400).json({ error: '缺少必要参数' });
        }

        const image = await prisma.image.create({
          data: {
            url,
            prompt,
            userId,
          },
        });

        return res.status(201).json(image);
      } catch (error) {
        console.error('Error creating image:', error);
        return res.status(500).json({ error: '保存图片失败' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `方法 ${req.method} 不允许` });
  }
} 