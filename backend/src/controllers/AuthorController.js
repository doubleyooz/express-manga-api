const fs = require('fs');
const parseISO = require('date-fns/parseISO')
const { getMessage } = require("../common/messages")


const Chapter = require('../models/Chapter');
const Author = require('../models/Author');
const User = require('../models/user');
const Manga = require('../models/Manga');





module.exports = {
    async store(req, res){ 
        
        const {type, name, birthDate, socialMedia, deathDate, biography } = req.body;
        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null
       
        const storedAuthor = await Author.findOne({name: name})

        if(storedAuthor !== null){
            if(storedAuthor.type === type){
                Object.keys(req.files).forEach((i) => {
                    let file = req.files[i];   
                    fs.unlinkSync('uploads/' + "authors/" + type + "/" + name + "/" + file.filename)    
                   
                });
                              
                return res.jsonBadRequest(null, getMessage("author.error.duplicate"), new_token)
            } else {
                
                console.log('else')
               
                storedAuthor.type.push(type)
                storedAuthor.save().then(result=>{
                    return res.jsonOK(result, getMessage("author.save.success"), new_token)
        
                }).catch(err=>{
                    console.log(err)
                    Object.keys(req.files).forEach((i) => {
                        let file = req.files[i];   
                        fs.unlinkSync('uploads/' + "authors/" + type + "/" + name + "/" + file.filename)    
                    
                    });
                    return res.jsonServerError(null, null, err)
                })
            }
        }

                
        req.auth = null
    
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

        const author = new Author({
            photos: [],
            type: [type],
            name: name,
            birthDate: parseISO(birthDate),
            deathDate: parseISO(deathDate),
            socialMedia: socialMedia,    
            biography: biography              
           
            //comments?

        });
        author.photos = jsonString
                
        author.save().then(result => {   
        
            return res.jsonOK(result, getMessage("author.save.success"), new_token)
        
                                                    
        }).catch(err => {
            console.log(err)
            Object.keys(req.files).forEach((i) => {
                let file = req.files[i];   
                fs.unlinkSync('uploads/' + "authors/" + type + "/" + name + "/" + file.filename)    
               
            });
            return res.jsonServerError(null, null, err)
        
        });
               
    },

    async index(req, res){
        const { author_id } = req.query;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null

        if (author){        
           const author = await Author.findById(author_id).exec();
           return res.jsonOK(author, getMessage("author.index.success"), new_token)
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
                (await Author.find({name: name, type: type}).sort('updatedAt')).forEach(function (doc){
                    docs.push(doc)
                });
            } else{
                (await Author.find({type: type}).sort('updatedAt')).forEach(function (doc){
                    docs.push(doc)
                });
            }
           
        } else if (name){
            (await Author.find({name: name}).sort('updatedAt')).forEach(function (doc){
                docs.push(doc)
            });
        } else{
            (await Author.find().sort('updatedAt')).forEach(function (doc){
                docs.push(doc)
            });
        }  
                
        
               
        if (docs.length === 0){
            return res.jsonNotFound(docs, getMessage("author.list.empty"), new_token)
        } else{
           
            return res.jsonOK(docs, getMessage("author.list.success") + docs.length, new_token)
        }
                        
    },

    async update(req, res){
        const { type, name, birthDate, socialMedia, deathDate, biography, author_id } = req.body;
        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null

        if(!author_id){           
            return res.jsonBadRequest(null, getMessage("author.error.author_id"), null)
        
        } else{
            const author = await Author.findById(author_id);

            if(author){
                
                if(type){
                    author.type = type;
                }
                else if(birthDate){
                    author.birthDate = birthDate;
                }
                else if(name){
                    author.name = name;
                }
                else if(deathDate){
                    author.deathDate = deathDate;
                }                   
                
                else if(biography){
                    author.biography = biography;
                }

                else if(socialMedia){
                    author.socialMedia = socialMedia;
                }
               

                author.updatedAt = Date.now()
                let changes = author.getChanges()
                author.save().then(answer => {  
                    return res.jsonOK(changes, getMessage("author.update.success"), new_token)

                }).catch(err => {
                    return res.jsonServerError(null, null, err)
                })
                
                        
    
            } else{
                return res.jsonNotFound(null, getMessage("author.notfound"), new_token)
               
            }                       
        }     
    },

    async delete(req, res){
        const { author_id } = req.query;            
        const author = await Author.findById(author_id);

        const new_token = (req.new_token) ? req.new_token : null;
        req.new_token = null
        
      

        if(author){           
                        
         
            Author.deleteOne({ _id: author_id }).then(answer => {
                let mangas = []
                author.works.forEach(manga_id => {
                    Manga.findById(manga_id).then(manga => {
                        manga[author.type] =  manga[author.type].filter(function (crt_id){
                        
                            return crt_id.toString() !== author_id.toString()
                              
                        });
                        manga.save().then(answer => {  
                            let dir = 'uploads/' + "authors/" + author.type + "/" + author.name + "/" 

                            author.photos.forEach((file) => {                               
                                fs.unlinkSync(dir + file.filename)    
                            
                            });
            
                            fs.rmdir(dir, { recursive: true }, (err) => {
                                if(err){
                                    console.log(err)
                                }
                                                
                                
                            });
                
                            fs.rmdirSync(dir, {recursive: true})

                            mangas.push({'author-deleted': manga_id})
                            
                        }).catch(err => {
                            mangas.push({'author-not-deleted': manga_id})
                        })

                    }).catch(err =>{
                        mangas.push({'manga-not-found': manga_id})
                    })
                })
                return res.jsonOK({ removed: true, mangas: mangas }, getMessage("author.delete.success"), new_token)

            }).catch(err=>{
                return res.jsonBadRequest(null, getMessage("author.notfound"), new_token)
            })
                         
            
        } else {
            return res.jsonServerError(null, null, new_token)
        }

       
    
        
    }
}