import type { NextApiResponse } from 'next';
import Replicate from 'replicate';
import { withAuth } from '@/middleware/withAuth';
import type { AuthenticatedRequest } from '@/middleware/withAuth';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 调用 Replicate API 生成图片
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
          width: 1024,
          height: 1024,
        }
      }
    ) as string[];

    // 返回生成的图片URL
    return res.status(200).json({ imageUrl: output[0] });
  } catch (error) {
    console.error('Error generating image:', error);
    return res.status(500).json({ error: 'Failed to generate image' });
  }
}

export default withAuth(handler); 