import { ProjectItemProps } from '../types/projects';

export const PROJECTS: ProjectItemProps[] = [
  {
    id: 'portfolio-1',
    title: 'Personal Portfolio',
    slug: 'personal-portfolio',
    description:
      'A modern, responsive portfolio website built with Next.js and TypeScript.',
    content: undefined,
    image: '/images/placeholder.png',
    linkDemo: 'https://sammcnab.co.uk',
    linkGithub: 'https://github.com/sammcnab/personal-portfolio',
    stacks: 'Next.js, TypeScript, Tailwind CSS, Prisma',
    isShow: true,
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sortOrder: 1,
  },
  {
    id: 'portfolio-2',
    title: 'Healthcare Simulation Platform',
    slug: 'healthcare-simulation',
    description:
      'An AI-driven simulation platform for healthcare education and training.',
    content: undefined,
    image: '/images/placeholder.png',
    linkDemo: null,
    linkGithub: null,
    stacks: 'React, Node.js, AI/ML, Healthcare APIs',
    isShow: true,
    isFeatured: false,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
    sortOrder: 2,
  },
];
