import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const certifications = await prisma.certification.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      const formattedCertifications = certifications.map((cert) => ({
        id: cert.id,
        membership: cert.membership,
        organisation: cert.organisation,
        logo: cert.logo,
        type: cert.type,
        start_date: cert.startDate,
        end_date: cert.endDate,
        industry: cert.industry,
        link: cert.link,
        description: JSON.parse(cert.description),
      }));

      res.status(200).json(formattedCertifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch certifications' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        membership,
        organisation,
        logo,
        type,
        start_date,
        end_date,
        industry,
        link,
        description,
      } = req.body;

      const certification = await prisma.certification.create({
        data: {
          membership,
          organisation,
          logo,
          type,
          startDate: start_date,
          endDate: end_date,
          industry,
          link,
          description: JSON.stringify(description),
        },
      });

      res.status(201).json(certification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create certification' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...data } = req.body;

      const certification = await prisma.certification.update({
        where: { id: parseInt(id) },
        data: {
          membership: data.membership,
          organisation: data.organisation,
          logo: data.logo,
          type: data.type,
          startDate: data.start_date,
          endDate: data.end_date,
          industry: data.industry,
          link: data.link,
          description: JSON.stringify(data.description),
        },
      });

      res.status(200).json(certification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update certification' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      await prisma.certification.update({
        where: { id: parseInt(id as string) },
        data: { isActive: false },
      });

      res.status(200).json({ message: 'Certification deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete certification' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
