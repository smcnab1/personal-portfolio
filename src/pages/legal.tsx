import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import Legal from '@/modules/legal';

const PAGE_TITLE = 'Legal';
const PAGE_DESCRIPTION =
  'Legal information about this website and my work, including terms of service and privacy policy.';

const LegalPage: NextPage = () => {
  return (
    <>
      <NextSeo title={`${PAGE_TITLE} - Sam McNab`} />
      <Container data-aos='fade-up'>
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <Legal />
      </Container>
    </>
  );
};

export default LegalPage;
