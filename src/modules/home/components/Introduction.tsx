const Introduction = () => {
  return (
    <section className='bg-cover bg-no-repeat '>
      <div className='space-y-3'>
        <div className='flex gap-2  text-2xl font-medium lg:text-3xl'>
          <h1>Hi, I&apos;m Sam</h1>{' '}
          <div className='ml-1 animate-waving-hand'>👋</div>
        </div>
        <div className='space-y-4'>
          <ul className='ml-5 flex list-disc flex-col gap-1 text-neutral-700 dark:text-neutral-400 lg:flex-row lg:gap-10'>
            <li>
              Based in Buckinghamshire, England <span className='ml-1'>🇬🇧</span>
            </li>
            <li>Working remotely and across the UK</li>
          </ul>
        </div>
      </div>

      <p className='mt-6 leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'>
      I'm a University Lecturer and Registered Paramedic from Edinburgh, Scotland, 
      working in healthcare eduction. I have recently been dabbling further in IT 
      & Development whilst working in my role with Immersive Technologies & Simulation.</p>
    </section>
  );
};

export default Introduction;
