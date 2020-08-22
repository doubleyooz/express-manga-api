const mongoose = require('mongoose');
const path = require('path');

const fs = require('fs');
const Chapter = require('../models/Chapter');
const multer = require('multer');

   
module.exports = {
    async store(req, res){
        const { manga_id, chapter_id } = req.body;
        console.log(req.files)
       

        const chapter = new Chapter({
            manga_id: manga_id,
            chapter_id: chapter_id,
            imgCollection: [{
                name: 'originalname',
                size: 20,
                key: 'filename',
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

