const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "Writer"
    },

    photos:[{
        type: Object,
        size: Number,         
        filename: String, 
        originalname: String,  

        default: [{
            originalname: "none",           
            size: 0,   
            filename: "none"      
            
        }]
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

module.exports = mongoose.model('Author', AuthorSchema);