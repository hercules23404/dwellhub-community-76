import { Request, Response, NextFunction, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface UserPayload extends JwtPayload {
    id: string;
    role: 'admin' | 'tenant';
    societyId?: string;
}

// Basic route handler type
export type RouteHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

// Authenticated request type that ensures user exists
export interface AuthenticatedRequest extends Request {
    user: UserPayload;
}

// Authenticated route handler type
export type AuthenticatedRouteHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Promise<void>;

// Middleware type for authentication
export type AuthMiddleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>; 