import mongoose from 'mongoose';
import ImageSchema from './image.model';

const AuthorSchema = new mongoose.Schema(
    {
        types: [
            {
                type: String,
            },
        ],

        imgCollection: [
            {
                type: [ImageSchema],
            },
        ],

        name: {
            type: String,
            required: true,
            unique: true,
        },

        birthDate: {
            type: Date,
        },

        deathDate: {
            type: Date,
        },

        works: [
            {
                //a array fill with the mangas ids
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Manga',
            },
        ],

        biography: {
            type: String,
        },

        socialMedia: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true },
);

export default mongoose.model('Author', AuthorSchema);
