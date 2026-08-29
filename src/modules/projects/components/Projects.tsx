import EmptyState from '@/common/components/elements/EmptyState';
import { ProjectsProps } from '@/common/types/projects';

import ProjectCard from './ProjectCard';

const Projects = ({ projects }: ProjectsProps) => {
  const filteredProjects = projects.filter((project) => project?.isShow);

  if (filteredProjects.length === 0) {
    return <EmptyState message='No Data' />;
  }

  return (
    <div className='grid gap-5 px-1 pt-2 sm:grid-cols-2'>
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
};

export default Projects;
