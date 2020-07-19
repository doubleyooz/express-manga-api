const mongoose = require('mongoose');


const PageSchema = new mongoose.Schema({
    imgCollection: {
        name: String,
        size: Number,
        key: String,
        url: String
    },
   
},{

    toJSON: {
        virtuals: true,
    }
})

const Group = mongoose.model('Group', PageSchema)

const ChapterSchema = new Group({
    manga_id: Number,
    chapter_id: Number, //must match the manga id
    //pages: Number,
    imgCollection: [{
        name: String,
        size: Number,
        key: String,
        url: String        
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
    //comments?

});



PageSchema.virtual('page_url').get(function(){   
    
    return `http://localhost:3333/files/332/}`;;
      

    
});

module.exports = mongoose.model('Chapter', ChapterSchema);