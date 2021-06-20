const mongoose = require('mongoose');

const PageSchema = require('./Page').schema;

const ChapterSchema = new mongoose.Schema({
    manga_id: String,
    number: Number,
    title:{
        type: String,
        default: 'none'
    },
    //pages: Number,
    imgCollection: {
        type: [PageSchema],
        default: [{
            originalname: "none",           
            size: 0,   
            filename: "none"      
            
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
    //comments?

});


module.exports = mongoose.model('Chapter', ChapterSchema);