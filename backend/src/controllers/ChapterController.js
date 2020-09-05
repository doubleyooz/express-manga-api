const mongoose = require('mongoose');
const path = require('path');

const fs = require('fs');


const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga')
const valid_user = true;

module.exports = {
    async store(req, res){
        
        const { manga_id, number } = req.body;

        if(!valid_user){            
            return res.status(401).json({               
                id: manga_id,
                message: "Manga cannot be found."               
            });
        }

        Manga.findOne({_id: manga_id}, function (err, manga){ 
            if(manga){                
                let jsonString = [];         
                
                Object.keys(req.files).forEach((i) => {
                    let file = req.files[i];

                    let temp = { originalname: file.originalname,
                                size: file.size,
                                filename: file.filename,
                                url: "http://localhost:3333/files/" + file.filename,
                    }                            
                
                    jsonString.push(JSON.parse(JSON.stringify(temp)));
                    
                });

                console.log(jsonString);

                const chapter = new Chapter({                    
                    manga_id: manga_id,
                    number: number,
                    imgCollection: [
                            
                    ],
                });

                chapter.imgCollection = jsonString;
            
                chapter.save().then(result => {
                    manga.data.push(result._id) 
                    manga.save().then(answer => {

                    }).catch(err =>{
                        Chapter.deleteOne({_id: result._id});
                        console.log(err),
                        res.status(500).json({
                            error: err,
                            message: "Chapter wasn't saved"
                        });
                    });
                    res.status(201).json({
                        message: "Done upload!",
                        chapterAdded: {
                            manga_id: result.manga_id,
                            chapter_id: result._id,
                            number: number,
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
        
        const { manga_id } = req.body;

        Manga.findById(manga_id, function(err, manga){
            res.status(200).json({
                message:"Chapters retrieved successfully!",
                chapters: manga.data
            })
        });       
    },

    async delete(req, res){

        const { manga_id, chapter_id } = req.query;

        const chapters = await Chapter.deleteMany( { manga_id: manga_id, _id: chapter_id });

        

        if (chapters.n === 0 ){
            return res.json({ removed: false, chapters: chapters });
        } else{
            return res.json({ removed: true, chapters: chapters });
        }

        
    }
}

