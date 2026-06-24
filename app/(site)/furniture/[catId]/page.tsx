import { notFound } from "next/navigation";
import CategoryContent from "@/components/pages/CategoryContent";
import { CATS } from "@/lib/data";
import type { CatId } from "@/lib/types";

const isCatId = (value: string): value is CatId =>
  CATS.some((cat) => cat.id === value);

export function generateStaticParams() {
  return CATS.map((cat) => ({ catId: cat.id }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ catId: string }>;
}) {
  const { catId } = await params;

  if (!isCatId(catId)) {
    notFound();
  }

  return <CategoryContent catId={catId} />;
}
