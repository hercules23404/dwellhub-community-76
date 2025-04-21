import express, { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { Society } from '../models/Society';
import { Tenant } from '../models/Tenant';
import { requireAdminAuth } from '../middleware/auth';
import { generateToken } from '../utils/jwt';
import { RouteHandler, AuthenticatedRouteHandler, AuthenticatedRequest } from '../types/route';

const router = express.Router();

const signup: RouteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const admin = new Admin({
            email,
            password: hashedPassword,
            name,
            role: 'admin'
        });

        await admin.save();

        const token = generateToken(admin._id.toString(), 'admin');

        res.status(201).json({
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

const login: RouteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcryptjs.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(admin._id.toString(), 'admin');

        res.json({
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                societyId: admin.societyId
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

const createSociety: AuthenticatedRouteHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { name, address, totalUnits } = req.body;

        const existingSociety = await Society.findOne({ createdByAdminId: req.user.id });
        if (existingSociety) {
            return res.status(400).json({ message: 'Admin already has a society' });
        }

        const society = new Society({
            name,
            address,
            totalUnits,
            createdByAdminId: req.user.id
        });

        await society.save();
        await Admin.findByIdAndUpdate(req.user.id, { societyId: society._id });

        res.status(201).json(society);
    } catch (error) {
        next(error);
    }
};

const getSociety: AuthenticatedRouteHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const society = await Society.findOne({ createdByAdminId: req.user.id });
        if (!society) {
            return res.status(404).json({ message: 'Society not found' });
        }
        res.json(society);
    } catch (error) {
        next(error);
    }
};

const createTenant: AuthenticatedRouteHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { email, password, name, unit } = req.body;

        if (!req.user.societyId) {
            return res.status(400).json({ message: 'Admin must create a society first' });
        }

        const existingTenant = await Tenant.findOne({ email });
        if (existingTenant) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const tenant = new Tenant({
            email,
            password: hashedPassword,
            name,
            unit,
            role: 'tenant',
            societyId: req.user.societyId
        });

        await tenant.save();

        res.status(201).json({
            tenant: {
                id: tenant._id,
                email: tenant.email,
                name: tenant.name,
                unit: tenant.unit,
                role: tenant.role
            }
        });
    } catch (error) {
        next(error);
    }
};

const getTenants: AuthenticatedRouteHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user.societyId) {
            return res.status(400).json({ message: 'Admin must create a society first' });
        }

        const tenants = await Tenant.find({ societyId: req.user.societyId })
            .select('-password');

        res.json(tenants);
    } catch (error) {
        next(error);
    }
};

router.post('/signup', signup);
router.post('/login', login);
router.post('/society', requireAdminAuth, createSociety);
router.get('/society', requireAdminAuth, getSociety);
router.post('/tenants', requireAdminAuth, createTenant);
router.get('/tenants', requireAdminAuth, getTenants);

export default router; 