import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const publications = await prisma.publication.findMany({
        orderBy: { sortOrder: 'asc' },
      });

      const formattedPublications = publications.map((publication) => ({
        id: publication.id,
        title: publication.title,
        journal: publication.journal,
        logo: publication.logo,
        location: publication.location,
        location_type: publication.locationType,
        type: publication.type,
        start_date: publication.startDate,
        link: publication.link,
        overview: JSON.parse(publication.overview),
        isActive: publication.isActive,
        sortOrder: publication.sortOrder,
      }));

      res.status(200).json(formattedPublications);
    } catch (error) {
      console.error('Error fetching publications:', error);
      res.status(500).json({ error: 'Failed to fetch publications' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        title,
        journal,
        logo,
        location,
        location_type,
        type,
        start_date,
        link,
        overview,
      } = req.body;

      const publication = await prisma.publication.create({
        data: {
          title,
          journal,
          logo,
          location,
          locationType: location_type,
          type,
          startDate: start_date,
          link,
          overview: JSON.stringify(overview),
        },
      });

      res.status(201).json(publication);
    } catch (error) {
      console.error('Error creating publication:', error);
      res.status(500).json({ error: 'Failed to create publication' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...data } = req.body;

      const publication = await prisma.publication.update({
        where: { id: parseInt(id) },
        data: {
          title: data.title,
          journal: data.journal,
          logo: data.logo,
          location: data.location,
          locationType: data.location_type,
          type: data.type,
          startDate: data.start_date,
          link: data.link,
          overview: JSON.stringify(data.overview),
        },
      });

      res.status(200).json(publication);
    } catch (error) {
      console.error('Error updating publication:', error);
      res.status(500).json({ error: 'Failed to update publication' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id, hard } = req.query;

      if (hard === 'true') {
        // Hard delete - permanently remove from database
        await prisma.publication.delete({
          where: { id: parseInt(id as string) },
        });
        res.status(200).json({ message: 'Publication permanently deleted' });
      } else {
        // Soft delete - set isActive to false
        await prisma.publication.update({
          where: { id: parseInt(id as string) },
          data: { isActive: false },
        });
        res.status(200).json({ message: 'Publication deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting publication:', error);
      res.status(500).json({ error: 'Failed to delete publication' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
