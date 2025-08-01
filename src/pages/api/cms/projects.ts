import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const projects = await prisma.project.findMany({
        where: { isShow: true },
        orderBy: { sortOrder: 'asc' },
      });

      const formattedProjects = projects.map((project) => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        image: project.image,
        link_demo: project.linkDemo,
        link_github: project.linkGithub,
        stacks: project.stacks,
        is_show: project.isShow,
        is_featured: project.isFeatured,
        updated_at: project.updatedAt,
      }));

      res.status(200).json(formattedProjects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        title,
        slug,
        description,
        image,
        link_demo,
        link_github,
        stacks,
        is_show,
        is_featured,
      } = req.body;

      const project = await prisma.project.create({
        data: {
          title,
          slug,
          description,
          image,
          linkDemo: link_demo,
          linkGithub: link_github,
          stacks,
          isShow: is_show ?? true,
          isFeatured: is_featured ?? false,
        },
      });

      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create project' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...data } = req.body;

      const project = await prisma.project.update({
        where: { id: parseInt(id) },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          image: data.image,
          linkDemo: data.link_demo,
          linkGithub: data.link_github,
          stacks: data.stacks,
          isShow: data.is_show,
          isFeatured: data.is_featured,
        },
      });

      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      await prisma.project.update({
        where: { id: parseInt(id as string) },
        data: { isShow: false },
      });

      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
