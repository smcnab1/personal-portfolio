import { ContentProps } from '../types/learn';

export const LEARN_CONTENTS: ContentProps[] = [
  {
    id: 1,
    title: 'Association for Learning Technology (ALT) Portfolio',
    slug: 'cmalt-portfolio',
    description: 'Learn more about my work surrounding Learning Technology and its implementation.',
    image: '/public/learn/ALT.png',
    is_new: true,
    level: 'Beginner',
    is_show: true,
  },
  {
    id: 2,
    title: 'Problem Solving',
    slug: 'problem-solving',
    description:
      'Learn problem solving in JavaScript with detailed explanations.',
    image:
      '',
    is_new: false,
    level: 'All Levels',
    is_show: false,
  },
];