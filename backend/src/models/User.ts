import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    role: 'admin' | 'tenant';
    societyId?: string;
    name?: string;
    phone?: string;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema({
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
    role: {
        type: String,
        enum: ['admin', 'tenant'],
        required: true
    },
    societyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society'
    },
    name: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    profileImage: {
        type: String
    }
}, {
    timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema); 