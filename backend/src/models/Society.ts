import mongoose, { Document, Schema } from 'mongoose';

export interface ISociety extends Document {
    name: string;
    location: string;
    createdByAdminId: mongoose.Types.ObjectId;
}

const societySchema = new Schema<ISociety>({
    name: { type: String, required: true },
    location: { type: String, required: true },
    createdByAdminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true }
});

export const Society = mongoose.model<ISociety>('Society', societySchema); 