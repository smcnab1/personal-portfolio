import { useEffect, useState } from 'react';

import Loading from '@/common/components/elements/Loading';

import CareerCard from './CareerCard';

interface Career {
  id: number;
  position: string;
  company: string;
  company_legal_name?: string | null;
  logo: string | null;
  location: string;
  location_type: string;
  type: string;
  start_date: string;
  end_date: string | null;
  industry: string;
  link: string | null;
  responsibilities?: string[];
  isActive: boolean;
  sortOrder: number;
}

const CareerList = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await fetch('/api/cms/careers');
      const data = await response.json();
      // Filter active careers and sort by sortOrder first, then by start_date (newest first)
      const activeCareers = data
        .filter((career: Career) => career.isActive)
        .sort((a: Career, b: Career) => {
          if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
          return dateB.getTime() - dateA.getTime();
        });
      setCareers(activeCareers);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (careers.length === 0) {
    return (
      <section className='space-y-6'>
        <p className='text-gray-500 dark:text-gray-400'>
          No career information available.
        </p>
      </section>
    );
  }

  return (
    <section className='space-y-6'>
      <div className='grid gap-3'>
        {careers.map((career) => (
          <CareerCard key={career.id} {...career} />
        ))}
      </div>
    </section>
  );
};

export default CareerList;
