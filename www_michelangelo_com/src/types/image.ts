import mongoose, { Model } from 'mongoose';

interface IImage {
  prompt: string;
  imageUrl: string;
  userId: mongoose.Types.ObjectId;
  isPublic: boolean;
  createdAt: Date;
}

type ImageModel = Model<IImage>;

const imageSchema = new mongoose.Schema<IImage, ImageModel>({
  prompt: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Image = (mongoose.models.Image || mongoose.model<IImage>('Image', imageSchema)) as ImageModel; 