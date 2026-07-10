/**
 * Test Categories API Response
 * Check what categories the API actually returns
 */

import prisma from '../prisma';

async function testCategoriesApi() {
  console.log('🔍 Testing Categories API Response\n');
  
  // Simulate the categories API endpoint
  console.log('STEP 1: Database Query (what getCategories controller does)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const where: any = {};
  where.isActive = true; // Default behavior
  
  const categories = await prisma.category.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  console.log(`Found ${categories.length} active categories:\n`);
  
  categories.forEach((cat, index) => {
    console.log(`${index + 1}. ${cat.name}`);
    console.log(`   Slug: "${cat.slug}"`);
    console.log(`   ID: ${cat.id}`);
    console.log(`   Active: ${cat.isActive}`);
    console.log(`   Sort Order: ${cat.sortOrder}`);
    console.log(`   Product Count: ${cat._count.products}`);
    console.log('');
  });

  // Check specifically for Office Furniture
  const officeCat = categories.find(cat => 
    cat.slug.includes('office') || cat.name.toLowerCase().includes('office')
  );

  if (officeCat) {
    console.log('✅ Office Furniture category IS in the response');
    console.log(`   Will be added to grouped["${officeCat.slug}"] = []`);
  } else {
    console.log('❌ Office Furniture category is NOT in the response');
    console.log('   This means products will be dropped!');
  }
  console.log('');

  console.log('\nSTEP 2: Frontend Processing (what lib/categories.ts does)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Simulate frontend filtering
  const filteredCategories = categories
    .filter(cat => cat.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  
  console.log(`After filtering: ${filteredCategories.length} categories`);
  console.log('Category slugs that will be keys in grouped object:');
  filteredCategories.forEach(cat => {
    console.log(`   - "${cat.slug}"`);
  });
  console.log('');

  console.log('\nSTEP 3: Product Grouping (what lib/products.ts does)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Get all products
  const products = await prisma.product.findMany({
    where: { isAvailable: true }
  });

  console.log(`Found ${products.length} available products\n`);
  
  // Simulate grouping
  const grouped: Record<string, any[]> = {};
  filteredCategories.forEach(cat => {
    grouped[cat.slug] = [];
  });

  console.log('Initialized grouped object with keys:');
  console.log(Object.keys(grouped));
  console.log('');

  // Group products
  let droppedCount = 0;
  const dropped: any[] = [];
  
  products.forEach(product => {
    if (grouped[product.category]) {
      grouped[product.category].push(product);
    } else {
      droppedCount++;
      dropped.push({
        name: product.name,
        category: product.category
      });
    }
  });

  console.log(`Products successfully grouped: ${products.length - droppedCount}`);
  console.log(`Products DROPPED: ${droppedCount}\n`);

  if (droppedCount > 0) {
    console.log('❌ DROPPED PRODUCTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    dropped.forEach(p => {
      console.log(`   Product: ${p.name}`);
      console.log(`   Category slug: "${p.category}"`);
      console.log(`   Reason: Key "${p.category}" does not exist in grouped object`);
      console.log('');
    });
  }

  console.log('\nFinal grouped product counts:');
  Object.entries(grouped).forEach(([slug, prods]) => {
    console.log(`   ${slug}: ${prods.length} products`);
  });
}

testCategoriesApi()
  .then(() => {
    console.log('\n✅ Analysis complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
