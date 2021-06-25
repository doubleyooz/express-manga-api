const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    
    size: Number,         
    filename: String, 
    originalname: String,  

    },{

    toJSON: {
        virtuals: true,
    }
})

module.exports = mongoose.model('Page', PageSchema);