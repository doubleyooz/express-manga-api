const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');


const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga');

   
module.exports = {
    async store(req, res){
       
        const { manga_id, genre, synopsis, chapters, scan, status } = req.body;


        const doesMangaExist = await Manga.exists({ _id: manga_id });
         
        if(doesMangaExist){
            return res.send("This manga already exists or id unavaliable;")

        } else{
            
            const manga = new Manga({
                _id: manga_id, //the manga id
                genre: genre,
                synopsis: synopsis,
                chapters: chapters,
                status: status,
                scan: scan,     
                data: [ //a array fill with the data links
                            
                ]
                //comments?

            });

            
            console.log(req.body)
            manga.save().then(result => {                    
                res.status(201).json({
                    message: "Manga added!",
                    mangaAdded: {
                        id: result._id, //the manga id
                        genre: result.genre,
                        synopsis: result.synopsis,
                        chapters: result.chapters,
                        status: result.status,
                        scan: result.scan,     
                        data: result.data,
                    }
                })
            
            
            }).catch(err => {
                console.log(err),
                    res.status(500).json({
                        error: err
                    });
            });
        }        
    },

    async index(req, res){
        Manga.find().then(data => {
            res.status(200).json({
                message: "Page list retrieved successfully!",
                manga: data
            });
        });
    }
}

