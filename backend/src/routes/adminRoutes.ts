import express from 'express';
import { Admin } from '../models/Admin';
import { Society } from '../models/Society';
import { Tenant } from '../models/Tenant';
import { requireAdminAuth } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { Types } from 'mongoose';

const router = express.Router();

// Admin signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const admin = new Admin({ name, email, passwordHash });
        await admin.save();

        const token = generateToken(admin._id, 'admin');
        res.status(201).json({
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                societyId: admin.societyId
            },
            token
        });
    } catch (err) {
        console.error('Admin signup error:', err);
        res.status(500).json({ error: 'Error creating admin account' });
    }
});

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(admin._id, 'admin', admin.societyId);
        res.json({
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                societyId: admin.societyId
            },
            token
        });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ error: 'Error during login' });
    }
});

// Create society (protected)
router.post('/society', requireAdminAuth, async (req, res) => {
    try {
        const { name, location } = req.body;

        if (!name || !location) {
            return res.status(400).json({ error: 'Name and location are required' });
        }

        // Check if admin already has a society
        const existingSociety = await Society.findOne({ createdByAdminId: req.user._id });
        if (existingSociety) {
            return res.status(400).json({ error: 'Admin already has a society' });
        }

        const society = new Society({
            name,
            location,
            createdByAdminId: req.user._id
        });

        await society.save();

        // Update admin with society ID
        await Admin.findByIdAndUpdate(req.user._id, { societyId: society._id });

        res.status(201).json(society);
    } catch (err) {
        console.error('Society creation error:', err);
        res.status(500).json({ error: 'Error creating society' });
    }
});

// Get society details (protected)
router.get('/society', requireAdminAuth, async (req, res) => {
    try {
        const society = await Society.findOne({ createdByAdminId: req.user._id });
        if (!society) {
            return res.status(404).json({ error: 'Society not found' });
        }
        res.json(society);
    } catch (err) {
        console.error('Fetch society error:', err);
        res.status(500).json({ error: 'Error fetching society' });
    }
});

// Create tenant (protected)
router.post('/tenants', requireAdminAuth, async (req, res) => {
    try {
        const { name, email, password, flatNumber } = req.body;

        if (!name || !email || !password || !flatNumber) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Ensure admin has a society
        if (!req.user.societyId) {
            return res.status(400).json({ error: 'Admin must create a society first' });
        }

        // Check if tenant email already exists
        const existingTenant = await Tenant.findOne({ email });
        if (existingTenant) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const tenant = new Tenant({
            name,
            email,
            passwordHash,
            flatNumber,
            societyId: req.user.societyId
        });

        await tenant.save();
        res.status(201).json({
            tenant: {
                id: tenant._id,
                name: tenant.name,
                email: tenant.email,
                flatNumber: tenant.flatNumber
            }
        });
    } catch (err) {
        console.error('Create tenant error:', err);
        res.status(500).json({ error: 'Error creating tenant' });
    }
});

// List tenants (protected)
router.get('/tenants', requireAdminAuth, async (req, res) => {
    try {
        if (!req.user.societyId) {
            return res.status(400).json({ error: 'Admin must create a society first' });
        }

        const tenants = await Tenant.find({ societyId: req.user.societyId })
            .select('-passwordHash')
            .sort({ createdAt: -1 });
        res.json(tenants);
    } catch (err) {
        console.error('Fetch tenants error:', err);
        res.status(500).json({ error: 'Error fetching tenants' });
    }
});

export default router; 