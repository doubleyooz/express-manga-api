import mongoose from 'mongoose';

const review = {
    text: 'this one is terrible, dont waste your time',
    rating: 1,    
    user_id: mongoose.Types.ObjectId().toString(),
    manga_id: mongoose.Types.ObjectId().toString(),
    _id: '',
    __v: 0,
};

const review2 = {
    text: 'this one is very good, has changed my life',
    rating: 4.3,
    user_id: mongoose.Types.ObjectId().toString(),
    manga_id: mongoose.Types.ObjectId().toString(),
    _id: '',
    __v: 0,
};

export { review, review2 };
