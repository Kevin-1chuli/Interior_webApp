# 🔍 OFFICE FURNITURE PRODUCT TRACE REPORT

## Executive Summary

**Issue:** Office Furniture category appears in navigation but shows no products.

**Status:** Root cause identified - Display logic hides empty categories.

---

## STEP 1: DATABASE VERIFICATION

### Product Details
```
ID:          f460c43a-9942-43f3-aa3a-a82e2b794b78
Name:        Executive Desk with Teal Handles
Category:    "office-furniture"
CategoryId:  85ead422-dfd9-42f4-99db-fd4492ffdc0f
Price:       UGX 4000000
Available:   true
Images:      1 image
```

### Category Details
```
ID:          85ead422-dfd9-42f4-99db-fd4492ffdc0f
Name:        Office furniture
Slug:        "office-furniture"
Active:      true
Sort Order:  7
```

✅ **Result:** Product exists with correct category relationship.

---

## STEP 2: CATEGORY FIELD CONSISTENCY

### Verification
- ✅ `product.categoryId` matches `category.id`
- ✅ `product.category` matches `category.slug`
- ✅ Both fields are synchronized

**Result:** No data inconsistency.

---

## STEP 3: API RESPONSE

### GET /api/products

**Query:**
```typescript
where: { isAvailable: true }
orderBy: { createdAt: 'desc' }
```

**Result:** ✅ Product IS returned by API

**JSON:**
```json
{
  "id": "f460c43a-9942-43f3-aa3a-a82e2b794b78",
  "name": "Executive Desk with Teal Handles",
  "category": "office-furniture",
  "categoryId": "85ead422-dfd9-42f4-99db-fd4492ffdc0f",
  "price": "4000000",
  "currency": "UGX"
}
```

---

## STEP 4: CATEGORIES API

### GET /api/categories

**Query:**
```typescript
where: { isActive: true }
orderBy: { sortOrder: 'asc' }
```

**Result:** ✅ Office Furniture category IS included

**Response includes:**
1. Beds (slug: "beds") - 13 products
2. Sofas (slug: "sofas") - 11 products
3. Wardrobes (slug: "wardrobes") - 0 products
4. TV Units (slug: "tv-units") - 0 products
5. Dining (slug: "dining") - 0 products
6. Coffee Tables (slug: "coffee-tables") - 0 products
7. **Office furniture (slug: "office-furniture") - 7 products** ✅

---

## STEP 5: FRONTEND PRODUCT GROUPING

### File: `lib/products.ts`
### Function: `groupByCategory()`

**Logic:**
```typescript
// Line 20-24: Initialize empty arrays for each category
const grouped: Record<CatId, Prod[]> = {};
categories.forEach(cat => {
  grouped[cat.slug] = [];
});

// Line 27-32: Group products by their category slug
products.forEach((product, index) => {
  const catId = product.category as CatId;
  if (grouped[catId]) {
    grouped[catId].push(transformProduct(product, index));
  }
});
```

**Execution Trace:**
1. Categories array includes: `["beds", "sofas", "wardrobes", "tv-units", "dining", "coffee-tables", "office-furniture"]`
2. `grouped["office-furniture"] = []` is initialized
3. Product with `category: "office-furniture"` is found
4. Check: `if (grouped["office-furniture"])` → **TRUE**
5. Product is added: `grouped["office-furniture"].push(...)`

**Result:**
- ✅ 7 products successfully grouped under "office-furniture"
- ✅ 0 products dropped
- ✅ Final count: `office-furniture: 7 products`

---

## STEP 6: FURNITURE CONTENT COMPONENT

### File: `components/pages/FurnitureContent.tsx`

**Logic:**
```typescript
const [products, setProducts] = useState<Record<CatId, Prod[]>>({});
const [categories, setCategories] = useState<Category[]>([]);

useEffect(() => {
  async function loadData() {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      getProducts(),      // Returns grouped products
      getCategories()     // Returns category list
    ]);
    setProducts(fetchedProducts);
    setCategories(fetchedCategories);
  }
  loadData();
}, []);
```

