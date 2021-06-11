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
        
        const doesMangaExist = await Manga.exists({ title: title, genre: genre });         
       
        const scan_id = CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))
        req.auth = null
        if(doesMangaExist){
            return res.json(
                response.jsonBadRequest(null, "This manga already exists or the title is unavaliable;", req.headers.authorization)
            );

        } 
        if(!mongoose.isValidObjectId(scan_id)){
            return res.json(
                response.jsonBadRequest(null, "Scan_id must be a valid id", req.headers.authorization)
            );
        }
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
                response.jsonOK(result, "Manga added!", req.headers.authorization)
            )                      
                        
        }).catch(err => {
            console.log(err)
            return res.json(
                response.jsonServerError(null, null, err)
            )
        });
               
    },

    async index(req, res){
        const { title, genre, scan } = req.query;
       
        let docs = [];

        if (title){
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
            response.jsonOK(docs, `Page list retrieved successfully! Mangas found: ${docs.length}`, req.headers.authorization)
        )           

    },

    async update(req, res){
        const { title, genre, synopsis, chapters, status, language, manga_id } = req.body;

        if(!manga_id){           
            return res.json(
                response.jsonServerError(null, "manga_id undefined", null)
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
                            
                        return res.json(response.jsonOK(update, "Saved Sucessfully", req.headers.authorization))
                    });
            
                } else{
                    return res.json(response.jsonUnauthorized(null, null, null));
                }
    
            } else{
                return res.json(response.jsonServerError(null, "manga required doesnt exists", null))
               
            }                       
        }     
    },

    async delete(req, res){
        const { manga_id } = req.query;             
        const manga = await Manga.findById(manga_id);
        const scan_id =  CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))
        req.auth = null

        if(manga){           
            if(manga.scan_id.toString() === scan_id){              
                const mangas = await Manga.deleteMany({ _id: manga_id });        

                if (mangas.n === 0)
                    return res.jsonNotFound(mangas, "Manga not found", {removed: false});
                                  
                
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
                            req.headers.authorization
                        )
                    )
                );
                
            } 

            return res.json(response.jsonUnauthorized(null, null, null))
            
        } 

        return res.json(
            response.jsonBadRequest(null, "manga could not be found", req.headers.authorization)
        )
        
    }
}

