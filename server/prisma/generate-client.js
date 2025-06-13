#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Generate Prisma client
console.log('Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Error generating Prisma client:', error);
  process.exit(1);
}

// Check if there are any pending migrations
console.log('Checking for pending migrations...');
try {
  const status = execSync('npx prisma migrate status', { encoding: 'utf8' });
  if (status.includes('Database schema is up to date')) {
    console.log('Database schema is up to date.');
  } else {
    console.log('There are pending migrations. Run `npx prisma migrate dev` to apply them.');
  }
} catch (error) {
  console.error('Error checking migration status:', error);
}
