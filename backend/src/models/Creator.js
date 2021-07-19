const mongoose = require('mongoose');

const CreatorSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "Author"
    },

    photos:[{
        type: String,
        default: "Author"
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