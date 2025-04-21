import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { Tenant } from '../models/Tenant';

interface AuthRequest extends Request {
    user?: any;
}

export const requireAdminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            throw new Error();
        }

        req.user = admin;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Please authenticate as admin' });
    }
};

export const requireTenantAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const tenant = await Tenant.findById(decoded.id);

        if (!tenant) {
            throw new Error();
        }

        req.user = tenant;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Please authenticate as tenant' });
    }
}; 