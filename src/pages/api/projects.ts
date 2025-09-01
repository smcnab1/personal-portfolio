/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { isShow: true },
      orderBy: { sortOrder: 'asc' },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
}
