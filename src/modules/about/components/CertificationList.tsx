import { CERTS } from '@/common/constant/certs';

import CertificationCard from './CertificationCard';

const CertificationList = () => {
  return (
    <section className='space-y-6'>
      <div className='grid gap-3 '>
        {CERTS?.map((cert, index) => (
          <CertificationCard key={index} {...cert} />
        ))}
      </div>
    </section>
  );
};

export default CertificationList;
