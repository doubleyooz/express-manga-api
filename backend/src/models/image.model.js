import mongoose from 'mongoose';

export default new mongoose.Schema(
    {
        size: Number,
        filename: {
            type: String,
            unique: true,
        },

        originalname: String,
    },
    { _id: false, timestamps: true },
);

