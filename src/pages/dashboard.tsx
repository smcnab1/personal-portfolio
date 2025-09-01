import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { SWRConfig } from 'swr';

import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import Dashboard from '@/modules/dashboard';

interface DashboardPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fallback: any;
}

const PAGE_TITLE = 'Dashboard';
const PAGE_DESCRIPTION =
  'This is my personal dashboard, built with Next.js API routes deployed as serverless functions.';

const DashboardPage: NextPage<DashboardPageProps> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <NextSeo title={`${PAGE_TITLE} - Sam McNab`} />
      <Container data-aos='fade-up'>
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <Dashboard />
      </Container>
    </SWRConfig>
  );
};

export default DashboardPage;

export const getStaticProps: GetStaticProps = async () => {
  // Skip external API calls during build to prevent 401 errors
  // Data will be fetched client-side via SWR
  return {
    props: {
      fallback: {},
    },
    revalidate: 1,
  };
};
