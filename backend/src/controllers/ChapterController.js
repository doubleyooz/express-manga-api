const mongoose = require('mongoose');
const fs = require('fs');
const CryptoJs = require("crypto-js");

const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga');
const Page = require('../models/Page');

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
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null
        

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
                            fs.unlinkSync('uploads/' + manga_id + "/" + number + file.filename)    
                            
                        });
                        console.log(err)

                        return res.jsonServerError(null, null, err)
                        
                    });
                    return res.jsonOK(result, getMessage("chapter.upload.success"), new_token)
                    
                
                }).catch(err => {
                    Object.keys(req.files).forEach((i) => {
                        let file = req.files[i];   
                        fs.unlinkSync('uploads/' + manga_id + "/" + number + file.filename)    
                        
                    });
                    console.log(err)
                    return res.jsonServerError(null, null, err)
            
                });

            } else{

                Object.keys(req.files).forEach((i) => {
                    let file = req.files[i];
                    fs.unlinkSync('uploads/' + manga_id + "/" + number + file.filename)
                    
                });
                return res.jsonNotFound(null, getMessage("manga.notfound"), new_token)                
            }
        });         
    },


    async update(req, res){        

        const { title, number, chapter_id } = req.body;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null

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

                return res.jsonOK(update, getMessage("chapter.update.success"), new_token)
                               
            });

        } else{
            return res.jsonBadRequest(null, null, null) 
        
         
        }        
    },
   
    async index(req, res){

        const { manga_id, number, chapter_id } = req.query;
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
            return res.jsonOK(docs, getMessage("chapter.list.success"), new_token)            
        });
               
    },

    async delete(req, res){        
        const { manga_id, chapter_id } = req.query;
        const new_token = (req.new_token) ? req.new_token : null;       
        req.new_token = null

        Chapter.findById(chapter_id).then( chapter => {
            cloneData = []
            //get the deleted chapter index in order to exclude it from chapters array inside manga object
            Manga.findOne({ _id: manga_id }, function (err, manga){ 
                if(manga){
                   
                    cloneData = manga.chapters.filter(function (chap_id){
                        
                        return chap_id.toString() !== chapter_id.toString()
                          
                    })                    
                   
                    Chapter.deleteMany( { manga_id: manga_id, _id: chapter_id }).then(chapters =>{
                        console.log(chapters)
                        if (chapters.n === 0 ){//chapter could not be found
                            return res.jsonNotFound({removed: false}, getMessage("chapter.notfound"), new_token) 
                            
                        } else{
                            manga.chapters = cloneData
                            manga.save().then(result => {  
                                
                                try{                                         
                                    chapter.imgCollection.forEach(function (file){
                                        fs.unlinkSync('uploads/' + manga_id + "/" + chapter.number + "/" + file.filename)   
                                    });
                        
                                } catch(err) {
                                    return res.jsonServerError({ removed: true }, getMessage("chapter.delete.error"), null)
                                } 

                                return res.jsonOK({ removed: true, chapters: chapters }, getMessage("chapter.delete.success"), new_token)
                                          
                            }).catch(err => {
                                console.log(err)
                                return res.jsonServerError(null, null, err)
                            
                            });                
                        }
                    }).catch(err=>{
                        return res.jsonBadRequest(err, null, null)                
                    });                    
                } else{                       
                    return res.jsonNotFound({removed: false}, getMessage("manga.notfound"), new_token) 
                }                               
            });           

        }).catch(err=>{
            return res.jsonBadRequest(err, null, null)
            
        });                
    }
}