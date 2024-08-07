import {
  HiOutlineAcademicCap as EducationIcon,
  HiOutlineBookmark as AboutIcon,
  HiOutlineBriefcase as CareerIcon,
  HiOutlineDocumentText as CertIcon,
  HiOutlineNewspaper as PublicationIcon,

} from 'react-icons/hi';

import { Tabs } from '@/common/components/elements/Tabs';

import CareerList from './CareerList';
import PublicationList from './PublicationList';
import EducationList from './EducationList';
import CertificationList from './CertificationList';
import Story from './Story';

const About = () => {
  const TABS = [
    {
      label: (
        <TabLabel>
          <AboutIcon size={17} /> Intro
        </TabLabel>
      ),
      children: <Story />,
    },
    {
      label: (
        <TabLabel>
          <CareerIcon size={17} /> Career
        </TabLabel>
      ),
      children: <CareerList />,
    },
    {
      label: (
        <TabLabel>
          <EducationIcon size={17} /> Education
        </TabLabel>
      ),
      children: <EducationList />,
    },
    {
      label: (
        <TabLabel>
          <CertIcon size={17} /> Certifications
        </TabLabel>
      ),
      children: <CertificationList />,
    },
    {
      label: (
        <TabLabel>
          <PublicationIcon size={17} /> Publications
        </TabLabel>
      ),
      children: <PublicationList />,
    },
  ];
  return <Tabs tabs={TABS} />;
};

export default About;

const TabLabel = ({ children }: { children: React.ReactNode }) => (
  <div className='flex items-center justify-center gap-1.5'>{children}</div>
);