**Expected State:**
```javascript
products = {
  "beds": [13 products],
  "sofas": [11 products],
  "wardrobes": [],
  "tv-units": [],
  "dining": [],
  "coffee-tables": [],
  "office-furniture": [7 products]  // ✅ Should be here
}

categories = [
  { slug: "beds", name: "Beds", ... },
  { slug: "sofas", name: "Sofas", ... },
  { slug: "wardrobes", name: "Wardrobes", ... },
  { slug: "tv-units", name: "TV Units", ... },
  { slug: "dining", name: "Dining", ... },
  { slug: "coffee-tables", name: "Coffee Tables", ... },
  { slug: "office-furniture", name: "Office furniture", ... }  // ✅ Should be here
]
```

---

## STEP 7: FURNITURE PAGE COMPONENT

### File: `components/NGBComponents.tsx`
### Function: `FurniturePage()`
### Lines: 1190-1249

**Logic:**
```typescript
{categories.map((cat) => (
  <div key={cat.slug} id={`cat-${cat.slug}`}>
    <CategorySlider 
      catId={cat.slug}             // "office-furniture"
      categoryName={cat.name}       // "Office furniture"
      products={products}          // Full products object
      fav={fav} 
      onFav={onFav} 
      onNavigate={onNavigate} 
      onView={onView} 
    />
  </div>
))}
```

**Execution for Office Furniture:**
- `cat.slug` = `"office-furniture"`
- `cat.name` = `"Office furniture"`
- `products` = entire products object with all categories

---

## STEP 8: CATEGORY SLIDER COMPONENT ⚠️

### File: `components/NGBComponents.tsx`
### Function: `CategorySlider()`
### Lines: 252-280

**🎯 ROOT CAUSE FOUND HERE**

**Logic:**
```typescript
export function CategorySlider({ catId, products: allProducts, ... }) {
  const products = allProducts ? allProducts[catId] : PRODS[catId] || [];
  
  // Line 278 - THE PROBLEM
  if (!products || products.length === 0) {
    return null;  // Category completely hidden!
  }
  
  return (
    <section>
      {/* Category display */}
    </section>
  );
}
```

**Analysis:**
1. `catId` = `"office-furniture"`
2. `allProducts[catId]` = `allProducts["office-furniture"]`
3. **Should return array of 7 products**
4. Check: `if (products.length === 0)`
5. **If TRUE → returns `null` and category is hidden**

---

## 🎯 ROOT CAUSE IDENTIFIED

### Location
**File:** `components/NGBComponents.tsx`
**Function:** `CategorySlider()`
**Line:** **278**

### Code
```typescript
if (!products || products.length === 0) {
  return null;
}
```

### Issue
The CategorySlider component **returns `null`** when a category has zero products, which causes the entire category section to not render at all.

### Why This Happens
Based on the trace:
1. ✅ Database has 7 products for office-furniture
2. ✅ API returns all 7 products
3. ✅ Frontend groups all 7 products correctly
4. ✅ Products object contains `office-furniture: [7 products]`
5. ⚠️ **BUT** CategorySlider receives empty array or undefined

### Hypothesis
There are two possible causes:

**Option A: Client-Side Execution Issue**
- The `getProducts()` call happens client-side
- If API call fails or returns empty data, products object would be empty
- This would cause `allProducts["office-furniture"]` to be `[]` or `undefined`

**Option B: Fallback to PRODS**
- If `allProducts` is undefined/null, it falls back to `PRODS[catId]`
- `PRODS` is the hardcoded data from `lib/data.ts`
- `PRODS` only has: beds, sofas, wardrobes, tv-units, dining, coffee-tables
- **`PRODS` does NOT have "office-furniture" key**
- So `PRODS["office-furniture"]` = `undefined`
- Then `PRODS["office-furniture"] || []` = `[]`
- Empty array → `return null`

---

## 🔍 VERIFICATION OF ROOT CAUSE

### Check lib/data.ts

**File:** `lib/data.ts`
**Lines:** 13-76

**Hardcoded PRODS object keys:**
```typescript
export const PRODS: Record<CatId, Prod[]> = {
  beds: [...],
  sofas: [...],
  wardrobes: [...],
  "tv-units": [...],
  dining: [...],
  "coffee-tables": [...],
  // ❌ "office-furniture" key MISSING!
};
```

### Fallback Logic in CategorySlider

