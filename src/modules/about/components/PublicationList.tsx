import { useEffect, useState } from 'react';

import Loading from '@/common/components/elements/Loading';

import PublicationCard from './PublicationCard';

interface Publication {
  id: number;
  title: string;
  journal: string;
  logo?: string;
  location?: string;
  location_type?: string;
  type: string;
  start_date: string;
  link?: string;
  overview: string[];
  isActive: boolean;
  sortOrder: number;
}

const PublicationList = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/cms/publications');
      const data = await response.json();
      // Filter active publications and sort by start_date (newest first), then by sortOrder
      const activePublications = data
        .filter((publication: Publication) => publication.isActive)
        .sort((a: Publication, b: Publication) => {
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
          if (dateA > dateB) return -1;
          if (dateA < dateB) return 1;
          return a.sortOrder - b.sortOrder;
        });
      setPublications(activePublications);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (publications.length === 0) {
    return (
      <section className='space-y-6'>
        <p className='text-gray-500 dark:text-gray-400'>
          No publication information available.
        </p>
      </section>
    );
  }

  return (
    <section className='space-y-6'>
      <div className='grid gap-3'>
        {publications.map((publication) => (
          <PublicationCard key={publication.id} {...publication} />
        ))}
      </div>
    </section>
  );
};

export default PublicationList;
