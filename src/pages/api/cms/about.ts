import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const about = await prisma.about.findFirst({
        orderBy: { updatedAt: 'desc' },
      });

      res.status(200).json(about ? [about] : []);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch about content' });
    }
  } else if (req.method === 'POST') {
    try {
      const { content } = req.body;

      const about = await prisma.about.create({
        data: { content },
      });

      res.status(201).json(about);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create about content' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, content } = req.body;

      const about = await prisma.about.update({
        where: { id: parseInt(id) },
        data: { content },
      });

      res.status(200).json(about);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update about content' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
