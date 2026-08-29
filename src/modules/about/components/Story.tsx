import Image from '@/common/components/elements/Image';

const Story = () => {
  return (
    <div className='space-y-8'>
      <section className='space-y-4 leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'>
        <p>
          I&apos;m a University Lecturer, Healthcare Simulationist and
          Registered Paramedic.
        </p>
        <p>
          I specialise in simulation-based education and immersive technologies
          for healthcare. My work focuses on creating practical, engaging
          learning experiences that connect clinical practice, education and
          technology.
        </p>
      </section>

      <div className='space-y-4'>
        <Image
          src='/images/my-avatar.png'
          width={150}
          height={150}
          alt='Sam McNab'
        />
      </div>
    </div>
  );
};

export default Story;
