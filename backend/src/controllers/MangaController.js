const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');


const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga');
const { delete } = require('../routes');

   
module.exports = {
    async store(req, res){       
        const {title, genre, synopsis, chapters, scan, status, language } = req.body;
        
        const doesMangaExist = await Manga.exists({ title: title, genre: genre }); 
        
        
        if(doesMangaExist){
            return res.send("This manga already exists or the title is unavaliable;")

        } else{
            
            const manga = new Manga({
                title: title,
                genre: genre,
                synopsis: synopsis,
                chapters: chapters,
                status: status,
                scan: scan,    
                language: language, 
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
                        title: result.title,
                        genre: result.genre,
                        synopsis: result.synopsis,
                        chapters: result.chapters,
                        status: result.status,
                        scan: result.scan,  
                        language: result.language,   
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
        

        const cursor = Manga.find().cursor();

        let docs = [];

        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
           docs.push(doc);
           
        }

        res.status(200).json({
            message: "Page list retrieved successfully!",
            manga: docs
            
        });   
    },

    async delete(req, res){

        const { manga_id } = req.query();

        const mangas = await Manga.deleteMany( { _id: manga_id });

        

        if (mangas.n === 0 ){
            return res.json({ removed: false, mangas: mangas });
        } else{
            return res.json({ removed: true, mangas: mangas });
        }

        
    }
}

