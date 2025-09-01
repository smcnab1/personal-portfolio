import { PrismaClient } from '@prisma/client';

import { BlogItemProps } from '@/common/types/blog';
import { CareerProps } from '@/common/types/careers';
import { CertProps } from '@/common/types/certs';
import { EducationProps } from '@/common/types/education';
import { ProjectItemProps } from '@/common/types/projects';
import { PublicationProps } from '@/common/types/publications';

const prisma = new PrismaClient();

// Centralized content management with database integration
export class CMS {
  // Careers
  static async getCareers(): Promise<CareerProps[]> {
    try {
      const careers = await prisma.career.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      return careers.map((career) => ({
        position: career.position,
        company: career.company,
        company_legal_name: career.companyLegalName,
        logo: career.logo,
        location: career.location,
        location_type: career.locationType,
        type: career.type,
        start_date: career.startDate,
        end_date: career.endDate,
        industry: career.industry,
        link: career.link,
        responsibilities: JSON.parse(career.responsibilities),
      }));
    } catch (error) {
      console.error('Failed to fetch careers:', error);
      return [];
    }
  }

  // Certifications
  static async getCertifications(): Promise<CertProps[]> {
    try {
      const certifications = await prisma.certification.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      return certifications.map((cert) => ({
        membership: cert.membership,
        organisation: cert.organisation,
        logo: cert.logo,
        type: cert.type,
        start_date: cert.startDate,
        end_date: cert.endDate,
        industry: cert.industry,
        link: cert.link,
        description: JSON.parse(cert.description),
      }));
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
      return [];
    }
  }

  // Education
  static async getEducation(): Promise<EducationProps[]> {
    try {
      const education = await prisma.education.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      return education.map((edu) => ({
        degree: edu.degree,
        school: edu.school,
        major: edu.major,
        logo: edu.logo,
        location: edu.location,
        start_year: edu.startYear,
        end_year: edu.endYear,
        link: edu.link,
      }));
    } catch (error) {
      console.error('Failed to fetch education:', error);
      return [];
    }
  }

  // Publications
  static async getPublications(): Promise<PublicationProps[]> {
    try {
      const publications = await prisma.publication.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });

      return publications.map((pub) => ({
        title: pub.title,
        journal: pub.journal,
        logo: pub.logo,
        location: pub.location,
        location_type: pub.locationType,
        type: pub.type,
        start_date: pub.startDate,
        link: pub.link,
        overview: JSON.parse(pub.overview),
      }));
    } catch (error) {
      console.error('Failed to fetch publications:', error);
      return [];
    }
  }

  // Projects
  static async getProjects(): Promise<ProjectItemProps[]> {
    try {
      const projects = await prisma.project.findMany({
        where: { isShow: true },
        orderBy: { sortOrder: 'asc' },
      });

      return projects.map((project) => ({
        title: project.title,
        slug: project.slug,
        description: project.description,
        image: project.image,
        link_demo: project.linkDemo,
        link_github: project.linkGithub,
        stacks: project.stacks,
        is_show: project.isShow,
        is_featured: project.isFeatured,
        updated_at: project.updatedAt,
      }));
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  }

  // About content
  static async getAbout(): Promise<string> {
    try {
      const about = await prisma.about.findFirst({
        orderBy: { updatedAt: 'desc' },
      });
      return about?.content || '';
    } catch (error) {
      console.error('Failed to fetch about content:', error);
      return '';
    }
  }

  // Site settings
  static async getSiteSettings(): Promise<Record<string, unknown>> {
    try {
      const settings = await prisma.siteSettings.findMany({
        orderBy: { key: 'asc' },
      });

      return settings.reduce(
        (acc, setting) => {
          let value: unknown = setting.value;

          if (setting.type === 'number') {
            value = parseFloat(value as string);
          } else if (setting.type === 'boolean') {
            value = value === 'true';
          } else if (setting.type === 'json') {
            try {
              value = JSON.parse(value as string);
            } catch {
              // Keep original value if JSON parsing fails
            }
          }

          acc[setting.key] = value;
          return acc;
        },
        {} as Record<string, unknown>,
      );
    } catch (error) {
      console.error('Failed to fetch site settings:', error);
      return {};
    }
  }

  // Blog posts (placeholder for future implementation)
  static async getBlogPosts(): Promise<BlogItemProps[]> {
    try {
      const posts = await prisma.blog.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      });

      return posts.map((post) => ({
        id: post.id,
        date: post.createdAt.toISOString(),
        modified: post.updatedAt.toISOString(),
        slug: post.slug,
        status: 'publish',
        link: `/blog/${post.slug}`,
        title: {
          rendered: post.title,
        },
        content: {
          rendered: post.content,
          markdown: post.content,
          protected: false,
        },
        excerpt: {
          rendered: post.excerpt || '',
          protected: false,
        },
        author: '1',
        featured_media: '0',
        comment_status: 'open',
        ping_status: 'open',
        sticky: false,
        template: '',
        format: 'standard',
        meta: {
          footnotes: '',
        },
        categories: ['1'],
        tags: ['1'],
        tags_list: [],
        amp_enabled: false,
        featured_image_url: '/images/placeholder.png',
        total_views_count: post.views.toString(),
      }));
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      return [];
    }
  }

  // Helper methods for filtering and searching
  static async getCareersByIndustry(industry: string): Promise<CareerProps[]> {
    const careers = await this.getCareers();
    return careers.filter((career) => career.industry?.includes(industry));
  }

  static async getCurrentCareers(): Promise<CareerProps[]> {
    const careers = await this.getCareers();
    return careers.filter((career) => career.end_date === null);
  }

  static async getCertificationsByType(type: string): Promise<CertProps[]> {
    const certifications = await this.getCertifications();
    return certifications.filter((cert) => cert.type === type);
  }

  static async getCurrentCertifications(): Promise<CertProps[]> {
    const certifications = await this.getCertifications();
    return certifications.filter((cert) => cert.end_date === null);
  }
}

// Export individual getters for backward compatibility
export const getCareers = () => CMS.getCareers();
export const getCertifications = () => CMS.getCertifications();
export const getEducation = () => CMS.getEducation();
export const getPublications = () => CMS.getPublications();
export const getProjects = () => CMS.getProjects();
export const getBlogPosts = () => CMS.getBlogPosts();
export const getAbout = () => CMS.getAbout();
export const getSiteSettings = () => CMS.getSiteSettings();
