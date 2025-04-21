import express from 'express';
import { Tenant } from '../models/Tenant';
import { requireTenantAuth } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

const router = express.Router();

// Tenant login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const tenant = await Tenant.findOne({ email });
        if (!tenant) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, tenant.passwordHash);
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
        console.error('Tenant login error:', err);
        res.status(500).json({ error: 'Error during login' });
    }
});

// Get tenant profile (protected)
router.get('/profile', requireTenantAuth, async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.user._id)
            .select('-passwordHash')
            .populate('societyId', 'name location');

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.json(tenant);
    } catch (err) {
        console.error('Fetch tenant profile error:', err);
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

export default router; 