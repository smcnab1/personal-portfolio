import Router from 'next/router';
import { BiRocket as RocketIcon } from 'react-icons/bi';

import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import SectionHeading from '@/common/components/elements/SectionHeading';

const Services = () => {
  return (
    <section className='space-y-5'>
      <div className='space-y-3'>
        <SectionHeading title='Professional focus' />
        <p className='leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'>
          I design and deliver simulation-based education and immersive learning
          experiences for healthcare learners. My work brings together clinical
          practice, education and technology.
        </p>
      </div>
      <Card className='space-y-4 rounded-xl border bg-neutral-100 p-8 dark:border-none dark:bg-[#1e1e1e]'>
        <div className='flex items-center gap-2'>
          <RocketIcon size={24} />
          <h3 className='text-xl font-medium'>Selected projects</h3>
        </div>
        <p className='pl-2 leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'>
          Explore a concise selection of my work in healthcare simulation,
          immersive learning and digital products.
        </p>
        <Button
          data-umami-event='Click Projects Button'
          onClick={() => Router.push('/projects')}
        >
          View projects
        </Button>
      </Card>
    </section>
  );
};

export default Services;
