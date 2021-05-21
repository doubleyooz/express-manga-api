const mongoose = require('mongoose');
const { boolean } = require('yup');

const ScanSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required:true, select: false },

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
    active:{
        type: Boolean,
        default: false
    },

    resetLink:{
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('Scan', ScanSchema);