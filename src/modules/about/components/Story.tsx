import { useEffect, useState } from 'react';

import Image from '@/common/components/elements/Image';
import Loading from '@/common/components/elements/Loading';

interface AboutData {
  id: number;
  content: string;
}

const Story = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/cms/about');
      const data = await response.json();

      if (data && data.length > 0) {
        setAboutData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!aboutData) {
    return (
      <div className='space-y-8'>
        <section className='space-y-4 leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'>
          <p>No about content found. Please add content through the CMS.</p>
        </section>
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
  }

  return (
    <div className='space-y-8'>
      <section
        className='space-y-4 leading-[1.8] text-neutral-800 dark:text-neutral-300 md:leading-loose'
        dangerouslySetInnerHTML={{ __html: aboutData.content }}
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
