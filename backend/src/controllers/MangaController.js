const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const CryptoJs = require("crypto-js");


const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga');
const { update } = require('../models/Chapter');
const ChapterController = require('./ChapterController');


   
module.exports = {
    async store(req, res){ 
        const {title, genre, synopsis, chapters, scan, status, language } = req.body;
        
        const doesMangaExist = await Manga.exists({ title: title, genre: genre });         
       
        if(doesMangaExist){
            return res.jsonBadRequest(null, "This manga already exists or the title is unavaliable;", null);
            

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
                            
                ],
                user: CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))
                //comments?

            });
            
            manga.save().then(result => {      
                res.jsonOK(result, "Manga added!", null);             
                
            
            
            }).catch(err => {
                console.log(err),
                res.jsonServerError(null, null, err)
                    
            });
        }        
    },

    async index(req, res){

        const { title, genre, scan } = req.query;
       
        let docs = [];

        if (title){
            (await Manga.find( {title: {$regex: title, $options: "i"} } )).forEach(function (doc){
                doc.user = undefined
                docs.push(doc)
            });
        }

        else if (genre){
            (await Manga.find({genre: genre})).forEach(function (doc){
                doc.user = undefined
                docs.push(doc)
            });
        }

        else if(scan){
            (await Manga.find({scan: /scan/})).forEach(function (doc){
                doc.user = undefined
                docs.push(doc)
            });
        }

        else{
            (await Manga.find()).forEach(function (doc){
                doc.user = undefined
                docs.push(doc)
            });     
        }
          

        res.jsonOK(docs, `Page list retrieved successfully! Mangas found: ${docs.length}`, null);    
       
        

    },

    async update(req, res){

        const { title, genre, synopsis, chapters, scan, status, language, manga_id } = req.body;

        if(!manga_id){           
            res.jsonServerError(null, "manga_id undefined", null)
           
        } else{
            const doesMangaExist = await Manga.exists({ _id: manga_id }); 
        
            if(doesMangaExist){
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
                if(scan){
                    update.scan = scan;
                }
                if(status){
                    update.status = status;
                }
                if(language){
                    update.language = language;
                }
               
                Manga.findOneAndUpdate({_id: manga_id}, update, {upsert: true}, function(err, doc) {
                    if (err) 
                        return res.jsonServerError(null, null, err);
                        
                    return res.jsonOK(update, "Saved Sucessfully", null);
                });
        
        
            } else{
                res.jsonServerError(null, "manga required doesnt exists", null)
               
            }                  
        }     
    },

    async delete(req, res){

        const { manga_id } = req.query;     
        const mangas = await Manga.deleteMany({ _id: manga_id });            
       
        if (mangas.n === 0 ){
            return res.jsonNotFound(mangas, "Manga not found", {removed: false});
           
        } else{
            

            (await Chapter.find({manga_id: manga_id})).forEach(function (doc){
                doc.imgCollection.forEach(function (page){
                    
                    fs.unlinkSync('uploads/' + page.filename)  
                })
               
                
            });

            const chapters = await Chapter.deleteMany({ manga_id: manga_id}, (function (err, result){

            }))   

            return res.jsonOK(([{"mangas": mangas.deletedCount}, chapters]), null, null);
        }        
    }
}

