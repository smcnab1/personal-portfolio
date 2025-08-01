import { PrismaClient } from '@prisma/client';
import { CAREERS } from '@/common/constant/careers';
import { CERTS } from '@/common/constant/certs';
import { EDUCATION } from '@/common/constant/education';
import { PUBLICATIONS } from '@/common/constant/publications';
import { PROJECTS } from '@/common/constant/projects';
import { ABOUT } from '@/common/constant/about';

const prisma = new PrismaClient();

export async function migrateData() {
  console.log('Starting data migration...');

  try {
    // Migrate careers
    console.log('Migrating careers...');
    for (const career of CAREERS) {
      await prisma.career.upsert({
        where: {
          position_company: {
            position: career.position,
            company: career.company,
          },
        },
        update: {
          companyLegalName: career.company_legal_name,
          logo: career.logo,
          location: career.location,
          locationType: career.location_type,
          type: career.type,
          startDate: career.start_date,
          endDate: career.end_date,
          industry: career.industry,
          link: career.link,
          responsibilities: JSON.stringify(career.responsibilities),
        },
        create: {
          position: career.position,
          company: career.company,
          companyLegalName: career.company_legal_name,
          logo: career.logo,
          location: career.location,
          locationType: career.location_type,
          type: career.type,
          startDate: career.start_date,
          endDate: career.end_date,
          industry: career.industry,
          link: career.link,
          responsibilities: JSON.stringify(career.responsibilities),
        },
      });
    }

    // Migrate certifications
    console.log('Migrating certifications...');
    for (const cert of CERTS) {
      await prisma.certification.upsert({
        where: {
          membership_organisation: {
            membership: cert.membership,
            organisation: cert.organisation,
          },
        },
        update: {
          logo: cert.logo,
          type: cert.type,
          startDate: cert.start_date,
          endDate: cert.end_date,
          industry: cert.industry,
          link: cert.link,
          description: JSON.stringify(cert.description),
        },
        create: {
          membership: cert.membership,
          organisation: cert.organisation,
          logo: cert.logo,
          type: cert.type,
          startDate: cert.start_date,
          endDate: cert.end_date,
          industry: cert.industry,
          link: cert.link,
          description: JSON.stringify(cert.description),
        },
      });
    }

    // Migrate education
    console.log('Migrating education...');
    for (const edu of EDUCATION) {
      await prisma.education.upsert({
        where: {
          degree_school: {
            degree: edu.degree,
            school: edu.school,
          },
        },
        update: {
          major: edu.major,
          logo: edu.logo,
          location: edu.location,
          startYear: edu.start_year,
          endYear: edu.end_year,
          link: edu.link,
        },
        create: {
          degree: edu.degree,
          school: edu.school,
          major: edu.major,
          logo: edu.logo,
          location: edu.location,
          startYear: edu.start_year,
          endYear: edu.end_year,
          link: edu.link,
        },
      });
    }

    // Migrate publications
    console.log('Migrating publications...');
    for (const pub of PUBLICATIONS) {
      await prisma.publication.upsert({
        where: {
          title_journal: {
            title: pub.title,
            journal: pub.journal,
          },
        },
        update: {
          logo: pub.logo,
          location: pub.location,
          locationType: pub.location_type,
          type: pub.type,
          startDate: pub.start_date,
          link: pub.link,
          overview: JSON.stringify(pub.overview),
        },
        create: {
          title: pub.title,
          journal: pub.journal,
          logo: pub.logo,
          location: pub.location,
          locationType: pub.location_type,
          type: pub.type,
          startDate: pub.start_date,
          link: pub.link,
          overview: JSON.stringify(pub.overview),
        },
      });
    }

    // Migrate projects
    console.log('Migrating projects...');
    for (const project of PROJECTS) {
      await prisma.project.upsert({
        where: { slug: project.slug },
        update: {
          title: project.title,
          description: project.description,
          image: project.image,
          linkDemo: project.link_demo,
          linkGithub: project.link_github,
          stacks: project.stacks,
          isShow: project.is_show,
          isFeatured: project.is_featured,
        },
        create: {
          title: project.title,
          slug: project.slug,
          description: project.description,
          image: project.image,
          linkDemo: project.link_demo,
          linkGithub: project.link_github,
          stacks: project.stacks,
          isShow: project.is_show,
          isFeatured: project.is_featured,
        },
      });
    }

    // Migrate about content
    console.log('Migrating about content...');
    const existingAbout = await prisma.about.findFirst();
    if (!existingAbout) {
      await prisma.about.create({
        data: { content: ABOUT },
      });
    }

    // Create default site settings
    console.log('Creating default site settings...');
    const defaultSettings = [
      {
        key: 'site_name',
        value: 'Sam McNab',
        type: 'string',
        description: 'Site name',
      },
      {
        key: 'site_description',
        value: 'Personal portfolio of Sam McNab',
        type: 'string',
        description: 'Site description',
      },
      {
        key: 'contact_email',
        value: 'sam@sammcnab.co.uk',
        type: 'string',
        description: 'Contact email',
      },
      {
        key: 'github_url',
        value: 'https://github.com/sammcnab',
        type: 'string',
        description: 'GitHub URL',
      },
      {
        key: 'linkedin_url',
        value: '',
        type: 'string',
        description: 'LinkedIn URL',
      },
      {
        key: 'twitter_url',
        value: '',
        type: 'string',
        description: 'Twitter URL',
      },
      {
        key: 'enable_blog',
        value: 'true',
        type: 'boolean',
        description: 'Enable blog section',
      },
      {
        key: 'enable_projects',
        value: 'true',
        type: 'boolean',
        description: 'Enable projects section',
      },
    ];

    for (const setting of defaultSettings) {
      await prisma.siteSettings.upsert({
        where: { key: setting.key },
        update: {
          value: setting.value,
          type: setting.type,
          description: setting.description,
        },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.type,
          description: setting.description,
        },
      });
    }

    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
