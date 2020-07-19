const mongoose = require('mongoose');

const Chapter = require('../models/Chapter');
const multer = require('multer');
   
module.exports = {
    async store(req, res){
       
        const reqFiles = [];
        const url = req.protocol + '://' + req.get('host')
        for (var i = 0; i < req.files.length; i++) {
            reqFiles.push(url + '/uploads/' + req.files[i].filename)
        } //foreach
        
        console.log(req.file)
        const chapter = new Chapter({
            manga_id: req.manga_id,
            chapter_id: req.chapter_id,
            imgCollection: [{
                name: req.file.originalname,
                size: req.file.size,
                key: req.file.filename,
                url: ''        
            }],
        });
       
        chapter.save().then(result => {
            res.status(201).json({
                message: "Done upload!",
                chapterAdded: {
                    manga_id: result.manga_id,
                    chapter_id: result.chapter_id,
                    imgCollection: result.imgCollection
                }
            })
           
        }).catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        })
        console.log('step-3')
        
    },

    async index(req, res){
        Chapter.find().then(data => {
            res.status(200).json({
                message: "Page list retrieved successfully!",
                pages: data
            });
        });
    }

    
}

