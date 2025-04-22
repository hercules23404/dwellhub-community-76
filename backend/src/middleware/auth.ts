import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthenticatedRequest, AuthenticatedUser } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

export const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== 'admin') {
        res.status(403).json({ message: 'Access denied' });
        return;
    }
    next();
};

export const authorizeTenant = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== 'tenant') {
        res.status(403).json({ message: 'Access denied' });
        return;
    }
    next();
};

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'No token, authorization denied' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        req.user = {
            ...decoded,
            id: user._id.toString(),
            role: user.role as 'admin' | 'tenant',
            societyId: user.societyId
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const requireAdminAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
        if (decoded.role !== 'admin') {
            res.status(403).json({ message: 'Admin access required' });
            return;
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const requireTenantAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
        if (decoded.role !== 'tenant') {
            res.status(403).json({ message: 'Tenant access required' });
            return;
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}; 