import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useState, useEffect } from 'react';

import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import { ProjectItemProps } from '@/common/types/projects';
import Projects from '@/modules/projects';

const PAGE_TITLE = 'Projects';
const PAGE_DESCRIPTION =
  'Several projects that I have worked on, both private and open source.';

const ProjectsPage: NextPage = () => {
  const [projects, setProjects] = useState<ProjectItemProps[]>([]);
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        console.log('Projects API response:', data);
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        console.log('Data structure:', data);
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const loadMore = () => setVisibleProjects((prev) => prev + 2);
  const hasMore = Array.isArray(projects) && visibleProjects < projects.length;

  if (loading) {
    return (
      <Container data-aos='fade-up'>
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <div className='py-8 text-center'>Loading projects...</div>
      </Container>
    );
  }

  return (
    <>
      <NextSeo title={`${PAGE_TITLE} - Sam McNab`} />
      <Container data-aos='fade-up'>
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <Projects
          projects={
            Array.isArray(projects) ? projects.slice(0, visibleProjects) : []
          }
          loadMore={loadMore}
          hasMore={hasMore}
        />
      </Container>
    </>
  );
};

export default ProjectsPage;
