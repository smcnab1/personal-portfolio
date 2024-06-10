import Image from '@/common/components/elements/Image';
import { ABOUT } from '@/common/constant/about';

const Story = () => {
  return (
    <div className='space-y-8'>
      <section
        className='space-y-4 leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'
        dangerouslySetInnerHTML={{ __html: ABOUT }}
      />

      <div className='space-y-4'>
        <span>Cheers,</span>
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
