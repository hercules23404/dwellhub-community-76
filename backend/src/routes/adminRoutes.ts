import express from 'express';
import { Admin } from '../models/Admin';
import { Society } from '../models/Society';
import { Tenant } from '../models/Tenant';
import { requireAdminAuth } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const admin = new Admin({ name, email, passwordHash });
        await admin.save();

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET as string);
        res.status(201).json({ admin, token });
    } catch (err) {
        res.status(400).json({ error: 'Error creating admin' });
    }
});

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            throw new Error();
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        if (!isMatch) {
            throw new Error();
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET as string);
        res.json({ admin, token });
    } catch (err) {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Create society (protected)
router.post('/society', requireAdminAuth, async (req, res) => {
    try {
        const { name, location } = req.body;
        const society = new Society({
            name,
            location,
            createdByAdminId: req.user._id
        });

        await society.save();
        res.status(201).json(society);
    } catch (err) {
        res.status(400).json({ error: 'Error creating society' });
    }
});

// Get society details (protected)
router.get('/society', requireAdminAuth, async (req, res) => {
    try {
        const society = await Society.findOne({ createdByAdminId: req.user._id });
        res.json(society);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching society' });
    }
});

// Create tenant (protected)
router.post('/tenants', requireAdminAuth, async (req, res) => {
    try {
        const { name, email, password, flatNumber } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const tenant = new Tenant({
            name,
            email,
            passwordHash,
            flatNumber,
            societyId: req.user.societyId
        });

        await tenant.save();
        res.status(201).json(tenant);
    } catch (err) {
        res.status(400).json({ error: 'Error creating tenant' });
    }
});

// List tenants (protected)
router.get('/tenants', requireAdminAuth, async (req, res) => {
    try {
        const tenants = await Tenant.find({ societyId: req.user.societyId });
        res.json(tenants);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching tenants' });
    }
});

export default router; 