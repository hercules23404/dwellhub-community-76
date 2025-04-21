import mongoose, { Document } from 'mongoose';

export interface ITenant extends Document {
    email: string;
    password: string;
    name: string;
    role: 'tenant';
    unit: string;
    societyId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const tenantSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: 'tenant',
        immutable: true
    },
    unit: {
        type: String,
        required: true,
        trim: true
    },
    societyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society',
        required: true
    }
}, {
    timestamps: true
});

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema); 