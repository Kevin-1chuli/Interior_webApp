/**
 * Convert navigation keys → URL paths
 */
export const routePathFor = (page: string) => {
  if (page === "home") return "/";
  if (page === "furniture") return "/furniture";
  if (page === "interior-design") return "/interior-design";
  if (page === "projects") return "/projects";
  if (page === "contact") return "/contact";

  // category route (furniture subpages) - assume any other string is a category slug
  // The actual validation happens at the page level
  if (page.startsWith("/furniture/")) return page;
  if (!page.startsWith("/")) return `/furniture/${page}`;

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

  if (parts[0] === "furniture" && parts[1]) {
    return parts[1]; // Return the slug - validation happens at page level
  }

  return null;
};