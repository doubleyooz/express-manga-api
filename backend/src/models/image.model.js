import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema(
    {
        size: Number,
        filename: String,
        originalname: String,
    },
    { timestamps: true },
);

export default mongoose.model('Image', ImageSchema);
