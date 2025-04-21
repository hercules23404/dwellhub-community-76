import express from 'express';
import { Tenant } from '../models/Tenant';
import { requireTenantAuth } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Tenant login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const tenant = await Tenant.findOne({ email });

        if (!tenant) {
            throw new Error();
        }

        const isMatch = await bcrypt.compare(password, tenant.passwordHash);
        if (!isMatch) {
            throw new Error();
        }

        const token = jwt.sign({ id: tenant._id }, process.env.JWT_SECRET as string);
        res.json({ tenant, token });
    } catch (err) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Get tenant profile (protected)
router.get('/profile', requireTenantAuth, async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching profile' });
    }
});

export default router; 