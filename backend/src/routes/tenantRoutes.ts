import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { Tenant } from '../models/Tenant';
import { requireTenantAuth } from '../middleware/auth';
import { generateToken } from '../utils/jwt';

const router = express.Router();

// Tenant login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const tenant = await Tenant.findOne({ email });
        if (!tenant) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcryptjs.compare(password, tenant.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(tenant._id, 'tenant', tenant.societyId);
        res.json({
            tenant: {
                id: tenant._id,
                name: tenant.name,
                email: tenant.email,
                flatNumber: tenant.flatNumber,
                societyId: tenant.societyId
            },
            token
        });
    } catch (err) {
        next(err);
    }
});

// Get tenant profile (protected)
router.get('/profile', requireTenantAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tenant = await Tenant.findById(req.user._id)
            .select('-passwordHash')
            .populate('societyId', 'name location');

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.json(tenant);
    } catch (err) {
        next(err);
    }
});

export default router; 