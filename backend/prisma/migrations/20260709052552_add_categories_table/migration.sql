-- AlterTable
ALTER TABLE "products" ADD COLUMN     "category_id" TEXT;

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_is_active_sort_order_idx" ON "categories"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed existing categories
INSERT INTO "categories" ("id", "slug", "name", "description", "image_url", "sort_order", "is_active", "created_at", "updated_at") VALUES
  (gen_random_uuid(), 'beds', 'Beds', 'Comfortable beds for restful sleep', 'https://images.unsplash.com/photo-1696762932825-2737db830bbe', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'sofas', 'Sofas', 'Stylish sofas for your living space', 'https://images.unsplash.com/photo-1592401526914-7e5d94a8d6fa', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'wardrobes', 'Wardrobes', 'Spacious wardrobes for organized storage', 'https://images.unsplash.com/photo-1751806524616-47dd4fabd68d', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'tv-units', 'TV Units', 'Modern TV units and media consoles', 'https://images.unsplash.com/photo-1688647063090-36f36f692d95', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'dining', 'Dining', 'Elegant dining tables and sets', 'https://images.unsplash.com/photo-1706820229870-f9a8c6dac193', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'coffee-tables', 'Coffee Tables', 'Stylish coffee tables for your living room', 'https://images.unsplash.com/photo-1699901524281-423398392936', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Backfill category_id for existing products based on category string
UPDATE "products" p
SET "category_id" = c."id"
FROM "categories" c
WHERE p."category" = c."slug";
