import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const careers = await prisma.career.findMany({
        orderBy: { sortOrder: 'asc' },
      });

      const formattedCareers = careers.map((career) => ({
        id: career.id,
        position: career.position,
        company: career.company,
        company_legal_name: career.companyLegalName,
        logo: career.logo,
        location: career.location,
        location_type: career.locationType,
        type: career.type,
        start_date: career.startDate,
        end_date: career.endDate,
        industry: career.industry,
        link: career.link,
        responsibilities: JSON.parse(career.responsibilities),
        isActive: career.isActive,
        sortOrder: career.sortOrder,
      }));

      res.status(200).json(formattedCareers);
    } catch (error) {
      console.error('Error fetching careers:', error);
      res.status(500).json({ error: 'Failed to fetch careers' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        position,
        company,
        company_legal_name,
        logo,
        location,
        location_type,
        type,
        start_date,
        end_date,
        industry,
        link,
        responsibilities,
      } = req.body;

      const career = await prisma.career.create({
        data: {
          position,
          company,
          companyLegalName: company_legal_name,
          logo,
          location,
          locationType: location_type,
          type,
          startDate: start_date,
          endDate: end_date,
          industry,
          link,
          responsibilities: JSON.stringify(responsibilities),
        },
      });

      res.status(201).json(career);
    } catch (error) {
      console.error('Error creating career:', error);
      res.status(500).json({ error: 'Failed to create career' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...data } = req.body;

      const career = await prisma.career.update({
        where: { id: parseInt(id) },
        data: {
          position: data.position,
          company: data.company,
          companyLegalName: data.company_legal_name,
          logo: data.logo,
          location: data.location,
          locationType: data.location_type,
          type: data.type,
          startDate: data.start_date,
          endDate: data.end_date,
          industry: data.industry,
          link: data.link,
          responsibilities: JSON.stringify(data.responsibilities),
        },
      });

      res.status(200).json(career);
    } catch (error) {
      console.error('Error updating career:', error);
      res.status(500).json({ error: 'Failed to update career' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id, hard } = req.query;

      if (hard === 'true') {
        // Hard delete - permanently remove from database
        await prisma.career.delete({
          where: { id: parseInt(id as string) },
        });
        res.status(200).json({ message: 'Career permanently deleted' });
      } else {
        // Soft delete - set isActive to false
        await prisma.career.update({
          where: { id: parseInt(id as string) },
          data: { isActive: false },
        });
        res.status(200).json({ message: 'Career deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting career:', error);
      res.status(500).json({ error: 'Failed to delete career' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
