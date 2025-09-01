import {
  HiCash as PaymentTermsIcon,
  HiFingerPrint as PrivacyIcon,
  HiGlobe as CookiesIcon,
} from 'react-icons/hi';

import { Tabs } from '@/common/components/elements/Tabs';

import CookiesPolicy from './CookiesPolicy';
import PaymentTerms from './PaymentTerms';
import PrivacyPolicy from './PrivacyPolicy';

const Legal = () => {
  const TABS = [
    {
      label: (
        <TabLabel>
          <PaymentTermsIcon size={17} /> Payment Terms
        </TabLabel>
      ),
      children: <PaymentTerms />,
    },
    {
      label: (
        <TabLabel>
          <PrivacyIcon size={17} /> Privacy Policy
        </TabLabel>
      ),
      children: <PrivacyPolicy />,
    },
    {
      label: (
        <TabLabel>
          <CookiesIcon size={17} /> Cookies Policy
        </TabLabel>
      ),
      children: <CookiesPolicy />,
    },
  ];
  return <Tabs tabs={TABS} />;
};

export default Legal;

const TabLabel = ({ children }: { children: React.ReactNode }) => (
  <div className='flex items-center justify-center gap-1.5'>{children}</div>
);
