import { PRODS } from "./data";
import type { CatId, Prod } from "./types";

export function getAllProducts(): (Prod & { catId: CatId })[] {
  return (Object.keys(PRODS) as CatId[]).flatMap((catId) =>
    PRODS[catId].map((product) => ({ ...product, catId })),
  );
}
