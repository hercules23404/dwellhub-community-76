import mongoose, { Document } from 'mongoose';

export interface IAdmin extends Document {
    email: string;
    password: string;
    name: string;
    role: 'admin';
    societyId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const adminSchema = new mongoose.Schema({
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
        default: 'admin',
        immutable: true
    },
    societyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society'
    }
}, {
    timestamps: true
});

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema); 