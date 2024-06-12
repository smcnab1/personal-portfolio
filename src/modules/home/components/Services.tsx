import Router from 'next/router';
import { BiRocket as RocketIcon } from 'react-icons/bi';

import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import SectionHeading from '@/common/components/elements/SectionHeading';

const Services = () => {
  return (
    <section className='space-y-5'>
      <div className='space-y-3'>
        <SectionHeading title="What I&apos;ve been working on" />
        <p className='leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'>
          I provide healthcare university students with an immersive education. Whilst maintaining my role as a registered Paramedic with the HCPC.
          </p>
          <p className='leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'>
          I also provide private tutoring, coaching and mentoring of students and professionals in the healthcare sector and beyond.
          </p>          
          <p className='leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'>
          In my spare time, I enjoy working on projects related to software development and cyber security, focussing on developing my skills in these areas.
        </p>
      </div>
      <Card className='space-y-4 rounded-xl border bg-neutral-100 p-8 dark:border-none dark:bg-[#1e1e1e]'>
        <div className='flex items-center gap-2'>
          <RocketIcon size={24} />
          <h3 className='text-xl font-medium'>Lets work together!</h3>
        </div>
        <p className='pl-2 leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'>
          I&apos;m open for freelance projects, feel free to email me to see how we can collaborate.
        </p>
        <Button
          data-umami-event='Click Contact Button'
          onClick={() => Router.push('/contact')}
        >
          Contact Me
        </Button>
      </Card>
    </section>
  );
};

export default Services;
