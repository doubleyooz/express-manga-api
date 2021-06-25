const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const CryptoJs = require("crypto-js");

const { getMessage } = require("../common/messages")
const jwt = require('../common/jwt');

const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga');
const User = require('../models/user');
const user = require('../models/user');


const projection = {
    0 : {
        
        title: 1,
        genre: 1,
        synopsis: 1,                
        n_chapters: 1,
        chapters: 1,
        
        nsfw: 1,
       
        likes: 1,
       
        _id: 0
    },
    1 : {
        updatedAt: 1,
        createdAt: 1,
        title: 1,
        genre: 1,
        synopsis: 1,
        n_chapters: 1,
        chapters: 1,
        language: 1,
        nsfw: 1,
        status: 1,
        scan_id: 1,
        likes: 1,
        __v: 1,
        
        
    },
    2 : {                 
        title: 1,
        genre: 1,
        synopsis: 1,                
        n_chapters: 1,
        chapters: 1,
        
        nsfw: 1,
        
        likes: 1,
       
    }
}



module.exports = {
    async store(req, res){ 
        const {title, genre, synopsis, n_chapters, status, language, nsfw} = req.body;
        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null
        
        const doesMangaExist = await Manga.exists({ title: title });         
        
        let scan_id = CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))
        
        
        req.auth = null
    
        if(doesMangaExist)          
           return res.jsonBadRequest(null, getMessage("manga.error.duplicate"), new_token)
            
            
        
        console.log(req.file)
      
        const scan = await User.findById(scan_id);

        if(!scan){
            
            return res.jsonNotFound(null, getMessage("manga.error.scan_id"), null)
            
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
            scan.mangas.push(manga._id)
                       
            scan.save().then(() => {
                return res.jsonOK(result, getMessage("manga.save.success"), new_token)
            }).catch(err => {
                console.log(err)
                
                return res.jsonServerError(null, null, err)
            })          
                              
                        
        }).catch(err => {
            console.log(err)
            
            return res.jsonServerError(null, null, err)
        
        });
               
    },

    async index(req, res){
        const { title, genre, scan, manga_id } = req.query;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null

        let role;

        if (req.role){
            role = CryptoJs.AES.decrypt(req.role, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))            
            req.role = null
        }else{
            role = 0;
        }
       
        console.log("Role: " + role)
      



        let docs = [];

        if (manga_id){        
            docs.push(await Manga.findById(manga_id).select(projection[role]).exec());         
        } 

        else if (title){
            (await Manga.find( {title: {$regex: title, $options: "i"} } ).select(projection[role])).forEach(function (doc){
                docs.push(doc)
            });
        }

        else if (genre){
            (await Manga.find({genre: genre}).select(projection[role])).forEach(function (doc){
                docs.push(doc)
            });
        }

        else if(scan){
            (await User.find({name: scan, role: "Scan"}).select(projection[role])).forEach(function (result){
                Manga.find({scan_id: result._id}).then(doc => {   
                    docs.push(doc)
                });
            })
            
        }

        else{            
            (await Manga.find().select(projection[role])).forEach(function (doc){
                docs.push(doc)
            });     
        }
                  
        docs.forEach(function(doc){
            doc.user = undefined

        });
        return res.jsonOK(docs, getMessage("manga.list.success") + docs.length, new_token)
                 

    },

    async update(req, res){
        const { title, genre, synopsis, n_chapters, status, language, manga_id, nsfw } = req.body;
        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null

        if(!manga_id){           
            return res.jsonBadRequest(null, getMessage("manga.error.manga_id"), null)
        
        } else{
            const manga = await Manga.findById(manga_id);

            if(manga){
                if(manga.scan_id.toString() === CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))){
                    
                    if(title){
                        manga.title = title;
                    }
                    if(genre){
                        manga.genre = genre;
                    }
                    if(synopsis){
                        manga.synopsis = synopsis;
                    }
                    if(n_chapters){
                        manga.n_chapters = n_chapters;
                    }                   
                    
                    if(status){
                        manga.status = status;
                    }

                    if(nsfw){
                        manga.nsfw = nsfw;
                    }
                    if(language){
                        manga.language = language;
                    }

                    manga.updatedAt = Date.now()
                    let changes = manga.getChanges()
                    manga.save().then(answer => {  
                        return res.jsonOK(changes, getMessage("manga.update.success"), new_token)

                    }).catch(err => {
                        return res.jsonServerError(null, null, err)
                    })
                   
                  
            
                } else{
                    return res.jsonUnauthorized(null, null, null);
                }
    
            } else{
                return res.jsonNotFound(null, getMessage("manga.notfound"), new_token)
               
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
                    return res.jsonNotFound(mangas, getMessage("manga.notfound"), new_token);
                                  
                const scan = await User.findById(scan_id);


                scan.mangas = scan.mangas.filter(function (_id){ return _id.toString() !== manga_id.toString() })
                
                scan.save(function(err) {
                    // yet another err object to deal with
                    if (err) {
                      return res.jsonServerError(null, null, err)
                    }
                                      
                });
                

                (await Chapter.find({manga_id: manga_id})).forEach(function (doc){
                    doc.imgCollection.forEach(function (page){                            
                        fs.unlinkSync('uploads/' + page.filename)  
                    })                      
                });
    
                const chapters = await Chapter.deleteMany({ manga_id: manga_id}, (function (err){
                    if(err){
                        return res.jsonServerError(null, null, err)
                    }
                }))   
                
              
                return res.jsonOK(
                        ({"mangas affected": mangas.deletedCount, "chapters affected": chapters},
                            null,
                            new_token
                        )
                    
                );
                
            } 

            return res.jsonUnauthorized(null, null, null)
            
        } 

        return res.jsonBadRequest(null, getMessage("manga.notfound"), new_token)
    
        
    }
}