import { PRIVACYPOLICY } from '@/common/constant/privacypolicy';

const PrivacyPolicy = () => {
  return (
    <div className='space-y-8'>
      <section
        className='space-y-4 leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'
        dangerouslySetInnerHTML={{ __html: PRIVACYPOLICY }}
      />
    </div>
  );
};

export default PrivacyPolicy;
