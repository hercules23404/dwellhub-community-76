import mongoose, { Document } from 'mongoose';

export interface ITenant extends Document {
    email: string;
    password: string;
    name: string;
    role: string;
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
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'tenant',
    },
    unit: {
        type: String,
        required: true,
    },
    societyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society',
        required: true,
    },
}, {
    timestamps: true,
});

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema); 