const mongoose = require('mongoose');
const upload = require("../config/upload");
const fs = require('fs');

const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga');
const response = require("../common/response");

const { dirname } = require('path');
const { listenerCount } = require('../models/Chapter');


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
                response.jsonNotFound(null, response.getMessage("user.error.notfound"), err.message)              
            ) 
          */
        

        Manga.findOne({_id: manga_id}, function (err, manga){ 
            if(manga){          
                console.log("here")
               
                let jsonString = [];         
                
                Object.keys(req.files).forEach((i) => {
                    let file = req.files[i];

                    let temp = { originalname:  file.originalname,
                                size: file.size,
                                filename: file.filename,
                                url: "http://localhost:3333/files/" + file.filename,
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
                    manga.data.push(result._id) 
                    manga.save().then(answer => {

                    }).catch(err =>{
                        Chapter.deleteOne({_id: result._id});
                        Object.keys(req.files).forEach((i) => {
                            let file = req.files[i];   
                            fs.unlinkSync('uploads/' + file.filename)    
                            
                        });
                        console.log(err)

                        return res.json(
                            response.jsonServerError(null, null, err)
                        )
                    });
                    return res.json(
                        response.jsonOK(result, "Upload Done!", null)
                    )   

                 
                
                }).catch(err => {
                    Object.keys(req.files).forEach((i) => {
                        let file = req.files[i];   
                        fs.unlinkSync('uploads/' + file.filename)    
                        
                    });
                    console.log(err)
                    return res.json(
                        response.jsonServerError(null, null, err)
                    );
                });

            } else{

                Object.keys(req.files).forEach((i) => {
                    let file = req.files[i];
                    fs.unlinkSync('uploads/' + file.filename)
                    
                });
                return res.json(
                    response.jsonNotFound(null, "Manga could not be found", err)
                )
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
                    return res.json(
                        response.jsonNotFound(null, null, err)
                    )
                } 

                return res.json(
                    response.jsonOK(update, "Succesfully saved.", null)
                ) 
               
            });


        } else{
            return res.json(
                response.jsonBadRequest(null, response.getMessage("badRequest"), null) 
            )
            
         
        }        
    },

   
    async index(req, res){

        const { manga_id, number, chapter_id } = req.query;
       
        let docs = [];

        if (number){
            Chapter.find({ manga_id: manga_id, number: number }).then(result=>{
                result.forEach(doc =>{
                    docs.push(doc)
                })
              
                            
            }).catch(err =>{
                return res.json(
                    response.jsonBadRequest(err, response.getMessage("badRequest"), null) 
                )
            })
        }

        else if (chapter_id){
            Chapter.findById(chapter_id).then(doc=>{
                docs.push(doc)             
            }).catch(err =>{
                return res.json(
                    response.jsonBadRequest(err, response.getMessage("badRequest"), null) 
                )
            })
  
        }
          
        else{
            return res.json(
                response.jsonBadRequest(null, response.getMessage("badRequest"), null) 
            )
        }
        return res.json(
            response.jsonOK(docs, "Page list retrieved successfully!", null)
        );
       
    },

    async delete(req, res){

        const { manga_id, chapter_id } = req.query;

        Chapter.findById(chapter_id).then( chapter => {

            chapter.imgCollection.forEach(function (file){
                fs.unlinkSync('uploads/' + file.filename)   
            });


            Chapter.deleteMany( { manga_id: manga_id, _id: chapter_id }).then(chapters =>{
                if (chapters.n === 0 ){//chapter could not be found
                    return res.json(
                        response.jsonBadRequest({removed: false}, null, null) 
                    )
                    
                } else{
        
                    cloneData = []
        
                    Manga.findOne({ _id: manga_id }, function (err, manga){ 
                        if(manga){
                            cloneData = [...manga.data];
                            let index = 0;
                            manga.data.forEach(function (pos, i){
                                if(pos === chapter_id){
                                    console.log("here")
                                    index = i;
                                    return;
                                }
                                  
                            })
                            cloneData.slice(index, 1);
        
                           
                        } else{
                            console.log("error")
                            response.jsonBadRequest({removed: false}, null, null) 
                        }
                       
                       
                    });
                           
        
                    Manga.updateOne({ _id: manga_id }, { data: cloneData }).then(result => {

                        if (result.n === 0){
                            return res.json(
                                response.jsonServerError({Mangas_matched: result.n}, null, null)
                            )
                        } else{
                            return res.json(
                                response.jsonOK({ removed: true, chapters: chapters }, "Chapters deleted.", null)
                            );
                        }

                       
                    }).catch(err =>{
                        return res.json(
                            response.jsonServerError(err, null, null)
                        )
                    });                    
        
                }
            }).catch(err=>{
                return res.json(
                    response.jsonBadRequest(err, null, null)
                )
            });                    

        }).catch(err=>{
            return res.json(
                response.jsonBadRequest(err, null, null)
            )
        });
        
        

        
    }
}

