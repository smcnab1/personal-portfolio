import { ProjectItemProps } from '../types/projects';

export const PROJECTS: ProjectItemProps[] = [
  {
    title: 'Personal Portfolio',
    slug: 'personal-portfolio',
    description:
      'A modern, responsive portfolio website built with Next.js and TypeScript.',
    image: '/images/placeholder.png',
    link_demo: 'https://sammcnab.co.uk',
    link_github: 'https://github.com/sammcnab/personal-portfolio',
    stacks: 'Next.js, TypeScript, Tailwind CSS, Prisma',
    is_show: true,
    is_featured: true,
    updated_at: new Date('2024-01-01'),
  },
  {
    title: 'Healthcare Simulation Platform',
    slug: 'healthcare-simulation',
    description:
      'An AI-driven simulation platform for healthcare education and training.',
    image: '/images/placeholder.png',
    link_demo: null,
    link_github: null,
    stacks: 'React, Node.js, AI/ML, Healthcare APIs',
    is_show: true,
    is_featured: false,
    updated_at: new Date('2024-06-01'),
  },
];
