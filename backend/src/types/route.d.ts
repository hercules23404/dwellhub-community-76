import { Request, Response, NextFunction, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user: JwtPayload & {
        id: string;
        role: string;
        societyId?: string;
    };
}

export type RouteHandler = RequestHandler;

export type AuthenticatedRouteHandler = RequestHandler<{}, any, any, any, { user: AuthenticatedRequest['user'] }>; 