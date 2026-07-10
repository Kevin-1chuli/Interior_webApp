import cloudinary from '../config/cloudinary';

/**
 * Extract Cloudinary public_id from a secure_url
 * 
 * Cloudinary URL structure:
 * https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
 * 
 * Examples:
 * - https://res.cloudinary.com/demo/image/upload/v1234567/ngb-products/product_123_desk.jpg
 *   → public_id: "ngb-products/product_123_desk"
 * 
 * - https://res.cloudinary.com/demo/image/upload/ngb-products/product_456_chair.png
 *   → public_id: "ngb-products/product_456_chair"
 * 
 * @param url - Full Cloudinary secure_url
 * @returns public_id string or null if extraction fails
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    if (!url || typeof url !== 'string') {
      return null;
    }

    // Check if it's a Cloudinary URL
    if (!url.includes('res.cloudinary.com')) {
      console.warn('URL is not from Cloudinary:', url);
      return null;
    }

    // Match pattern: /upload/v{version}/{public_id}.{ext} or /upload/{public_id}.{ext}
    // Captures everything between /upload/ (with optional version) and the file extension
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return match[1];
    }

    console.error('Failed to extract public_id from URL:', url);
    return null;
  } catch (error) {
    console.error('Error extracting public_id from URL:', url, error);
    return null;
  }
}

/**
 * Delete a single image from Cloudinary by its URL
 * 
 * @param url - Full Cloudinary secure_url
 * @returns Promise<boolean> - true if deleted successfully, false otherwise
 */
export async function deleteImageFromCloudinary(url: string): Promise<boolean> {
  const publicId = extractPublicIdFromUrl(url);
  
  if (!publicId) {
    console.error('Could not extract public_id from URL, skipping deletion:', url);
    return false;
  }
  
  try {
    console.log(`[Cloudinary] Attempting to delete image: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log(`[Cloudinary] Successfully deleted: ${publicId}`);
      return true;
    } else if (result.result === 'not found') {
      console.warn(`[Cloudinary] Image not found (may already be deleted): ${publicId}`);
      return true; // Consider this a success - image is gone either way
    } else {
      console.error(`[Cloudinary] Deletion failed for ${publicId}:`, result);
      return false;
    }
  } catch (error: any) {
    console.error(`[Cloudinary] Error deleting image ${publicId}:`, error.message || error);
    return false;
  }
}

/**
 * Delete multiple images from Cloudinary
 * Processes deletions in parallel but doesn't throw on individual failures
 * 
 * @param urls - Array of Cloudinary secure_urls
 * @returns Promise with deletion results
 */
export async function deleteImagesFromCloudinary(urls: string[]): Promise<{
  success: string[];
  failed: string[];
  total: number;
}> {
  if (!urls || urls.length === 0) {
    return { success: [], failed: [], total: 0 };
  }

  console.log(`[Cloudinary] Starting deletion of ${urls.length} image(s)`);
  
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const deleted = await deleteImageFromCloudinary(url);
      return { url, deleted };
    })
  );
  
  const success: string[] = [];
  const failed: string[] = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.deleted) {
      success.push(urls[index]);
    } else {
      failed.push(urls[index]);
    }
  });
  
  console.log(`[Cloudinary] Deletion complete: ${success.length} succeeded, ${failed.length} failed`);
  
  return { success, failed, total: urls.length };
}

/**
 * Determine which images were removed by comparing old and new image arrays
 * 
 * @param oldImages - Original image URLs from database
 * @param newImages - New image URLs (existing + newly uploaded)
 * @returns Array of removed image URLs
 */
export function getRemovedImages(oldImages: string[], newImages: string[]): string[] {
  if (!oldImages || oldImages.length === 0) {
    return [];
  }

  if (!newImages || newImages.length === 0) {
    return oldImages; // All images were removed
  }

  // Find images that exist in old but not in new
  const removed = oldImages.filter(oldUrl => !newImages.includes(oldUrl));
  
  if (removed.length > 0) {
    console.log(`[Image Cleanup] Detected ${removed.length} removed image(s)`);
  }
  
  return removed;
}
