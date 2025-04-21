import { Document } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: (JwtPayload & {
                id: string;
                role: string;
                societyId?: string;
            }) | null;
        }
    }
} 