import fs from 'node:fs';
import path from 'node:path';

import { MENU_ITEMS, SOCIAL_MEDIA } from '@/common/constant/menu';
import { PROJECTS } from '@/common/constant/projects';

const repositoryRoot = process.cwd();

const publicProfileFiles = [
  'src/modules/home/components/Introduction.tsx',
  'src/modules/home/components/Services.tsx',
  'src/modules/about/components/Story.tsx',
  'src/common/components/sidebar/ProfileHeader.tsx',
].map((file) => fs.readFileSync(path.join(repositoryRoot, file), 'utf8'));

describe('privacy-focused public profile', () => {
  it('keeps only the intended public navigation', () => {
    expect(
      MENU_ITEMS.filter((item) => item.isShow).map((item) => item.href),
    ).toEqual(['/', '/projects', '/about', '/contact', '/legal']);
  });

  it('keeps professional contact links without displaying the GitHub handle', () => {
    expect(SOCIAL_MEDIA.map((item) => item.title)).toEqual([
      'Email',
      'LinkedIn',
      'GitHub',
    ]);
    expect(publicProfileFiles.join('\n')).not.toContain('@smc' + 'nab1');
  });

  it('does not publish excluded locations, interests or availability', () => {
    const publicProfile = publicProfileFiles.join('\n').toLowerCase();

    for (const excludedText of [
      'bucking' + 'hamshire',
      'high ' + 'wycombe',
      'edin' + 'burgh',
      'cyber' + 'security',
      'cyber ' + 'security',
      'free' + 'lance',
      'private ' + 'tutoring',
    ]) {
      expect(publicProfile).not.toContain(excludedText);
    }
  });

  it('retains the limited professional identity and selected projects', () => {
    const publicProfile = publicProfileFiles.join('\n');

    expect(publicProfile).toContain('University Lecturer');
    expect(publicProfile).toContain('Registered Paramedic');
    expect(publicProfile).toContain('immersive technologies');
    expect(PROJECTS.filter((project) => project.isShow)).toHaveLength(2);
  });

  it('pins generated sitemap URLs to the working apex domain', () => {
    const sitemapConfig = fs.readFileSync(
      path.join(repositoryRoot, 'next-sitemap.config.js'),
      'utf8',
    );

    expect(sitemapConfig).toContain("siteUrl: 'https://sammcnab.co.uk'");
    expect(sitemapConfig).not.toContain('process.env.SITE_URL');
  });

  it.each([
    'src/pages/blog/index.tsx',
    'src/pages/guestbook.tsx',
    'src/pages/learn/index.tsx',
    'src/pages/auth/signin.tsx',
    'src/pages/cms.tsx',
    'prisma/dev.db',
    'scripts/exports/complete-export.json',
  ])('removes %s from the current public tree', (file) => {
    expect(fs.existsSync(path.join(repositoryRoot, file))).toBe(false);
  });
});
