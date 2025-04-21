import mongoose, { Document, Schema } from 'mongoose';

export interface INotice extends Document {
    title: string;
    description: string;
    postedBy: mongoose.Types.ObjectId;
    targetRole: 'admin' | 'tenant';
    societyId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const noticeSchema = new Schema<INotice>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    targetRole: { type: String, enum: ['admin', 'tenant'], required: true },
    societyId: { type: Schema.Types.ObjectId, ref: 'Society', required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Notice = mongoose.model<INotice>('Notice', noticeSchema); 