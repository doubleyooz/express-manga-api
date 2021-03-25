const mongoose = require('mongoose');


const PageSchema = new mongoose.Schema({
    
        name: String,
        size: Number,
        key: String,
        url: String,
        filename: String, 
        originalname: String,  
   
},{

    toJSON: {
        virtuals: true,
    }
})

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
            filename: "none",        
            url: "none", 
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    //comments?

});


module.exports = mongoose.model('Chapter', ChapterSchema);