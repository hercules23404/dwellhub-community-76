import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user: JwtPayload & {
        id: string;
        role: string;
        societyId?: string;
    };
}

export type RouteHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export type AuthenticatedRouteHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => Promise<any>; 