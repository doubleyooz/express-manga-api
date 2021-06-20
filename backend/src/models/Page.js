const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    
    name: String,
    size: Number,
    key: String,        
    filename: String, 
    originalname: String,  

    },{

    toJSON: {
        virtuals: true,
    }
})

module.exports = mongoose.model('Page', PageSchema);