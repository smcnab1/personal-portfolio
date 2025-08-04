import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

interface ResponseData {
  views: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const contentMeta = await prisma.contentmeta.findUnique({
        where: { slug: slug as string },
        select: { views: true },
      });

      const contentViewsCount = contentMeta?.views ?? 0;

      const response: ResponseData = {
        views: contentViewsCount,
      };

      return res.json(response);
    } catch (error) {
      console.error('Error fetching view count:', error);
      res.status(500).json({ error: 'Failed to get views' });
    }
  } else if (req.method === 'POST') {
    try {
      const { slug } = req.body;

      const post = await prisma.blog.findUnique({
        where: { slug },
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const updatedPost = await prisma.blog.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });

      res.status(200).json({ views: updatedPost.views });
    } catch (error) {
      console.error('Error incrementing view count:', error);
      res.status(500).json({ error: 'Failed to update views' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
