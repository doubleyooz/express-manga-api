const mongoose = require('mongoose');


const PageSchema = new mongoose.Schema({
    
        name: String,
        size: Number,
        key: String,
        url: String
    
   
},{

    toJSON: {
        virtuals: true,
    }
})


const ChapterSchema = new mongoose.Schema({
    manga_id: String,
    number: Number, 
    //pages: Number,
    imgCollection: {
        type: [PageSchema],
        default: [{
            name: "none",
            size: 0,           
            url: "none", 
        }]
    } ,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    //comments?

});



PageSchema.virtual('page_url').get(function(){   
    
    return `http://localhost:3333/files/`;;
      

    
});

module.exports = mongoose.model('Chapter', ChapterSchema);