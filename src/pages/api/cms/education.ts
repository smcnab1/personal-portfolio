import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const education = await prisma.education.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      const formattedEducation = education.map((edu) => ({
        id: edu.id,
        degree: edu.degree,
        school: edu.school,
        major: edu.major,
        logo: edu.logo,
        location: edu.location,
        start_year: edu.startYear,
        end_year: edu.endYear,
        link: edu.link,
      }));

      res.status(200).json(formattedEducation);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch education' });
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
          startYear: parseInt(start_year),
          endYear: end_year ? parseInt(end_year) : null,
          link,
        },
      });

      res.status(201).json(education);
    } catch (error) {
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
          startYear: parseInt(data.start_year),
          endYear: data.end_year ? parseInt(data.end_year) : null,
          link: data.link,
        },
      });

      res.status(200).json(education);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update education' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      await prisma.education.update({
        where: { id: parseInt(id as string) },
        data: { isActive: false },
      });

      res.status(200).json({ message: 'Education deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete education' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
