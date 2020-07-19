const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
    root_id: Number, //the manga id
    genre: String,
    synopsis: String,
    chapters: Number,     
    data: [{ //a array fill with the data links
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    
     }]
    //comments?

});


module.exports = mongoose.model('Chapter', ChapterSchema);