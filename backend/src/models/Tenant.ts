import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
    name: string;
    email: string;
    passwordHash: string;
    flatNumber: string;
    societyId: mongoose.Types.ObjectId;
}

const tenantSchema = new Schema<ITenant>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    flatNumber: { type: String, required: true },
    societyId: { type: Schema.Types.ObjectId, ref: 'Society', required: true }
});

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema); 