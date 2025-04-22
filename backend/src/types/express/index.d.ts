import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedUser extends JwtPayload {
    id: string;
    role: 'admin' | 'tenant';
    societyId?: string;
}

export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
} 