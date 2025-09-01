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
    console.log('Fetching projects from database...');

    const projects = await prisma.project.findMany({
      where: { isShow: true },
      orderBy: { sortOrder: 'asc' },
    });

    console.log(`Found ${projects.length} projects`);
    console.log('First project:', projects[0]);

    res.status(200).json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);

    // Check if it's a database connection error
    if (error instanceof Error) {
      if (
        error.message.includes('connect') ||
        error.message.includes('DATABASE_URL')
      ) {
        return res.status(500).json({
          message: 'Database connection failed',
          error: 'Check DATABASE_URL environment variable',
        });
      }
    }

    res.status(500).json({ message: 'Failed to fetch projects' });
  }
}
