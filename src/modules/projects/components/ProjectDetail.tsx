import Image from '@/common/components/elements/Image';
import MDXComponent from '@/common/components/elements/MDXComponent';
import Tooltip from '@/common/components/elements/Tooltip';
import { STACKS } from '@/common/constant/stacks';
import { parseStacks } from '@/common/helpers';
import { ProjectItemProps } from '@/common/types/projects';

import ProjectLink from './ProjectLink';

const ProjectDetail = ({
  title,
  image,
  stacks,
  linkDemo,
  linkGithub,
  content,
}: ProjectItemProps) => {
  const stacksArray = parseStacks(stacks);

  return (
    <div className='space-y-8'>
      <div className='flex flex-col items-start justify-between gap-5 sm:flex-row lg:flex-row lg:items-center'>
        <div className='flex flex-wrap items-center gap-2'>
          <span className='mb-1 text-[15px] text-neutral-700 dark:text-neutral-300'>
            Tech Stack :
          </span>
          <div className='flex flex-wrap items-center gap-3'>
            {stacksArray?.map((stack: string, index: number) => (
              <div key={index}>
                <Tooltip title={stack}>{STACKS[stack]}</Tooltip>
              </div>
            ))}
          </div>
        </div>
        <ProjectLink
          title={title}
          linkDemo={linkDemo}
          linkGithub={linkGithub}
        />
      </div>
      <Image
        src={image || '/images/placeholder.png'}
        width={800}
        height={400}
        alt={title}
        className='hover:scale-105'
      />
      {content && (
        <div className='mt-5 space-y-6 leading-[1.8] dark:text-neutral-300'>
          <MDXComponent>{content}</MDXComponent>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
