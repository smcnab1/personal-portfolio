import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const educations = await prisma.education.findMany({
        orderBy: { sortOrder: 'asc' },
      });

      const formattedEducations = educations.map((education) => ({
        id: education.id,
        degree: education.degree,
        school: education.school,
        major: education.major,
        logo: education.logo,
        location: education.location,
        start_year: education.startYear,
        end_year: education.endYear,
        link: education.link,
        isActive: education.isActive,
        sortOrder: education.sortOrder,
      }));

      res.status(200).json(formattedEducations);
    } catch (error) {
      console.error('Error fetching education:', error);
      res.status(500).json({ error: 'Failed to fetch educations' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        degree,
        school,
        major,
        logo,
        location,
        start_year,
        end_year,
        link,
      } = req.body;

      const education = await prisma.education.create({
        data: {
          degree,
          school,
          major,
          logo,
          location,
          startYear: start_year,
          endYear: end_year,
          link,
        },
      });

      res.status(201).json(education);
    } catch (error) {
      console.error('Error creating education:', error);
      res.status(500).json({ error: 'Failed to create education' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...data } = req.body;

      const education = await prisma.education.update({
        where: { id: parseInt(id) },
        data: {
          degree: data.degree,
          school: data.school,
          major: data.major,
          logo: data.logo,
          location: data.location,
          startYear: data.start_year,
          endYear: data.end_year,
          link: data.link,
        },
      });

      res.status(200).json(education);
    } catch (error) {
      console.error('Error updating education:', error);
      res.status(500).json({ error: 'Failed to update education' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id, hard } = req.query;

      if (hard === 'true') {
        // Hard delete - permanently remove from database
        await prisma.education.delete({
          where: { id: parseInt(id as string) },
        });
        res.status(200).json({ message: 'Education permanently deleted' });
      } else {
        // Soft delete - set isActive to false
        await prisma.education.update({
          where: { id: parseInt(id as string) },
          data: { isActive: false },
        });
        res.status(200).json({ message: 'Education deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting education:', error);
      res.status(500).json({ error: 'Failed to delete education' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
