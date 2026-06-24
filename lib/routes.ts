import { isCatId } from "./categories";

export const routePathFor = (page: string) => {
  if (page === "home") return "/";
  if (page === "furniture") return "/furniture";
  if (page === "contact") return "/contact";
  if (isCatId(page)) return `/furniture/${page}`;
  return "/";
};

export const activePageFromPath = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "home";
  if (parts[0] === "furniture" && parts[1] && isCatId(parts[1])) return parts[1];
  if (parts[0] === "furniture") return "furniture";
  if (parts[0] === "contact") return "contact";
  return "home";
};
