import { useEffect, useState } from 'react';

import Loading from '@/common/components/elements/Loading';
import { EducationProps } from '@/common/types/education';

import EducationCard from './EducationCard';

interface Education extends EducationProps {
  id: number;
  isActive: boolean;
  sortOrder: number;
}

const EducationList = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const response = await fetch('/api/cms/education');
      const data = await response.json();
      // Filter active educations and sort by sortOrder first, then by start_year (newest first)
      const activeEducations = data
        .filter((education: Education) => education.isActive)
        .sort((a: Education, b: Education) => {
          if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }
          return b.start_year - a.start_year;
        });
      setEducations(activeEducations);
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (educations.length === 0) {
    return (
      <section className='space-y-6'>
        <p className='text-gray-500 dark:text-gray-400'>
          No education information available.
        </p>
      </section>
    );
  }

  return (
    <section className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-1'>
        {educations.map((education) => (
          <EducationCard key={education.id} {...education} />
        ))}
      </div>
    </section>
  );
};

export default EducationList;
