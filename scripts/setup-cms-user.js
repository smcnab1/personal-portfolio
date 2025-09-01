#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupCMSUser() {
  try {
    console.log('🔐 Setting up CMS user...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log(
      'Database provider:',
      process.env.DATABASE_URL?.includes('postgres') ? 'PostgreSQL' : 'SQLite',
    );

    // Check if user already exists
    const existingUser = await prisma.cMSUser.findUnique({
      where: { email: 'admin@sammcnab.co.uk' },
    });

    if (existingUser) {
      console.log('⚠️  CMS user already exists, updating password...');

      // Update existing user's password
      const hashedPassword = await bcrypt.hash('admin123', 12);

      await prisma.cMSUser.update({
        where: { email: 'admin@sammcnab.co.uk' },
        data: {
          password: hashedPassword,
          role: 'admin',
          name: 'Admin User',
        },
      });

      console.log('✅ CMS user password updated successfully!');
    } else {
      console.log('📝 Creating new CMS user...');

      // Create new user
      const hashedPassword = await bcrypt.hash('admin123', 12);

      await prisma.cMSUser.create({
        data: {
          email: 'admin@sammcnab.co.uk',
          password: hashedPassword,
          role: 'admin',
          name: 'Admin User',
        },
      });

      console.log('✅ CMS user created successfully!');
    }

    console.log('\n📋 CMS Login Details:');
    console.log('Email: admin@sammcnab.co.uk');
    console.log('Password: admin123');
    console.log('Role: admin');

    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
  } catch (error) {
    console.error('❌ Error setting up CMS user:', error);

    if (
      error.message.includes('connect') ||
      error.message.includes('DATABASE_URL')
    ) {
      console.log('\n💡 Database connection issue detected.');
      console.log(
        'Make sure your DATABASE_URL environment variable is set correctly.',
      );
      console.log('For local development: DATABASE_URL="file:./prisma/dev.db"');
      console.log(
        'For production: DATABASE_URL="postgresql://username:password@host:port/database"',
      );
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupCMSUser();
