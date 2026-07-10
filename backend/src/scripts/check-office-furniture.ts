/**
 * Check Office Furniture Products
 * Trace one product from database through the system
 */

import prisma from '../prisma';

async function checkOfficeFurniture() {
  console.log('🔍 STEP 1: Finding Office Furniture category in database\n');
  
  // Find Office Furniture category
  const officeCat = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: { contains: 'office' } },
        { name: { contains: 'Office' } }
      ]
    }
  });

  if (!officeCat) {
    console.log('❌ No Office Furniture category found!');
    console.log('\n📁 All categories:');
    const allCats = await prisma.category.findMany();
    allCats.forEach(cat => {
      console.log(`   - ${cat.name} (slug: ${cat.slug}, id: ${cat.id}, active: ${cat.isActive})`);
    });
    return;
  }

  console.log('✅ Office Furniture category found:');
  console.log(`   ID: ${officeCat.id}`);
  console.log(`   Name: ${officeCat.name}`);
  console.log(`   Slug: ${officeCat.slug}`);
  console.log(`   Active: ${officeCat.isActive}`);
  console.log('');

  console.log('🔍 STEP 2: Finding products for this category\n');

  // Find products by categoryId
  const productsByCategoryId = await prisma.product.findMany({
    where: { categoryId: officeCat.id }
  });

  console.log(`✅ Products found by categoryId: ${productsByCategoryId.length}`);
  
  // Find products by category slug
  const productsBySlug = await prisma.product.findMany({
    where: { category: officeCat.slug }
  });

  console.log(`✅ Products found by category slug: ${productsBySlug.length}`);
  console.log('');

  // Get ONE product to trace
  const product = productsByCategoryId[0] || productsBySlug[0];

  if (!product) {
    console.log('❌ No products found for Office Furniture category!');
    
    // Check if products exist with different category values
    console.log('\n🔍 Checking for products with "office" or "desk" in category field:');
    const officeProducts = await prisma.product.findMany({
      where: {
        OR: [
          { category: { contains: 'office' } },
          { category: { contains: 'desk' } },
          { name: { contains: 'Desk' } },
          { name: { contains: 'Office' } }
        ]
      }
    });
    
    console.log(`Found ${officeProducts.length} products with office/desk keywords:`);
    officeProducts.forEach(p => {
      console.log(`   - ${p.name}`);
      console.log(`     category: "${p.category}"`);
      console.log(`     categoryId: ${p.categoryId}`);
      console.log('');
    });
    return;
  }

  console.log('🔍 STEP 3: Tracing product through the system\n');
  console.log('📦 PRODUCT DETAILS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`ID:          ${product.id}`);
  console.log(`Name:        ${product.name}`);
  console.log(`Category:    "${product.category}"`);
  console.log(`CategoryId:  ${product.categoryId}`);
  console.log(`Price:       ${product.currency} ${product.price}`);
  console.log(`Available:   ${product.isAvailable}`);
  console.log(`Images:      ${(product.images as any[]).length} image(s)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  console.log('🔍 STEP 4: Verifying category match\n');
  
  if (product.categoryId === officeCat.id) {
    console.log(`✅ categoryId matches: ${product.categoryId} === ${officeCat.id}`);
  } else {
    console.log(`❌ categoryId MISMATCH: ${product.categoryId} !== ${officeCat.id}`);
  }

  if (product.category === officeCat.slug) {
    console.log(`✅ category slug matches: "${product.category}" === "${officeCat.slug}"`);
  } else {
    console.log(`❌ category slug MISMATCH: "${product.category}" !== "${officeCat.slug}"`);
  }
  console.log('');

  console.log('🔍 STEP 5: Simulating API query\n');
  
  // Simulate what the API returns
  const apiProducts = await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: 'desc' }
  });

  const productInApiResult = apiProducts.find(p => p.id === product.id);
  
  if (productInApiResult) {
    console.log(`✅ Product IS returned by API (GET /api/products)`);
    console.log('   API JSON for this product:');
    console.log('   ' + JSON.stringify({
      id: productInApiResult.id,
      name: productInApiResult.name,
      category: productInApiResult.category,
      categoryId: productInApiResult.categoryId,
      price: productInApiResult.price.toString(),
      currency: productInApiResult.currency
    }, null, 2).replace(/\n/g, '\n   '));
  } else {
    console.log(`❌ Product NOT returned by API`);
    console.log(`   Reason: isAvailable = ${product.isAvailable}`);
  }
  console.log('');

  console.log('🔍 STEP 6: Frontend Grouping Logic\n');
  console.log('File: lib/products.ts');
  console.log('Function: groupByCategory()');
  console.log('');
  console.log('The frontend groups products like this:');
  console.log('1. Gets all categories from API');
  console.log('2. Creates empty arrays for each category slug');
  console.log('3. Loops through products and uses product.category (slug)');
  console.log('4. Adds product to grouped[product.category]');
  console.log('');
  console.log(`For our product:`);
  console.log(`   product.category = "${product.category}"`);
  console.log(`   Expected category slug = "${officeCat.slug}"`);
  console.log('');

  if (product.category === officeCat.slug) {
    console.log(`✅ Product WILL be grouped under "${officeCat.slug}"`);
  } else {
    console.log(`❌ Product will be grouped under "${product.category}"`);
    console.log(`   But category "${product.category}" may not exist in categories array!`);
    console.log('');
    console.log('🎯 ROOT CAUSE FOUND:');
    console.log(`   File: lib/products.ts`);
    console.log(`   Function: groupByCategory()`);
    console.log(`   Line: ~27 (const catId = product.category as CatId;)`);
    console.log('');
    console.log(`   Product category slug "${product.category}" does not match`);
    console.log(`   any category in the categories array.`);
  }

  console.log('');
  console.log('🔍 STEP 7: Display Logic\n');
  console.log('File: components/NGBComponents.tsx');
  console.log('Function: CategorySlider()');
  console.log('Line: ~278');
  console.log('');
  console.log('Code: if (!products || products.length === 0) { return null; }');
  console.log('');
  console.log('If the category has 0 products grouped under it, the entire');
  console.log('category section will not render (returns null).');
  console.log('');

  // Final summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 TRACE SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Database: Product exists with category="${product.category}"`);
  console.log(`API: Product ${productInApiResult ? 'IS' : 'IS NOT'} returned`);
  console.log(`Frontend Grouping: ${product.category === officeCat.slug ? 'CORRECT' : 'WRONG'} category slug`);
  console.log(`Display: ${product.category === officeCat.slug ? 'WILL SHOW' : 'WILL NOT SHOW'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

checkOfficeFurniture()
  .then(() => {
    console.log('\n✅ Analysis complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
