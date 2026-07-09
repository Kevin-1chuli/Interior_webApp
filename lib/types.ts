// Dynamic category type - no longer restricted to hardcoded values
export type CatId = string;

export interface Prod { id:number; name:string; price:string; desc:string; pid:string; rating:number }

// Category interface for API responses
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}
