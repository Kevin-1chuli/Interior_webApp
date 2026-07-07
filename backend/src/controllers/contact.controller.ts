import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// Public endpoint - submit contact message
export const submitMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message
      }
    });

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Submit message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Public endpoint - submit design request
export const submitDesignRequest = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, projectType, budget, location, timeline, description } = req.body;

    if (!name || !email || !projectType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, project type, and description are required'
      });
    }

    const newRequest = await prisma.designRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        projectType,
        budget: budget || null,
        location: location || null,
        timeline: timeline || null,
        description
      }
    });

    res.status(201).json({
      success: true,
      data: newRequest,
      message: 'Design request submitted successfully'
    });
  } catch (error) {
    console.error('Submit design request error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin endpoint - get all messages
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin endpoint - get all design requests
export const getDesignRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.designRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get design requests error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin endpoint - mark message as read
export const markMessageRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.update({
      where: { id },
      data: { isRead: true }
    });

    res.json({
      success: true,
      data: message
    });
  } catch (error: any) {
    console.error('Mark message read error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin endpoint - mark design request as read
export const markDesignRequestRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const request = await prisma.designRequest.update({
      where: { id },
      data: { isRead: true }
    });

    res.json({
      success: true,
      data: request
    });
  } catch (error: any) {
    console.error('Mark design request read error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Design request not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin endpoint - delete message
export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.message.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete message error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
