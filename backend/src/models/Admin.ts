import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
    name: string;
    email: string;
    passwordHash: string;
    societyId?: mongoose.Types.ObjectId;
}

const adminSchema = new Schema<IAdmin>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    societyId: { type: Schema.Types.ObjectId, ref: 'Society' }
});

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema); 