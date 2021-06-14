const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const CryptoJs = require("crypto-js");

const response = require("../common/response");
const jwt = require('../common/jwt');

const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga');
const User = require('../models/user');


const { update } = require('../models/Chapter');
const ChapterController = require('./ChapterController');





module.exports = {
    async store(req, res){ 
        const {title, genre, synopsis, n_chapters, status, language, nsfw} = req.body;
        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null
        
        const doesMangaExist = await Manga.exists({ title: title, genre: genre });         
        
        const scan_id = CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))
        req.auth = null
        
        if(doesMangaExist){            
            
            return res.json(
                response.jsonBadRequest(null, "This manga already exists or the title is unavaliable", new_token)
            );

        } 
       
        if(!mongoose.isValidObjectId(scan_id)){
            return res.json(
                response.jsonBadRequest(null, "Scan_id must be a valid id", null)
            );
        }
        console.log("here")
        const manga = new Manga({
            title: title,
            genre: genre,
            synopsis: synopsis,
            n_chapters: n_chapters,
            status: status,                  
            language: language,
            nsfw: nsfw,               
            scan_id: scan_id
            //comments?

        });

        
        
        manga.save().then(result => {   
            return res.json(
                response.jsonOK(result, "Manga added!", new_token)
            )                      
                        
        }).catch(err => {
            console.log(err)
            return res.json(
                response.jsonServerError(null, null, err)
            )
        });
               
    },

    async index(req, res){
        const { title, genre, scan, manga_id } = req.query;
        const new_token = (req.new_token) ? req.new_token : null;

        let docs = [];

        if (manga_id){        
            docs.push(await Manga.findById(manga_id).exec());         
        } 

        else if (title){
            (await Manga.find( {title: {$regex: title, $options: "i"} } )).forEach(function (doc){
                docs.push(doc)
            });
        }

        else if (genre){
            (await Manga.find({genre: genre})).forEach(function (doc){
                docs.push(doc)
            });
        }

        else if(scan){
            (await User.find({name: scan, role: "Scan"})).forEach(function (result){
                Manga.find({scan_id: result._id}).then(doc => {   
                    docs.push(doc)
                });
            })
            
        }

        else{            
            (await Manga.find()).forEach(function (doc){
                docs.push(doc)
            });     
        }
                  
        docs.forEach(function(doc){
            doc.user = undefined

        });
        return res.json(
            response.jsonOK(docs, `Page list retrieved successfully! Mangas found: ${docs.length}`, new_token)
        )           

    },

    async update(req, res){
        const { title, genre, synopsis, chapters, status, language, manga_id } = req.body;
        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null

        if(!manga_id){           
            return res.json(
                response.jsonBadRequest(null, "manga_id undefined", null)
            )
        } else{
            const manga = await Manga.findById(manga_id);

            if(manga){
                if(manga.scan_id.toString() === CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))){
                    let update = {};
    
                    if(title){
                        update.title = title;
                    }
                    if(genre){
                        update.genre = genre;
                    }
                    if(synopsis){
                        update.synopsis = synopsis;
                    }
                    if(chapters){
                        update.chapters = chapters;
                    }                   
                    
                    if(status){
                        update.status = status;
                    }
                    if(language){
                        update.language = language;
                    }

                    update.updated_At = Date.now()
                   
                    Manga.findOneAndUpdate({_id: manga_id}, update, {upsert: true}, function(err, doc) {
                        if (err) 
                            return res.json(response.jsonServerError(null, null, err))
                            
                        return res.json(response.jsonOK(update, "Saved Sucessfully", new_token))
                    });
            
                } else{
                    return res.json(response.jsonUnauthorized(null, null, null));
                }
    
            } else{
                return res.json(response.jsonServerError(null, "manga required doesnt exists", new_token))
               
            }                       
        }     
    },

    async delete(req, res){
        const { manga_id } = req.query;            
        const manga = await Manga.findById(manga_id);

        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null
        
      
        const scan_id =  CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))
        req.auth = null

        if(manga){           
            if(manga.scan_id.toString() === scan_id){              
                const mangas = await Manga.deleteMany({ _id: manga_id });        

                if (mangas.n === 0)
                    return res.jsonNotFound(mangas, "Manga not found", new_token);
                                  
                
                (await Chapter.find({manga_id: manga_id})).forEach(function (doc){
                    doc.imgCollection.forEach(function (page){                            
                        fs.unlinkSync('uploads/' + page.filename)  
                    })                      
                });
    
                const chapters = await Chapter.deleteMany({ manga_id: manga_id}, (function (err, result){
    
                }))   
                
              
                return res.json(
                    response.jsonOK(
                        ({"mangas affected": mangas.deletedCount, "chapters affected": chapters},
                            null,
                            new_token
                        )
                    )
                );
                
            } 

            return res.json(response.jsonUnauthorized(null, null, null))
            
        } 

        return res.json(
            response.jsonBadRequest(null, "manga could not be found", new_token)
        )
        
    }
}