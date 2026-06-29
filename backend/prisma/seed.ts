import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('ngb2024', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@ngbinterior.com',
      role: 'admin'
    }
  });

  console.log('✓ Admin user created:', admin.username);

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
    await prisma.product.upsert({
      where: { id: product.name }, // Temporary unique constraint
      update: {},
      create: product
    }).catch(() => {
      // If upsert fails, create instead
      return prisma.product.create({ data: product });
    });
  }

  console.log('✓ Sample products created');

  // Optional: Create sample project
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
  }).catch(() => console.log('Sample project already exists'));

  console.log('✓ Sample project created');
  console.log('\n✓ Database seeded successfully!');
  console.log('\nAdmin credentials:');
  console.log('Username: admin');
  console.log('Password: ngb2024');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
