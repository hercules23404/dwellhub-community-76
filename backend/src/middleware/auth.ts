import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { Admin } from '../models/Admin';
import { Tenant } from '../models/Tenant';

interface AuthRequest extends Request {
    user?: any;
    token?: string;
    role?: 'admin' | 'tenant';
}

export const requireAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
    requiredRole?: 'admin' | 'tenant'
) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            // For development, allow requests without auth
            if (process.env.NODE_ENV === 'development') {
                req.user = { _id: 'demo-user-id', societyId: 'demo-society-id' };
                req.token = 'demo-token';
                req.role = requiredRole || 'admin';
                return next();
            }
            throw new Error('Authentication required');
        }

        const decoded = verifyToken(token);

        if (requiredRole && decoded.role !== requiredRole) {
            throw new Error(`${requiredRole} role required`);
        }

        const User = decoded.role === 'admin' ? Admin : Tenant;
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        req.token = token;
        req.role = decoded.role;
        next();
    } catch (err) {
        res.status(401).json({
            error: err instanceof Error ? err.message : 'Please authenticate'
        });
    }
};

export const requireAdminAuth = (req: AuthRequest, res: Response, next: NextFunction) =>
    requireAuth(req, res, next, 'admin');

export const requireTenantAuth = (req: AuthRequest, res: Response, next: NextFunction) =>
    requireAuth(req, res, next, 'tenant'); 