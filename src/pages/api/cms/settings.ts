import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const settings = await prisma.siteSettings.findMany({
        orderBy: { key: 'asc' },
      });

      const formattedSettings = settings.map((setting) => ({
        id: setting.id,
        key: setting.key,
        value: setting.value,
        type: setting.type,
        description: setting.description,
      }));

      res.status(200).json(formattedSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  } else if (req.method === 'POST') {
    try {
      const { key, value, type = 'string', description } = req.body;

      const setting = await prisma.siteSettings.upsert({
        where: { key },
        update: {
          value:
            typeof value === 'object' ? JSON.stringify(value) : String(value),
          type,
          description,
        },
        create: {
          key,
          value:
            typeof value === 'object' ? JSON.stringify(value) : String(value),
          type,
          description,
        },
      });

      res.status(201).json(setting);
    } catch (error) {
      console.error('Error creating setting:', error);
      res.status(500).json({ error: 'Failed to save setting' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { key, value, type, description } = req.body;

      const setting = await prisma.siteSettings.update({
        where: { key },
        data: {
          value:
            typeof value === 'object' ? JSON.stringify(value) : String(value),
          type,
          description,
        },
      });

      res.status(200).json(setting);
    } catch (error) {
      console.error('Error updating setting:', error);
      res.status(500).json({ error: 'Failed to update setting' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { key } = req.query;

      await prisma.siteSettings.delete({
        where: { key: key as string },
      });

      res.status(200).json({ message: 'Setting deleted successfully' });
    } catch (error) {
      console.error('Error deleting setting:', error);
      res.status(500).json({ error: 'Failed to delete setting' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
