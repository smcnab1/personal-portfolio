#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createPostgresUser() {
  try {
    console.log('🔐 Creating CMS user in PostgreSQL database...');

    // Check database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Check if CMSUser table exists and has any users
    const userCount = await prisma.cMSUser.count();
    console.log(`📊 Current users in database: ${userCount}`);

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const newUser = await prisma.cMSUser.create({
      data: {
        email: 'admin@sammcnab.co.uk',
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('User ID:', newUser.id);
    console.log('Email:', newUser.email);
    console.log('Role:', newUser.role);

    // Create editor user
    const editorPassword = await bcrypt.hash('editor123', 12);

    const editorUser = await prisma.cMSUser.create({
      data: {
        email: 'editor@sammcnab.co.uk',
        password: editorPassword,
        role: 'editor',
        name: 'Content Editor',
      },
    });

    console.log('✅ Editor user created successfully!');
    console.log('User ID:', editorUser.id);
    console.log('Email:', editorUser.email);
    console.log('Role:', editorUser.role);

    console.log('\n📋 CMS Login Details:');
    console.log('=====================================');
    console.log('Admin User:');
    console.log('  Email: admin@sammcnab.co.uk');
    console.log('  Password: admin123');
    console.log('  Role: admin');
    console.log('');
    console.log('Editor User:');
    console.log('  Email: editor@sammcnab.co.uk');
    console.log('  Password: editor123');
    console.log('  Role: editor');
    console.log('=====================================');

    console.log('\n⚠️  IMPORTANT: Change these passwords after first login!');
  } catch (error) {
    console.error('❌ Error creating CMS user:', error);

    if (
      error.message.includes('connect') ||
      error.message.includes('DATABASE_URL')
    ) {
      console.log('\n💡 Database connection issue detected.');
      console.log(
        'Make sure your DATABASE_URL environment variable is set correctly.',
      );
      console.log(
        'For production: DATABASE_URL="postgresql://username:password@host:port/database"',
      );
    } else if (
      error.message.includes('table') ||
      error.message.includes('CMSUser')
    ) {
      console.log(
        '\n💡 Table not found. Make sure to run database migrations first:',
      );
      console.log('npx prisma db push');
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createPostgresUser();
