module.exports = {
  siteUrl: process.env.SITE_URL || 'https://sammcnab.co.uk',
  generateRobotsTxt: true,
  exclude: [
    '/api/*',
    '/auth/*',
    '/blog',
    '/blog/*',
    '/cms',
    '/guestbook',
    '/learn',
    '/learn/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/cms'],
      },
    ],
  },
};
