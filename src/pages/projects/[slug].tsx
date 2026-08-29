import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';

import BackButton from '@/common/components/elements/BackButton';
import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import { PROJECTS } from '@/common/constant/projects';
import { ProjectItemProps } from '@/common/types/projects';
import ProjectDetail from '@/modules/projects/components/ProjectDetail';

interface ProjectsDetailPageProps {
  project: ProjectItemProps;
}

const ProjectsDetailPage: NextPage<ProjectsDetailPageProps> = ({ project }) => {
  const PAGE_TITLE = project?.title;
  const PAGE_DESCRIPTION = project?.description;

  const canonicalUrl = `https://sammcnab.co.uk/projects/${project?.slug}`;

  return (
    <>
      <NextSeo
        title={`${project?.title} - Project Sam McNab`}
        description={project?.description}
        canonical={canonicalUrl}
        openGraph={{
          type: 'article',
          article: {
            publishedTime: project?.updatedAt.toString(),
            modifiedTime: project?.updatedAt.toString(),
            authors: ['Sam McNab'],
          },
          url: canonicalUrl,
          images: [
            {
              url: project?.image || '/images/placeholder.png',
            },
          ],
          siteName: 'Sam McNab',
        }}
      />
      <Container data-aos='fade-up'>
        <BackButton url='/projects' />
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <ProjectDetail {...project} />
      </Container>
    </>
  );
};

export default ProjectsDetailPage;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: PROJECTS.filter((project) => project.isShow).map((project) => ({
    params: { slug: project.slug },
  })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = PROJECTS.find(
    (item) => item.isShow && item.slug === String(params?.slug),
  );

  if (!project) return { notFound: true };

  return {
    props: {
      project: JSON.parse(JSON.stringify(project)),
    },
  };
};
