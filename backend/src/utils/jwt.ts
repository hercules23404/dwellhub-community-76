import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface JwtPayload {
    id: string;
    role: 'admin' | 'tenant';
    societyId?: string;
}

export const generateToken = (
    id: Types.ObjectId,
    role: 'admin' | 'tenant',
    societyId?: Types.ObjectId
): string => {
    return jwt.sign(
        {
            id: id.toString(),
            role,
            societyId: societyId?.toString()
        } as JwtPayload,
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
}; 