const mongoose = require('mongoose');
const upload = require("../config/upload");
const fs = require('fs');

const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga');

const { getMessage } = require("../common/messages")

const projection = {
    0 : {
        title: 1,
        number: 1,
        imgCollection: 1,
    },
    1 : {
        updatedAt: 1,
        createdAt: 1,
        title: 1,
        number: 1,
        imgCollection: 1,
        __v: 1
        
    },
    2 : { 
       
        title: 1,
        number: 1,
        imgCollection: 1
        
         
    }
}

module.exports = {
    async store(req, res){            
        const { manga_id, number, title } = req.body;

        console.log("here - 0")
           /*
            
            Object.keys(req.files).forEach((i) => {
                let file = req.files[i];                                                    
                fs.unlinkSync('uploads/' + file.filename)              
                
            });
            return res.json(        
                jsonNotFound(null, getMessage("user.error.notfound"), err.message)              
            ) 
          */
        

        Manga.findOne({_id: manga_id}, function (err, manga){ 
            if(manga){          
                console.log("here")
               
                let jsonString = [];         
                
                Object.keys(req.files).forEach((i) => {
                    let file = req.files[i];
                    console.log(i)
                    let temp = { 
                        originalname:  file.originalname,
                        size: file.size,
                        filename: file.filename,
                                
                    }                            
                
                    jsonString.push(JSON.parse(JSON.stringify(temp)));
                    
                });

                console.log(jsonString);

                const chapter = new Chapter({                    
                    manga_id: manga_id,
                    number: number,
                    title: title,
                    imgCollection: [
                            
                    ],
                });

                chapter.imgCollection = jsonString;
            
                

                chapter.save().then(result => {
                    manga.chapters.push(result._id) 
                    manga.save().then(answer => {

                    }).catch(err =>{
                        Chapter.deleteOne({_id: result._id});
                        Object.keys(req.files).forEach((i) => {
                            let file = req.files[i];   
                            fs.unlinkSync('uploads/' + file.filename)    
                            
                        });
                        console.log(err)

                        return res.jsonServerError(null, null, err)
                        
                    });
                    return res.jsonOK(result, getMessage("chapter.upload.success"), null)
                    
                
                }).catch(err => {
                    Object.keys(req.files).forEach((i) => {
                        let file = req.files[i];   
                        fs.unlinkSync('uploads/' + file.filename)    
                        
                    });
                    console.log(err)
                    return res.jsonServerError(null, null, err)
            
                });

            } else{

                Object.keys(req.files).forEach((i) => {
                    let file = req.files[i];
                    fs.unlinkSync('uploads/' + file.filename)
                    
                });
                return res.jsonNotFound(null, getMessage("manga.notfound"), err)                
            }
        });         
    },


    async update(req, res){        

        const { title, number, chapter_id } = req.body;

        let update = {};

        if(!(title === undefined)){
            update.title = title;
        }      
        
        if(!(number === undefined)){
            update.number = number;
        }

        if(!(chapter_id === undefined)){
            Chapter.findOneAndUpdate({_id: chapter_id}, update, {upsert: true}, function(err, doc) {
                if (err){
                    return res.jsonNotFound(null, null, err)
        
                } 

                return res.jsonOK(update, getMessage("chapter.update.success"), null)
                
               
            });

        } else{
            return res.jsonBadRequest(null, null, null) 
        
         
        }        
    },

   
    async index(req, res){

        const { manga_id, number, chapter_id } = req.query;

        let role;

        if (req.auth){
            let temp = CryptoJs.AES.decrypt(req.auth, `${process.env.SHUFFLE_SECRET}`).toString((CryptoJs.enc.Utf8))
            role = temp.slice(0, 1);
            temp = null;
            req.auth = null
        }else{
            role = 0;
        }
       
       
        
                 
       
        let docs = [], promises = []
       
        if (number){
            promises.push(
                Chapter.find({ manga_id: manga_id, number: number }).select(projection[role]).then(result=>{
                    result.forEach(doc =>{
                        docs.push(doc)
                        
                })
                                
                                
                }).catch(err =>{
                    return res.jsonBadRequest(err, null, null) 
        
                })
            )
            
        }     

        else if (chapter_id){
            promises.push(
                Chapter.findById(chapter_id).select(projection[role]).then(doc=>{
                    docs.push(doc)             
                }).catch(err =>{
                    return res.jsonBadRequest(err, null, null) 
        
                })
            )
  
        }

        else if (manga_id){
            promises.push(
                Chapter.find({ manga_id: manga_id}).select(projection[role]).then(result=>{
                    result.forEach(doc =>{
                        docs.push(doc)
                        
                })
                                
                                
                }).catch(err =>{
                    return res.jsonBadRequest(err, null, null) 
        
                })
            )
        }
          
        else{
            return res.jsonBadRequest(null, null, null) 

        }

        Promise.all(promises).then(() => {            
            return res.jsonOK(docs, getMessage("chapter.list.success"), null)            
        });
        
       
    },

    async delete(req, res){

        const { manga_id, chapter_id } = req.query;

        Chapter.findById(chapter_id).then( chapter => {

            chapter.imgCollection.forEach(function (file){
                fs.unlinkSync('uploads/' + file.filename)   
            });

            Chapter.deleteMany( { manga_id: manga_id, _id: chapter_id }).then(chapters =>{
                if (chapters.n === 0 ){//chapter could not be found
                    return res.jsonBadRequest({removed: false}, null, null) 
                    
                } else{
        
                    cloneData = []
        
                    Manga.findOne({ _id: manga_id }, function (err, manga){ 
                        if(manga){
                            cloneData = [...manga.chapters];
                            let index = 0;
                            manga.chapters.forEach(function (pos, i){
                                if(pos === chapter_id){
                                    
                                    index = i;
                                    return;
                                }
                                  
                            })
                            cloneData.slice(index, 1);        
                           
                        } else{                           
                            
                            return res.jsonBadRequest({removed: false}, null, null) 
                        }                
                       
                    });
                           
        
                    Manga.updateOne({ _id: manga_id }, { data: cloneData }).then(result => {

                        if (result.n === 0){
                            return res.jsonServerError({Mangas_matched: result.n}, null, null)
                            
                        } else{
                            return res.jsonOK({ removed: true, chapters: chapters }, getMessage("chapter.delete.success"), null)
                            
                        }
                       
                    }).catch(err =>{
                        return res.jsonServerError(err, null, null)
                        
                    });    
                }
            }).catch(err=>{
                return res.jsonBadRequest(err, null, null)                
            });                    

        }).catch(err=>{
            return res.jsonBadRequest(err, null, null)
            
        });                
    }
}