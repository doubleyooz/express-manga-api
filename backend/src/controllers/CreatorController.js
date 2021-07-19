const fs = require('fs');
const CryptoJs = require("crypto-js");

const { getMessage } = require("../common/messages")


const Chapter = require('../models/Chapter');
const Creator = require('../models/Creator');
const User = require('../models/user');
const Manga = require('../models/Manga');





module.exports = {
    async store(req, res){ 
        const {type, name, birthDate, socialMedia, deathDate, biography } = req.body;
        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null
        
        const doesCreatorExist = await Creator.exists({ name: name, type: type });         
        
        
        req.auth = null
    
        if(doesCreatorExist){
            Object.keys(req.files).forEach((i) => {
                let file = req.files[i];   
                fs.unlinkSync('uploads/' + "creators/" + type + "/" + name + "/" + file.filename)    
               
            });
                          
            return res.jsonBadRequest(null, getMessage("creator.error.duplicate"), new_token)
        }       
        let jsonString = [];         
                                            
        Object.keys(req.files).forEach((i) => {
            let file = req.files[i];
            
            let temp = { 
                originalname:  file.originalname,
                size: file.size,
                filename: file.filename,
                        
            }                            
        
            jsonString.push(JSON.parse(JSON.stringify(temp)));
            
        });

        const creator = new Creator({
            photos: [],
            type: type,
            name: name,
            birthDate: birthDate,
            deathDate: deathDate,
            socialMedia: socialMedia,                  
           
            //comments?

        });
        creator.photos = jsonString
                
        creator.save().then(result => {   
        
            return res.jsonOK(result, getMessage("creator.save.success"), new_token)
        
                              
                        
        }).catch(err => {
            console.log(err)
            Object.keys(req.files).forEach((i) => {
                let file = req.files[i];   
                fs.unlinkSync('uploads/' + "creators/" + type + "/" + name + "/" + file.filename)    
               
            });
            return res.jsonServerError(null, null, err)
        
        });
               
    },

    async index(req, res){
        const { creator_id } = req.query;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null

        if (creator){        
           const creator = await Creator.findById(creator_id).exec();
           return res.jsonOK(creator, getMessage("creator.index.success"), new_token)
        }      

        else{            
            return res.jsonBadRequest(null,null, null)
        }
                        

    },

    async list(req, res){
        const { type, name } = req.query;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null

       

        let docs = [];

        if (type){
            if(name){
                (await Creator.find({name: name, type: type}).sort('updatedAt')).forEach(function (doc){
                    docs.push(doc)
                });
            } else{
                (await Creator.find({type: type}).sort('updatedAt')).forEach(function (doc){
                    docs.push(doc)
                });
            }
           
        } else if (name){
            (await Creator.find({name: name}).sort('updatedAt')).forEach(function (doc){
                docs.push(doc)
            });
        } else{
            (await Creator.find().sort('updatedAt')).forEach(function (doc){
                docs.push(doc)
            });
        }  
                
        
               
        if (docs.length === 0){
            return res.jsonNotFound(docs, getMessage("creator.list.empty"), new_token)
        } else{
           
            return res.jsonOK(docs, getMessage("creator.list.success") + docs.length, new_token)
        }
                        
    },

    async update(req, res){
        const { type, name, birthDate, socialMedia, deathDate, biography, creator_id } = req.body;
        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null

        if(!creator_id){           
            return res.jsonBadRequest(null, getMessage("creator.error.creator_id"), null)
        
        } else{
            const creator = await Creator.findById(creator_id);

            if(creator){
                
                if(type){
                    creator.type = type;
                }
                else if(birthDate){
                    creator.birthDate = birthDate;
                }
                else if(name){
                    creator.name = name;
                }
                else if(deathDate){
                    creator.deathDate = deathDate;
                }                   
                
                else if(biography){
                    creator.biography = biography;
                }

                else if(socialMedia){
                    creator.socialMedia = socialMedia;
                }
               

                creator.updatedAt = Date.now()
                let changes = creator.getChanges()
                creator.save().then(answer => {  
                    return res.jsonOK(changes, getMessage("creator.update.success"), new_token)

                }).catch(err => {
                    return res.jsonServerError(null, null, err)
                })
                
                        
    
            } else{
                return res.jsonNotFound(null, getMessage("creator.notfound"), new_token)
               
            }                       
        }     
    },

    async delete(req, res){
        const { creator_id } = req.query;            
        const creator = await Creator.findById(creator_id);

        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null
        
      

        if(creator){           
                        
         
            Creator.deleteOne({ _id: creator_id }).then(answer => {
                let mangas = []
                creator.works.forEach(manga_id => {
                    Manga.findById(manga_id).then(manga => {
                        manga[creator.type] =  manga[creator.type].filter(function (crt_id){
                        
                            return crt_id.toString() !== creator_id.toString()
                              
                        });
                        manga.save().then(answer => {  
                            let dir = 'uploads/' + "creators/" + creator.type + "/" + creator.name + "/" 

                            creator.photos.forEach((file) => {
                                let file = req.files[i];   
                                fs.unlinkSync(dir + file.filename)    
                            
                            });
            
                            fs.rmdir(dir, { recursive: true }, (err) => {
                                if(err){
                                    console.log(err)
                                }
                                                
                                
                            });
                
                            fs.rmdirSync(dir, {recursive: true})

                            mangas.push({'creator-deleted': manga_id})
                            
                        }).catch(err => {
                            mangas.push({'creator-not-deleted': manga_id})
                        })

                    }).catch(err =>{
                        mangas.push({'manga-not-found': manga_id})
                    })
                })
                return res.jsonOK({ removed: true, mangas: mangas }, getMessage("creator.delete.success"), new_token)

            }).catch(err=>{
                return res.jsonBadRequest(null, getMessage("creator.notfound"), new_token)
            })
                         
            
        } else {
            return res.jsonServerError(null, null, new_token)
        }

       
    
        
    }
}