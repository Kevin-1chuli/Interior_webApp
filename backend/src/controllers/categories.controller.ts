import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// Public endpoint - get all active categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { includeInactive } = req.query;
    
    const where: any = {};
    if (includeInactive !== 'true') {
      where.isActive = true;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin endpoint - create category
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { slug, name, description, imageUrl, sortOrder } = req.body;

    // Validation
    if (!slug || !name) {
      return res.status(400).json({
        success: false,
        message: 'Slug and name are required'
      });
    }

    // Check for duplicate slug
    const existing = await prisma.category.findUnique({
      where: { slug }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this slug already exists'
      });
    }

    const category = await prisma.category.create({
      data: {
        slug: slug.toLowerCase().trim(),
        name: name.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        sortOrder: sortOrder || 0
      }
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error: any) {
    console.error('Create category error:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        success: false, 
        message: 'A category with this slug already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Admin endpoint - update category
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { slug, name, description, imageUrl, sortOrder, isActive } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    // If slug is being changed, check for duplicates
    if (slug) {
      const existing = await prisma.category.findFirst({
        where: {
          slug: slug.toLowerCase().trim(),
          id: { not: id }
        }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A category with this slug already exists'
        });
      }
    }

    const updateData: any = {
      name: name.trim()
    };

    if (slug !== undefined) updateData.slug = slug.toLowerCase().trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl?.trim() || null;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error: any) {
    console.error('Update category error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        success: false, 
        message: 'A category with this slug already exists' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Admin endpoint - delete category
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if any products are using this category
    const productCount = await prisma.product.count({
      where: { categoryId: id }
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productCount} product${productCount > 1 ? 's are' : ' is'} using this category. Please reassign or delete those products first.`
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete category error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Admin endpoint - get single category
export const getCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
