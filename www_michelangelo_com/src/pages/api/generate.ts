import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: '未登录' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: '提示词不能为空' });
  }

  try {
    // 调用 Stability AI API
    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
          style_preset: "photographic"
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Stability API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Stability API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.artifacts?.[0]?.base64) {
      throw new Error('Invalid response format from Stability API');
    }

    const imageUrl = `data:image/png;base64,${result.artifacts[0].base64}`;

    // 保存图片到数据库
    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        prompt,
        userId: session.user.id,
      },
    });

    return res.status(200).json({
      image: {
        id: image.id,
        url: image.url,
        prompt: image.prompt,
        createdAt: image.createdAt,
      }
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return res.status(500).json({ 
      error: '生成图片失败，请重试',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
} 