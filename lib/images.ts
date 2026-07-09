export const img = (id: string, w = 800, h = 600) => {
  // If id is already a full URL (from Cloudinary or other source), return it as-is
  if (id.startsWith('http://') || id.startsWith('https://')) {
    return id;
  }
  // Otherwise, treat it as an Unsplash photo ID
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;
};
