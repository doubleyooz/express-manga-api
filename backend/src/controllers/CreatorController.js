const fs = require('fs');
const CryptoJs = require("crypto-js");

const { getMessage } = require("../common/messages")


const Chapter = require('../models/Chapter');
const Creator = require('../models/Creator');
const User = require('../models/user');





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
        const { manga_id } = req.query;            
        const manga = await Manga.findById(manga_id);

        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null
        
      
        const scan_id =  CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))
        req.auth = null

        if(manga){           
            if(manga.scan_id.toString() === scan_id){              
                const mangas = await Manga.deleteMany({ _id: manga_id });        
                //console.log(mangas)
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
                

                /*(await Chapter.find({manga_id: manga_id})).forEach(function (doc){
                    doc.imgCollection.forEach(function (page){                            
                        fs.unlinkSync('uploads/' + manga.title + "/"+ page.filename)  
                    })                      
                });
                */
                const chapters = await Chapter.deleteMany({ manga_id: manga_id})
                
                
                let dir = 'uploads/' + manga.title

                
                fs.rmdir(dir, { recursive: true }, (err) => {
                    if(err){
                        console.log(err)
                    }
                                    
                    
                });

                fs.rmdirSync(dir, {recursive: true})
                
              
                return res.jsonOK(
                        {"mangas affected": mangas.deletedCount, "chapters affected": chapters.deletedCount},
                            null,
                            new_token
                                            
                );
                
            } 

            return res.jsonUnauthorized(null, null, null)
            
        } 

        return res.jsonBadRequest(null, getMessage("manga.notfound"), new_token)
    
        
    }
}