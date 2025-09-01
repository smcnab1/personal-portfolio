#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up CMS for Personal Portfolio...\n');

try {
  // Step 1: Install dependencies if needed
  console.log('📦 Checking dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Step 2: Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Step 3: Run database migrations
  console.log('🗄️ Running database migrations...');
  execSync('npx prisma migrate dev --name init-cms', { stdio: 'inherit' });

  // Step 4: Run data migration
  console.log('📊 Migrating existing data...');
  execSync('npx tsx src/lib/cms/migrate.ts', { stdio: 'inherit' });

  console.log('\n✅ CMS setup completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Visit /cms to access the content management system');
  console.log('2. Update your content through the CMS interface');
  console.log(
    '3. Your site will now pull data from the database instead of constants',
  );
  console.log(
    '\n💡 Tip: You can now edit your career, certifications, and other content without touching code!',
  );
} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure you have Node.js and npm installed');
  console.log('2. Check that your DATABASE_URL is set in .env');
  console.log('3. Ensure you have write permissions in the project directory');
  process.exit(1);
}
