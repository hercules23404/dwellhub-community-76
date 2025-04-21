import express from 'express';
import { Notice } from '../models/Notice';
import { requireAdminAuth, requireTenantAuth } from '../middleware/auth';

const router = express.Router();

// Create notice (admin only)
router.post('/', requireAdminAuth, async (req, res) => {
    try {
        const { title, description, targetRole } = req.body;

        if (!title || !description || !targetRole) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!['admin', 'tenant'].includes(targetRole)) {
            return res.status(400).json({ error: 'Invalid target role' });
        }

        if (!req.user.societyId) {
            return res.status(400).json({ error: 'Admin must be associated with a society' });
        }

        const notice = new Notice({
            title,
            description,
            postedBy: req.user._id,
            targetRole,
            societyId: req.user.societyId
        });

        await notice.save();
        res.status(201).json(notice);
    } catch (err) {
        console.error('Create notice error:', err);
        res.status(500).json({ error: 'Error creating notice' });
    }
});

// Get notices for admin
router.get('/admin', requireAdminAuth, async (req, res) => {
    try {
        if (!req.user.societyId) {
            return res.status(400).json({ error: 'Admin must be associated with a society' });
        }

        const notices = await Notice.find({
            societyId: req.user.societyId,
            targetRole: 'admin'
        })
            .sort({ createdAt: -1 })
            .populate('postedBy', 'name email');

        res.json(notices);
    } catch (err) {
        console.error('Fetch admin notices error:', err);
        res.status(500).json({ error: 'Error fetching notices' });
    }
});

// Get notices for tenant
router.get('/tenant', requireTenantAuth, async (req, res) => {
    try {
        if (!req.user.societyId) {
            return res.status(400).json({ error: 'Tenant must be associated with a society' });
        }

        const notices = await Notice.find({
            societyId: req.user.societyId,
            targetRole: 'tenant'
        })
            .sort({ createdAt: -1 })
            .populate('postedBy', 'name');

        res.json(notices);
    } catch (err) {
        console.error('Fetch tenant notices error:', err);
        res.status(500).json({ error: 'Error fetching notices' });
    }
});

export default router; 