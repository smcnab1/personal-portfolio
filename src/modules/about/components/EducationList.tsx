import { useEffect, useState } from 'react';

import Loading from '@/common/components/elements/Loading';

import EducationCard from './EducationCard';

interface Education {
  id: number;
  degree: string;
  school: string;
  major?: string;
  logo?: string;
  location?: string;
  start_year: number;
  end_year?: number;
  link?: string;
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
      // Filter active educations and sort by start_year (newest first), then by sortOrder
      const activeEducations = data
        .filter((education: Education) => education.isActive)
        .sort((a: Education, b: Education) => {
          if (a.start_year > b.start_year) return -1;
          if (a.start_year < b.start_year) return 1;
          return a.sortOrder - b.sortOrder;
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
