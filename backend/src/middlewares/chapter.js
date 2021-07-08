const yup = require('yup')
const mongoose = require('mongoose');
const fs = require('fs');

const Manga = require("../models/Manga")
const { getMessage } = require("../common/messages");

module.exports = {
    async valid_chapter_store(req, res, next){         
        const { manga_title, number, chapter_title } = req.body;     
        
       
        let schema = yup.object().shape({
            manga_title: yup.string("manga title must be a string.").strict()                
                .max(60, getMessage("manga.invalid.title.long")),
            chapter_title: yup.string("title must be a string.").strict()                
                .max(40, getMessage("chapter.invalid.title.long")),
            number: yup.number("Must to be a valid number").min(1, 'Must be a positive number').required(),
                               
        })

        
        try{
            await schema.validate({manga_title, chapter_title, number}).then(() => {
                if(req.files.length)
                    next()
                else
                    return res.jsonBadRequest(null, null, null)
            })
            .catch(function(e) {
                
                return res.jsonBadRequest(null, null, e)
                
            });

                  

        } catch(err){
            return res.jsonBadRequest(null, null, err)
            
        }
              
                        
    },

    async valid_chapter_index(req, res, next){
        const { chapter_id } = req.query; 

        let schema = yup.object().shape({          
            chapter_id: yup.string("genre must be a string.").strict().required(),
           

        })
        schema.validate({chapter_id}).then(() => {
            if (mongoose.Types.ObjectId.isValid(chapter_id)) {   
                if (String(new mongoose.Types.ObjectId(chapter_id)) === chapter_id) {  
                    next()
                } else{
                    return res.jsonBadRequest(
                        null,
                        getMessage("chapter.invalid.id"),
                        null
                    );
                }
            }   else{
                return res.jsonBadRequest(
                    null,
                    getMessage("chapter.invalid.id"),
                    null
                );
            }
        }).catch(err => {                    
            return res.jsonBadRequest(null, null, err.errors)
        })
            
    },

    async valid_chapter_list(req, res, next){
        const { manga_id } = req.query; 

        let schema = yup.object().shape({          
            manga_id: yup.string("genre must be a string.").strict(),
           

        })
        schema.validate({manga_id}).then(() => {
            if (mongoose.Types.ObjectId.isValid(manga_id)) {   
                if (String(new mongoose.Types.ObjectId(manga_id)) === manga_id) {  
                    next()
                } else{
                    return res.jsonBadRequest(
                        null,
                        getMessage("manga.invalid.id"),
                        null
                    );
                }
            }   else{
                return res.jsonBadRequest(
                    null,
                    getMessage("manga.invalid.id"),
                    null
                );
            }
        }).catch(err => {                    
            return res.jsonBadRequest(null, null, err.errors)
        })
            
       
    },


    async valid_chapter_delete(req, res, next){         
                       
        const { manga_id, chapter_id } = req.query;       
    
        console.log(manga_id)
        console.log(chapter_id)

        if (mongoose.Types.ObjectId.isValid(manga_id)) {   
            if (String(new mongoose.Types.ObjectId(manga_id)) === manga_id) {  
                if (mongoose.Types.ObjectId.isValid(chapter_id)) {   
                    if (String(new mongoose.Types.ObjectId(chapter_id)) === chapter_id){                        
                        next(); 
                    } 
                            
                        
                    else {
                        console.log("chapter id invalid string")
                        return res.jsonBadRequest(null, getMessage("chapter.invalid.id"), null); 
                    }                           
                        
                } else {
                    console.log("chapter id invalid object")
                    return res.jsonBadRequest(null, getMessage("chapter.invalid.id"), null);
                }               
                
                                        
            } else {
                console.log("manga id invalid string")
                return res.jsonBadRequest(null, getMessage("manga.invalid.id"), null);
            }
            
                                        
        } else{
            console.log("manga id invalid object")
            return res.jsonBadRequest(null, getMessage("manga.invalid.id"), null);
        }  
        
        
    
                    
    }  
}