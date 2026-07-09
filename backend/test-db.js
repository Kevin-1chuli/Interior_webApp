// Simple database connection test
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✓ Successfully connected to database');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`✓ Found ${userCount} users in database`);
    
    const categoryCount = await prisma.category.count();
    console.log(`✓ Found ${categoryCount} categories in database`);
    
    console.log('\n✓ All database operations successful');
  } catch (error) {
    console.error('✗ Database connection failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
