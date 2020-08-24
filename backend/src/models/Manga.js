const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
    _id: Number, //the manga id
    genre: String,
    synopsis: String,
    chapters:{
        type: Number,
        default: 0,
    },
    scan: String,
    status: Number,     
    data: [{ //a array fill with the data links
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    
     }]
    //comments?

});


module.exports = mongoose.model('Manga', MangaSchema);