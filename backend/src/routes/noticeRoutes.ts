import express from 'express';
import { Notice } from '../models/Notice';
import { requireAdminAuth } from '../middleware/auth';
import { requireTenantAuth } from '../middleware/auth';

const router = express.Router();

// Create notice (admin only)
router.post('/', requireAdminAuth, async (req, res) => {
    try {
        const { title, description, targetRole } = req.body;
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
        res.status(400).json({ error: 'Error creating notice' });
    }
});

// Get notices for admin
router.get('/admin', requireAdminAuth, async (req, res) => {
    try {
        const notices = await Notice.find({
            societyId: req.user.societyId,
            targetRole: 'admin'
        }).sort({ createdAt: -1 });
        res.json(notices);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching notices' });
    }
});

// Get notices for tenant
router.get('/tenant', requireTenantAuth, async (req, res) => {
    try {
        const notices = await Notice.find({
            societyId: req.user.societyId,
            targetRole: 'tenant'
        }).sort({ createdAt: -1 });
        res.json(notices);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching notices' });
    }
});

export default router; 