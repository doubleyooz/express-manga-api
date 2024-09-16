import mongoose from 'mongoose';

const chapter = {
    mangaId: mongoose.Types.ObjectId().toString(),
    title: 'The search',
    number: 52,
    language: 'en',
    _id: '',
};

const chapter2 = {
    mangaId: mongoose.Types.ObjectId().toString(),
    title: 'The Beginning',
    number: 1,
    language: 'en',
    _id: '',
};

export { chapter, chapter2 };
