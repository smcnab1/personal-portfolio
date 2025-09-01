#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCMSUser() {
  try {
    console.log('🔐 CMS User Management');
    console.log('========================\n');

    // Get command line arguments
    const args = process.argv.slice(2);
    const command = args[0];

    if (command === 'update') {
      // Update existing user
      const email = args[1] || 'admin@sammcnab.co.uk';
      const newPassword = args[2];

      if (!newPassword) {
        console.log('❌ Please provide a new password');
        console.log(
          'Usage: node scripts/update-cms-user.js update [email] [newPassword]',
        );
        process.exit(1);
      }

      console.log(`🔄 Updating user: ${email}`);

      const existingUser = await prisma.cMSUser.findUnique({
        where: { email },
      });

      if (!existingUser) {
        console.log(`❌ User ${email} not found`);
        process.exit(1);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.cMSUser.update({
        where: { email },
        data: { password: hashedPassword },
      });

      console.log(`✅ Password updated successfully for ${email}`);
      console.log(`New password: ${newPassword}`);
    } else if (command === 'create') {
      // Create new user
      const email = args[1];
      const password = args[2];
      const name = args[3] || 'CMS User';
      const role = args[4] || 'admin';

      if (!email || !password) {
        console.log('❌ Please provide email and password');
        console.log(
          'Usage: node scripts/update-cms-user.js create [email] [password] [name] [role]',
        );
        process.exit(1);
      }

      console.log(`📝 Creating new user: ${email}`);

      // Check if user already exists
      const existingUser = await prisma.cMSUser.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log(`❌ User ${email} already exists`);
        process.exit(1);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.cMSUser.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
        },
      });

      console.log(`✅ User created successfully!`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log(`Name: ${name}`);
      console.log(`Role: ${role}`);
    } else if (command === 'list') {
      // List all users
      console.log('📋 Current CMS Users:');
      console.log('=====================\n');

      const users = await prisma.cMSUser.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      if (users.length === 0) {
        console.log('No CMS users found');
      } else {
        users.forEach((user, index) => {
          console.log(`${index + 1}. ${user.email} (${user.role})`);
          console.log(`   Name: ${user.name || 'N/A'}`);
          console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
          console.log('');
        });
      }
    } else if (command === 'delete') {
      // Delete user
      const email = args[1];

      if (!email) {
        console.log('❌ Please provide email to delete');
        console.log('Usage: node scripts/update-cms-user.js delete [email]');
        process.exit(1);
      }

      console.log(`🗑️  Deleting user: ${email}`);

      const existingUser = await prisma.cMSUser.findUnique({
        where: { email },
      });

      if (!existingUser) {
        console.log(`❌ User ${email} not found`);
        process.exit(1);
      }

      await prisma.cMSUser.delete({
        where: { email },
      });

      console.log(`✅ User ${email} deleted successfully`);
    } else {
      // Show help
      console.log('🔐 CMS User Management Script');
      console.log('==============================\n');
      console.log('Available commands:');
      console.log('');
      console.log(
        '  update [email] [newPassword]  - Update existing user password',
      );
      console.log(
        '  create [email] [password] [name] [role] - Create new user',
      );
      console.log('  list                          - List all CMS users');
      console.log('  delete [email]                - Delete user');
      console.log('');
      console.log('Examples:');
      console.log(
        '  node scripts/update-cms-user.js update admin@sammcnab.co.uk newpassword123',
      );
      console.log(
        '  node scripts/update-cms-user.js create editor@example.com password123 "Editor User" editor',
      );
      console.log('  node scripts/update-cms-user.js list');
      console.log(
        '  node scripts/update-cms-user.js delete olduser@example.com',
      );
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateCMSUser();
