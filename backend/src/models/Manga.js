const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
    cover: {
        type: String,
        unique: true,
        default: ""

    },
    title: {
        type: String,
        unique: true
    },
    genre: String,
    synopsis: String,
    n_chapters:{
        type: Number,
        default: 0,
    },    
    status: Number, 
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    user_alert: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    nsfw:{
        type:Boolean,
        default: false
    },
    language: String,    
    chapters: [{ //a array fill with the data links
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    
    }],
    scan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    //comments?

});


module.exports = mongoose.model('Manga', MangaSchema);