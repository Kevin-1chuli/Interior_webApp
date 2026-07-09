import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create manager user
  const hashedPassword = await bcrypt.hash('ngb2024', 10);
  
  const manager = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { role: 'MANAGER' }, // Update existing admin to MANAGER
    create: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@ngbinterior.com',
      role: 'MANAGER'
    }
  });

  console.log('✓ Manager account created:', manager.username, `(${manager.role})`);

  // Optional: Create sample products
  const sampleProducts = [
    {
      name: 'Modern L-Shaped Sofa',
      description: 'Comfortable L-shaped sofa with premium fabric',
      category: 'sofas',
      price: 2500000,
      currency: 'UGX',
      materials: ['Fabric', 'Wood Frame'],
      dimensions: '280cm x 180cm x 85cm',
      images: [],
      isAvailable: true
    },
    {
      name: 'Executive Office Desk',
      description: 'Premium wooden desk with storage',
      category: 'office',
      price: 1800000,
      currency: 'UGX',
      materials: ['Solid Wood', 'Metal Handles'],
      dimensions: '160cm x 80cm x 75cm',
      images: [],
      isAvailable: true
    }
  ];

  for (const product of sampleProducts) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name }
    });
    
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  console.log('✓ Sample products created');

  // Optional: Create sample project
  const existingProject = await prisma.project.findFirst({
    where: { title: 'Modern Living Room Transformation' }
  });

  if (!existingProject) {
    await prisma.project.create({
      data: {
        title: 'Modern Living Room Transformation',
        location: 'Kampala, Uganda',
        category: 'Living Room',
        style: 'Modern',
        problem: 'Outdated furniture and poor space utilization',
        solution: 'Complete redesign with modern furniture and optimized layout',
        beforeImages: [],
        afterImages: [],
        budgetRange: '5M - 10M UGX',
        isFeatured: true
      }
    });
  }

  console.log('✓ Sample project created');
  console.log('\n✓ Database seeded successfully!');
  console.log('\nManager credentials:');
  console.log('Username: admin');
  console.log('Password: ngb2024');
  console.log('Role: MANAGER');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
