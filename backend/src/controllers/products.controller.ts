import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import cloudinary from '../config/cloudinary';

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

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required'
      });
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
        category,
        categoryId: categoryId || null, // Set categoryId if provided
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

    await prisma.product.delete({
      where: { id }
    });

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
