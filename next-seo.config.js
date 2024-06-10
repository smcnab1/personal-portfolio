const canonicalUrl = 'https://sammcnab.co.uk';
const metaImage = 'https://sammcnab.co.uk/my-avatar.png';
const metaDescription =
  'Registered Paramedic, Coach, and Educator. I write about my experiences in healthcare, technology, and education.';

const defaultSEOConfig = {
  defaultTitle: 'Sam McNab - Personal Website',
  description: metaDescription,
  canonical: canonicalUrl,
  openGraph: {
    canonical: canonicalUrl,
    title: 'Sam McNab - Personal Website',
    description: metaDescription,
    type: 'website',
    images: [
      {
        url: metaImage,
        alt: 'sammcnab.co.uk og-image',
        width: 800,
        height: 600,
      },
      {
        url: metaImage,
        alt: 'sammcnab.co.uk og-image',
        width: 1200,
        height: 630,
      },
      {
        url: metaImage,
        alt: 'sammcnab.co.uk og-image',
        width: 1600,
        height: 900,
      },
    ],
    site_name: 'sammcnab.co.uk',
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
};

export default defaultSEOConfig;
