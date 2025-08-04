import { useEffect, useState } from 'react';

import Loading from '@/common/components/elements/Loading';

import CertificationCard from './CertificationCard';

interface Certification {
  id: number;
  membership: string;
  organisation: string;
  logo?: string;
  type: string;
  start_date: string;
  end_date?: string;
  industry?: string;
  link?: string;
  description: string[];
  isActive: boolean;
  sortOrder: number;
}

const CertificationList = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await fetch('/api/cms/certifications');
      const data = await response.json();
      // Filter active certifications and sort by start_date (newest first), then by sortOrder
      const activeCertifications = data
        .filter((certification: Certification) => certification.isActive)
        .sort((a: Certification, b: Certification) => {
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
          if (dateA > dateB) return -1;
          if (dateA < dateB) return 1;
          return a.sortOrder - b.sortOrder;
        });
      setCertifications(activeCertifications);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (certifications.length === 0) {
    return (
      <section className='space-y-6'>
        <p className='text-gray-500 dark:text-gray-400'>
          No certification information available.
        </p>
      </section>
    );
  }

  return (
    <section className='space-y-6'>
      <div className='grid gap-3'>
        {certifications.map((certification) => (
          <CertificationCard key={certification.id} {...certification} />
        ))}
      </div>
    </section>
  );
};

export default CertificationList;
