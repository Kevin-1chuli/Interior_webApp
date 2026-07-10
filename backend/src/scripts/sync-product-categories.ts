/**
 * Product-Category Synchronization Script
 * 
 * Purpose: Recover missing products by synchronizing category and categoryId fields
 * 
 * This script:
 * 1. Finds all products with missing or inconsistent category data
 * 2. Syncs category slug and categoryId to ensure consistency
 * 3. Reports recovery statistics
 */

import prisma from '../prisma';

interface SyncResult {
  totalProducts: number;
  productsWithNoCategory: number;
  productsWithNoCategoryId: number;
  productsWithMismatch: number;
  productsRecovered: number;
  errors: string[];
}

async function syncProductCategories(): Promise<SyncResult> {
  const result: SyncResult = {
    totalProducts: 0,
    productsWithNoCategory: 0,
    productsWithNoCategoryId: 0,
    productsWithMismatch: 0,
    productsRecovered: 0,
    errors: []
  };

  try {
    console.log('🔍 Starting product-category synchronization...\n');

    // Get all categories for reference
    const categories = await prisma.category.findMany();
    console.log(`📁 Found ${categories.length} categories in database`);
    
    // Create lookup maps
    const categoryBySlug = new Map(categories.map(cat => [cat.slug, cat]));
    const categoryById = new Map(categories.map(cat => [cat.id, cat]));

    // Get all products
    const allProducts = await prisma.product.findMany();
    result.totalProducts = allProducts.length;
    console.log(`📦 Found ${allProducts.length} total products\n`);

    // Analyze and fix each product
    for (const product of allProducts) {
      let needsUpdate = false;
      const updates: any = {};

      // Case 1: Has categoryId but no category slug
      if (product.categoryId && !product.category) {
        const category = categoryById.get(product.categoryId);
        if (category) {
          updates.category = category.slug;
          needsUpdate = true;
          result.productsWithNoCategory++;
          console.log(`  ✓ Product "${product.name}": Setting category slug to "${category.slug}"`);
        }
      }

      // Case 2: Has category slug but no categoryId
      if (product.category && !product.categoryId) {
        const category = categoryBySlug.get(product.category);
        if (category) {
          updates.categoryId = category.id;
          needsUpdate = true;
          result.productsWithNoCategoryId++;
          console.log(`  ✓ Product "${product.name}": Setting categoryId to category "${category.name}"`);
        } else {
          result.errors.push(`Product "${product.name}" has invalid category slug: "${product.category}"`);
          console.log(`  ⚠️ Product "${product.name}": Invalid category slug "${product.category}" - no matching category`);
        }
      }

      // Case 3: Has both but they don't match
      if (product.category && product.categoryId) {
        const category = categoryById.get(product.categoryId);
        if (category && category.slug !== product.category) {
          // categoryId is the source of truth (foreign key)
          updates.category = category.slug;
          needsUpdate = true;
          result.productsWithMismatch++;
          console.log(`  ✓ Product "${product.name}": Syncing category slug from "${product.category}" to "${category.slug}"`);
        }
      }

      // Case 4: Has neither category nor categoryId
      if (!product.category && !product.categoryId) {
        result.errors.push(`Product "${product.name}" (ID: ${product.id}) has no category information - manual intervention required`);
        console.log(`  ❌ Product "${product.name}": No category information at all!`);
      }

      // Apply updates
      if (needsUpdate) {
        await prisma.product.update({
          where: { id: product.id },
          data: updates
        });
        result.productsRecovered++;
      }
    }

    console.log('\n✅ Synchronization complete!\n');
    console.log('📊 RESULTS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total products:              ${result.totalProducts}`);
    console.log(`Products missing slug:       ${result.productsWithNoCategory}`);
    console.log(`Products missing categoryId: ${result.productsWithNoCategoryId}`);
    console.log(`Products with mismatch:      ${result.productsWithMismatch}`);
    console.log(`Products recovered:          ${result.productsRecovered}`);
    console.log(`Errors:                      ${result.errors.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (result.errors.length > 0) {
      console.log('⚠️ ERRORS:');
      result.errors.forEach(err => console.log(`   - ${err}`));
      console.log('');
    }

    return result;

  } catch (error) {
    console.error('❌ Synchronization failed:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  syncProductCategories()
    .then((result) => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { syncProductCategories };
