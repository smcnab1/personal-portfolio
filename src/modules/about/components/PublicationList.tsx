import { PUBLICATIONS } from '@/common/constant/publications';

import PublicationCard from './PublicationCard';

const PublicationList = () => {
  return (
    <section className='space-y-6'>
      <div className='grid gap-3 '>
        {PUBLICATIONS?.map((publication, index) => (
          <PublicationCard key={index} {...publication} />
        ))}
      </div>
    </section>
  );
};

export default PublicationList;
