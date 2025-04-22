import express from 'express';
import { Notice } from '../models/Notice';
import { requireAdminAuth, requireTenantAuth } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/express';
import { Response } from 'express';

const router = express.Router();

// Create a new notice
const createNotice = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, content, priority } = req.body;
        const notice = new Notice({
            title,
            content,
            priority,
            societyId: req.user.societyId
        });
        await notice.save();
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice' });
    }
};

// Get all notices for admin
const getAdminNotices = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const notices = await Notice.find({ societyId: req.user.societyId });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices' });
    }
};

// Get all notices for tenant
const getTenantNotices = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const notices = await Notice.find({ societyId: req.user.societyId });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices' });
    }
};

router.post('/', requireAdminAuth, createNotice);
router.get('/admin', requireAdminAuth, getAdminNotices);
router.get('/tenant', requireTenantAuth, getTenantNotices);

export default router; 