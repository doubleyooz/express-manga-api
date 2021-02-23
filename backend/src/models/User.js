const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required:true, select: false },
    updatedAt: {
        type: Date,
        default: Date.now,
    },

    addedAt: {
        type: Date,
        default: Date.now,
    },

    mangas: [{ //a array fill with the mangas ids
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga'
    
    }],
});

module.exports = mongoose.model('User', UserSchema);