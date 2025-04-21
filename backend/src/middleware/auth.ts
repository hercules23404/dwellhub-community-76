import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../types/route';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        (req as AuthenticatedRequest).user = {
            id: user._id.toString(),
            role: user.role,
            societyId: user.societyId
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const requireAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
    await requireAuth(req, res, () => {
        if ((req as AuthenticatedRequest).user?.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    });
};

export const requireTenantAuth = async (req: Request, res: Response, next: NextFunction) => {
    await requireAuth(req, res, () => {
        if ((req as AuthenticatedRequest).user?.role !== 'tenant') {
            return res.status(403).json({ message: 'Tenant access required' });
        }
        next();
    });
}; 