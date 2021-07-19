const fs = require('fs');
const CryptoJs = require("crypto-js");

const { getMessage } = require("../common/messages")


const Chapter = require('../models/Chapter');
const Creator = require('../models/Creator');
const User = require('../models/user');





module.exports = {
    async store(req, res){ 
        const {type, name, birthDate, socialMedia, deathDate } = req.body;
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

        let role;

        if (req.role){
            role = CryptoJs.AES.decrypt(req.role, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))            
            req.role = null
        }else{
            role = 0;
        }


        if (creator){        
           const creator = await Creator.findById(creator_id).exec();
           return res.jsonOK(creator, getMessage("creator.index.success"), new_token)
        }      

        else{            
            return res.jsonBadRequest(null,null, null)
        }
                        

    },

    async list(req, res){
        const { type, name, title, recent } = req.query;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null

        let role;

        if (req.role){
            role = CryptoJs.AES.decrypt(req.role, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))            
            req.role = null
        }else{
            role = 0;
        }

        let docs = [];

        if (genre){
            (await Manga.find({genre: genre}).sort('updatedAt').select(list_projection[role])).forEach(function (doc){
                docs.push(doc)
            });
        }

        else if(scan){
            (await User.find({name: scan, role: "Scan"}).select(list_projection[role])).forEach(function (result){
                Manga.find({scan_id: result._id}).sort('updatedAt').then(doc => {   
                    docs.push(doc)
                });
            })
            
        }

        else if (title){
            (await Manga.find( {title: {$regex: title, $options: "i"} } ).sort('updatedAt').select(list_projection[role])).forEach(function (doc){
                docs.push(doc)
            });
        }

        else if (recent){
            
            const mangas = await Manga.find().sort('updatedAt').select({cover: 1, title: 1, updatedAt: 1})
                     
            for (let index = 0; index < mangas.length; index++) {
                let temp = {
                   
                    _id: mangas[index]._id,
                    cover: mangas[index].cover,
                    title: mangas[index].title,
                    updatedAt: mangas[index].updatedAt,
                    chapters: [],
                    
                }

            
                
                const chapters = await Chapter.find({manga_id: mangas[index]._id}).sort('updatedAt').select({number: 1, _id: 0})
                
                if(chapters.length !== 0){
                    
                    chapters.forEach(function (chap){                               
                        temp.chapters.push({number: chap.number})
                        
                    }) 
                    
                    docs.push(temp)
                    
                }
                
            }
            
            console.log(docs) 
                    
        } else{
            (await Manga.find().sort('updatedAt').select(list_projection[role])).forEach(function (doc){
                docs.push(doc)
            });
        }  
                
        
               
        if (docs.length === 0){
            return res.jsonNotFound(docs, getMessage("manga.list.empty"), new_token)
        } else{
            docs.forEach(function(doc){
                doc.user = undefined
    
            });
            return res.jsonOK(docs, getMessage("manga.list.success") + docs.length, new_token)
        }
                        
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