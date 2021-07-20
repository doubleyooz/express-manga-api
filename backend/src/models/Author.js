const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "Writer"
    },

    photos:[{
        type: String,
        default: "Writer"
    }],

    name: { 
        type: String,
        required: true,
    },

    birthDate:{
        type: Date
    },

    deathDate:{
        type: Date
    },
   
    works: [{ //a array fill with the mangas ids
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manga'
    
    }],

    biography: {
        type: String
    },

    socialMedia: [{
        type: String
    }],

    updatedAt: {
        type: Date,
        default: Date.now
    },

    addedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Creator', CreatorSchema);