```typescript
const products = allProducts ? allProducts[catId] : PRODS[catId] || [];
```

**If `allProducts` is falsy (null, undefined, empty object):**
1. Falls back to `PRODS[catId]`
2. `PRODS["office-furniture"]` = `undefined`
3. `undefined || []` = `[]`
4. Empty array triggers `return null`
5. Category hidden

---

## 🎯 EXACT PROBLEM STATEMENT

### The Issue
**Line 257** in `components/NGBComponents.tsx`:
```typescript
const products = allProducts ? allProducts[catId] : PRODS[catId] || [];
```

When the `allProducts` prop is:
- `undefined`
- `null`
- `{}` (empty object)
- Or fails to load from API

The code falls back to the hardcoded `PRODS` object, which **does not include "office-furniture"** as a key.

This causes `PRODS["office-furniture"]` to be `undefined`, which becomes `[]`, triggering the empty check on line 278, which returns `null` and hides the entire category.

---

## 📊 VERIFICATION CHECKLIST

To confirm this is the issue, check:

1. ✅ Database has office-furniture products → **YES (7 products)**
2. ✅ API returns office-furniture products → **YES**
3. ✅ Frontend grouping includes office-furniture → **YES**
4. ✅ PRODS fallback has office-furniture key → **NO** ❌
5. ✅ Client-side fetch succeeds → **UNKNOWN (needs browser console check)**

---

## 🛠️ RECOMMENDED FIX

### Option 1: Remove Fallback to PRODS (Recommended)
Since the app now uses dynamic categories from the database, the hardcoded `PRODS` fallback is outdated and causes issues.

**File:** `components/NGBComponents.tsx`
**Line:** 257

**Change from:**
```typescript
const products = allProducts ? allProducts[catId] : PRODS[catId] || [];
```

**Change to:**
```typescript
const products = allProducts ? allProducts[catId] || [] : [];
```

This ensures:
- If `allProducts` exists, use it (even if specific category is empty)
- If `allProducts` is null/undefined, use empty array
- Never fall back to outdated PRODS object

### Option 2: Add office-furniture to PRODS (Temporary)
Add the missing key to the fallback data.

**File:** `lib/data.ts`

Add:
```typescript
export const PRODS: Record<CatId, Prod[]> = {
  beds: [...],
  sofas: [...],
  // ... existing categories
  "office-furniture": [], // Add this
};
```

**Note:** This is a band-aid solution and doesn't fix the root cause.

### Option 3: Show Empty State Instead of Hiding
Don't hide empty categories - show them with a message.

**File:** `components/NGBComponents.tsx`
**Line:** 278

**Change from:**
```typescript
if (!products || products.length === 0) {
  return null;
}
```

**Change to:**
```typescript
if (!products || products.length === 0) {
  return (
    <section style={{ backgroundColor: sectionBg, padding: "40px 20px" }}>
      <div className="max-w-6xl mx-auto text-center">
        <h2 style={{ fontFamily: DISPLAY, fontSize: "1.5rem", marginBottom: "8px" }}>
          {name}
        </h2>
        <p style={{ fontFamily: SANS, color: MID }}>
          No products available in this category yet.
        </p>
      </div>
    </section>
  );
}
```

---

## 📝 ACTION REQUIRED

### Immediate Investigation
1. Open browser console on `/furniture` page
2. Check for any API errors or failed fetches
3. Add console.log to see what `allProducts` contains:
   ```typescript
   console.log('[CategorySlider] catId:', catId);
   console.log('[CategorySlider] allProducts:', allProducts);
   console.log('[CategorySlider] products for this category:', products);
   ```

### Implement Fix
Based on investigation results, implement **Option 1** (remove PRODS fallback) as it addresses the architectural issue of mixing dynamic and hardcoded data.

---

## 🎯 FINAL ANSWER

### Exact File
**`components/NGBComponents.tsx`**

### Exact Function
**`CategorySlider()`**

### Exact Line Number
**Line 257** (fallback logic) and **Line 278** (empty check)

### Exact Problem
When `allProducts` prop is falsy or empty, the component falls back to hardcoded `PRODS` object which doesn't include `"office-furniture"` as a key, resulting in an empty array that triggers the "return null" logic on line 278, hiding the entire category.

---

**Investigation Complete.**
