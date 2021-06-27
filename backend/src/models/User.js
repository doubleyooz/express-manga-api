const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required:true, select: false },

    role: {
        type: String,
        default: "User"
    },

    name: { 
        type: String,
        required: true,
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

    addedAt: {
        type: Date,
        default: Date.now
    },

    mangas: [{ //a array fill with the mangas ids
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga'
    
    }],

    manga_alert: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga'
    }],
    
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    token_version:{
        type: Number,
        default: 0
    },

    active:{
        type: Boolean,
        default: false
    },

    resetLink:{
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('User', UserSchema);