const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');


const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga');

   
module.exports = {
    async store(req, res){
        
        const { manga_id, chapter_id } = req.body;

        Manga.findOne({id: manga_id}, function (err, obj){ 
            if(obj){                
                let jsonString = [];         
                
                Object.keys(req.files).forEach((i) => {
                    let file = req.files[i];

                    let obj = { originalname: file.originalname,
                                size: file.size,
                                filename: file.filename,
                                url: "url",
                    }                            
                
                    jsonString.push(JSON.parse(JSON.stringify(obj)));
                    
                });

                console.log(jsonString);

                const chapter = new Chapter({
                    manga_id: manga_id,
                    chapter_id: chapter_id,
                    imgCollection: [
                            
                    ],
                });

                chapter.imgCollection = jsonString;
            
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
                });

            } else{
                res.status(404).json({
                    id: manga_id,
                    message: "Manga cannot be found."
                });
            }
        });         
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

