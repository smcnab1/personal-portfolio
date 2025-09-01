#!/usr/bin/env node

/**
 * Production Data Import Script
 *
 * Run this script on your production server to import the exported data.
 * Make sure to backup your production database first!
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('🚀 Starting data import...');

    // Load the complete export
    const exportPath = path.join(__dirname, 'exports', 'complete-export.json');

    if (!fs.existsSync(exportPath)) {
      throw new Error(
        'Export file not found. Please upload the exports directory first.',
      );
    }

    const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    const { data } = exportData;

    console.log(`📅 Importing data from: ${exportData.exportDate}`);

    // Import in order (respecting dependencies)

    // 1. Site Settings
    if (data.siteSettings?.length > 0) {
      await prisma.siteSettings.deleteMany(); // Clear existing
      await prisma.siteSettings.createMany({
        data: data.siteSettings.map(({ id, ...item }) => item),
      });
      console.log(`✅ Imported ${data.siteSettings.length} site settings`);
    }

    // 2. About content
    if (data.about?.length > 0) {
      await prisma.about.deleteMany(); // Clear existing
      await prisma.about.createMany({
        data: data.about.map(({ id, ...item }) => item),
      });
      console.log(`✅ Imported ${data.about.length} about entries`);
    }

    // 3. Careers
    if (data.careers?.length > 0) {
      await prisma.career.deleteMany(); // Clear existing
      await prisma.career.createMany({
        data: data.careers.map(({ id, ...item }) => item),
      });
      console.log(`✅ Imported ${data.careers.length} career entries`);
    }

    // 4. Certifications
    if (data.certifications?.length > 0) {
      await prisma.certification.deleteMany(); // Clear existing
      await prisma.certification.createMany({
        data: data.certifications.map(({ id, ...item }) => item),
      });
      console.log(`✅ Imported ${data.certifications.length} certifications`);
    }

    // 5. Education
    if (data.education?.length > 0) {
      await prisma.education.deleteMany(); // Clear existing
      await prisma.education.createMany({
        data: data.education.map(({ id, ...item }) => item),
      });
      console.log(`✅ Imported ${data.education.length} education entries`);
    }

    // 6. Publications
    if (data.publications?.length > 0) {
      await prisma.publication.deleteMany(); // Clear existing
      await prisma.publication.createMany({
        data: data.publications.map(({ id, ...item }) => item),
      });
      console.log(`✅ Imported ${data.publications.length} publications`);
    }

    // 7. Projects
    if (data.projects?.length > 0) {
      await prisma.project.deleteMany(); // Clear existing
      await prisma.project.createMany({
        data: data.projects.map(({ id, ...item }) => item),
      });
      console.log(`✅ Imported ${data.projects.length} projects`);
    }

    // 8. Blogs
    if (data.blogs?.length > 0) {
      await prisma.blog.deleteMany(); // Clear existing
      await prisma.blog.createMany({
        data: data.blogs.map(({ id, ...item }) => item),
      });
      console.log(`✅ Imported ${data.blogs.length} blog posts`);
    }

    // 9. CMS Users (optional - handle carefully in production)
    if (data.cmsUsers?.length > 0) {
      console.log(
        '⚠️  CMS Users found in export. Skipping import for security.',
      );
      console.log('   Create admin users manually in production if needed.');
    }

    console.log('✨ Data import completed successfully!');
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  importData();
}

module.exports = { importData };
