import { notFound } from "next/navigation";
import CategoryContent from "@/components/pages/CategoryContent";
import { getCategories, isValidCategorySlug } from "@/lib/categories";

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((cat) => ({ catId: cat.slug }));
  } catch (error) {
    console.error('Failed to generate category params:', error);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ catId: string }>;
}) {
  const { catId } = await params;

  // Validate category exists
  const isValid = await isValidCategorySlug(catId);
  
  if (!isValid) {
    notFound();
  }

  return <CategoryContent catId={catId} />;
}
