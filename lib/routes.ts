import { isCatId } from "./categories";

/**
 * Convert navigation keys → URL paths
 */
export const routePathFor = (page: string) => {
  if (page === "home") return "/";
  if (page === "furniture") return "/furniture";
  if (page === "interior-design") return "/interior-design";
  if (page === "projects") return "/projects";
  if (page === "contact") return "/contact";

  // category route (furniture subpages)
  if (isCatId(page)) return `/furniture/${page}`;

  return "/";
};

/**
 * Navbar active state ONLY (no categories here)
 */
export const activePageFromPath = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) return "home";

  if (parts[0] === "furniture") return "furniture";
  if (parts[0] === "interior-design") return "interior-design";
  if (parts[0] === "projects") return "projects";
  if (parts[0] === "contact") return "contact";

  return "home";
};

//categories
export const activeCategoryFromPath = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] === "furniture" && parts[1] && isCatId(parts[1])) {
    return parts[1]; // e.g. "beds", "sofas"
  }

  return null;
};