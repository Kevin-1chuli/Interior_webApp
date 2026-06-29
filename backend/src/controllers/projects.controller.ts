import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const { category, featured } = req.query;

    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      location,
      category,
      style,
      problem,
      solution,
      beforeImages = [],
      afterImages = [],
      budgetRange,
      isFeatured = false
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        location,
        category,
        style,
        problem,
        solution,
        beforeImages,
        afterImages,
        budgetRange,
        isFeatured
      }
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
