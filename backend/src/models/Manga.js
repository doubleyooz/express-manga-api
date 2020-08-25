const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
    title: String,
    genre: String,
    synopsis: String,
    chapters:{
        type: Number,
        default: 0,
    },
    scan: String,
    status: Number, 
    language: String,    
    data: [{ //a array fill with the data links
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    
     }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    //comments?

});


module.exports = mongoose.model('Manga', MangaSchema);