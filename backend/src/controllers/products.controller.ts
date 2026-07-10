import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import cloudinary from '../config/cloudinary';
import { deleteImagesFromCloudinary, getRemovedImages } from '../utils/cloudinary.helper';

// Sanitize filename for Cloudinary public_id
const sanitizeFilename = (filename: string): string => {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Replace invalid characters with underscore
  // Keep only: A-Z, a-z, 0-9, underscore, hyphen
  let sanitized = nameWithoutExt.replace(/[^A-Za-z0-9_-]/g, '_');
  
  // Collapse consecutive underscores into single underscore
  sanitized = sanitized.replace(/_+/g, '_');
  
  // Trim leading and trailing underscores
  sanitized = sanitized.replace(/^_+|_+$/g, '');
  
  // If empty after sanitization, return empty string (caller will handle)
  return sanitized;
};

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer: Buffer, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const sanitizedName = sanitizeFilename(filename);
    
    // Format: product_<timestamp>_<sanitized-name>
    // If sanitized name is empty, use just product_<timestamp>
    const publicId = sanitizedName 
      ? `product_${timestamp}_${sanitizedName}`
      : `product_${timestamp}`;
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ngb-products',
        public_id: publicId,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { category, page = '1', limit = '20' } = req.query;

    const where: any = { isAvailable: true };
    if (category) {
      where.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get products error:', error.message || error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      categoryId,
      price,
      currency = 'UGX',
      materials,
      dimensions
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    // Ensure both category fields are synchronized
    let finalCategoryId = categoryId;
    let finalCategorySlug = category;

    if (categoryId && !category) {
      // Has categoryId but no slug - fetch slug from database
      const cat = await prisma.category.findUnique({ where: { id: categoryId } });
      if (cat) {
        finalCategorySlug = cat.slug;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid categoryId - category not found'
        });
      }
    } else if (category && !categoryId) {
      // Has slug but no categoryId - fetch categoryId from database
      const cat = await prisma.category.findUnique({ where: { slug: category } });
      if (cat) {
        finalCategoryId = cat.id;
      } else {
        return res.status(400).json({
          success: false,
          message: `Invalid category slug "${category}" - category not found`
        });
      }
    } else if (!category && !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category is required (provide either category slug or categoryId)'
      });
    } else {
      // Both provided - verify they match
      const cat = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!cat) {
        return res.status(400).json({
          success: false,
          message: 'Invalid categoryId - category not found'
        });
      }
      if (cat.slug !== category) {
        // Use categoryId as source of truth
        console.warn(`Category mismatch: slug="${category}" but categoryId maps to "${cat.slug}". Using categoryId.`);
        finalCategorySlug = cat.slug;
      }
    }

    // Parse materials if it's a JSON string
    let materialsArray: string[] = [];
    if (materials) {
      try {
        materialsArray = typeof materials === 'string' ? JSON.parse(materials) : materials;
        if (!Array.isArray(materialsArray)) {
          materialsArray = [];
        }
      } catch (e) {
        console.error('Failed to parse materials:', e);
        materialsArray = [];
      }
    }

    // Handle image uploads
    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      try {
        const uploadPromises = req.files.map((file: Express.Multer.File) =>
          uploadToCloudinary(file.buffer, file.originalname)
        );
        imageUrls = await Promise.all(uploadPromises);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload images to Cloudinary'
        });
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        category: finalCategorySlug, // Always set both fields
        categoryId: finalCategoryId, // Always set both fields
        price: parseFloat(price),
        currency,
        images: imageUrls,
        materials: materialsArray,
        dimensions: dimensions || null
      }
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        success: false, 
        message: 'A product with this name already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch product to get images before deletion
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete product from database first
    await prisma.product.delete({
      where: { id }
    });

    // Delete all product images from Cloudinary (non-blocking)
    const productImages = (product.images as string[]) || [];
    if (productImages.length > 0) {
      console.log(`[Product Delete] Scheduling deletion of ${productImages.length} image(s) from Cloudinary`);
      
      // Fire and forget - don't block the response
      deleteImagesFromCloudinary(productImages)
        .then((result) => {
          if (result.success.length > 0) {
            console.log(`[Product Delete] Successfully deleted ${result.success.length} image(s) from Cloudinary`);
          }
          if (result.failed.length > 0) {
            console.error(`[Product Delete] Failed to delete ${result.failed.length} image(s) from Cloudinary:`, result.failed);
          }
        })
        .catch((error) => {
          console.error('[Product Delete] Unexpected error during Cloudinary cleanup:', error);
        });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete product error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      categoryId,
      price,
      currency = 'UGX',
      materials,
      dimensions,
      existingImages
    } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Ensure both category fields are synchronized if category is being updated
    let finalCategoryId = categoryId;
    let finalCategorySlug = category;

    // If category info is provided, validate and sync
    if (categoryId || category) {
      if (categoryId && !category) {
        // Has categoryId but no slug - fetch slug
        const cat = await prisma.category.findUnique({ where: { id: categoryId } });
        if (cat) {
          finalCategorySlug = cat.slug;
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid categoryId - category not found'
          });
        }
      } else if (category && !categoryId) {
        // Has slug but no categoryId - fetch categoryId
        const cat = await prisma.category.findUnique({ where: { slug: category } });
        if (cat) {
          finalCategoryId = cat.id;
        } else {
          return res.status(400).json({
            success: false,
            message: `Invalid category slug "${category}" - category not found`
          });
        }
      } else if (category && categoryId) {
        // Both provided - verify they match
        const cat = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!cat) {
          return res.status(400).json({
            success: false,
            message: 'Invalid categoryId - category not found'
          });
        }
        if (cat.slug !== category) {
          // Use categoryId as source of truth
          console.warn(`Category mismatch: slug="${category}" but categoryId maps to "${cat.slug}". Using categoryId.`);
          finalCategorySlug = cat.slug;
        }
      }
    } else {
      // No category update - use existing
      finalCategoryId = existingProduct.categoryId;
      finalCategorySlug = existingProduct.category;
    }

    // Parse materials if it's a JSON string
    let materialsArray: string[] = [];
    if (materials) {
      try {
        materialsArray = typeof materials === 'string' ? JSON.parse(materials) : materials;
        if (!Array.isArray(materialsArray)) {
          materialsArray = [];
        }
      } catch (e) {
        console.error('Failed to parse materials:', e);
        materialsArray = [];
      }
    }

    // Parse existing images (images that user kept)
    let imageUrls: string[] = [];
    if (existingImages) {
      try {
        imageUrls = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        if (!Array.isArray(imageUrls)) {
          imageUrls = [];
        }
      } catch (e) {
        console.error('Failed to parse existing images:', e);
        imageUrls = [];
      }
    }

    // Handle new image uploads
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map((file: Express.Multer.File) =>
          uploadToCloudinary(file.buffer, file.originalname)
        );
        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload images to Cloudinary'
        });
      }
    }

    // Determine which images were removed
    const oldImages = (existingProduct.images as string[]) || [];
    const removedImages = getRemovedImages(oldImages, imageUrls);

    // Delete removed images from Cloudinary (non-blocking)
    if (removedImages.length > 0) {
      console.log(`[Product Update] Scheduling deletion of ${removedImages.length} removed image(s)`);
      
      deleteImagesFromCloudinary(removedImages)
        .then((result) => {
          if (result.success.length > 0) {
            console.log(`[Product Update] Successfully deleted ${result.success.length} image(s) from Cloudinary`);
          }
          if (result.failed.length > 0) {
            console.error(`[Product Update] Failed to delete ${result.failed.length} image(s) from Cloudinary:`, result.failed);
          }
        })
        .catch((error) => {
          console.error('[Product Update] Unexpected error during Cloudinary cleanup:', error);
        });
    } else {
      console.log('[Product Update] No images removed, skipping Cloudinary cleanup');
    }

    // Update product in database
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name || existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        category: finalCategorySlug, // Always sync
        categoryId: finalCategoryId, // Always sync
        price: price ? parseFloat(price) : existingProduct.price,
        currency: currency || existingProduct.currency,
        images: imageUrls.length > 0 ? imageUrls : (existingProduct.images as any),
        materials: materialsArray.length > 0 ? materialsArray : (existingProduct.materials as any),
        dimensions: dimensions !== undefined ? dimensions : existingProduct.dimensions
      }
    });

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        success: false, 
        message: 'A product with this name already exists' 
      });
    }
    
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
