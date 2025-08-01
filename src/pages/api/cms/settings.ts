import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

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

      const formattedSettings = settings.reduce(
        (acc, setting) => {
          let value = setting.value;

          // Parse value based on type
          if (setting.type === 'number') {
            value = parseFloat(value);
          } else if (setting.type === 'boolean') {
            value = value === 'true';
          } else if (setting.type === 'json') {
            try {
              value = JSON.parse(value);
            } catch {
              value = value;
            }
          }

          acc[setting.key] = {
            value,
            type: setting.type,
            description: setting.description,
          };
          return acc;
        },
        {} as Record<string, any>,
      );

      res.status(200).json(formattedSettings);
    } catch (error) {
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
      res.status(500).json({ error: 'Failed to delete setting' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
