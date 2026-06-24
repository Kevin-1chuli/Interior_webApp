import { CATS } from "./data";
import type { CatId } from "./types";

export const isCatId = (value: string): value is CatId =>
  CATS.some((cat) => cat.id === value);
