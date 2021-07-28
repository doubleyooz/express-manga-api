import yup from 'yup';
import mongoose from 'mongoose';

import { getMessage } from '../common/messages.js';


function isValidMongoId(object_id){
    try{
        if (mongoose.Types.ObjectId.isValid(object_id)) {   
            if (String(new mongoose.Types.ObjectId(object_id)) === object_id){
                return true;
            } else{
                return false;
            }
        } else{
            return false;
        }
    }catch(err){
        console.log(err)
        return false;
    }

}

async function valid_manga_store(req, res, next){         
                       
    const {writer_id, artist_id} = req.body
    
    console.log(title)
   
    let schema = yup.object().shape({
        title: yup.string("title must be a string.").strict().min(2, getMessage("manga.invalid.title.short")).max(60, getMessage("manga.invalid.title.long")).required(),
        genre: yup.string("genre must be a string.").strict().required(),
        writer_id: yup.string("must be a string").strict().required(),
        artist_id: yup.string("must be a string").strict().required(),
        synopsis: yup.string("synopsis must be a string.").strict().min(10, getMessage("manga.invalid.synopsis.short")).max(400, getMessage("manga.invalid.synopsis.long")).required(),
        n_chapters: yup.number("chapters must be a number.").min(1, 'There must be at least one chapter.').required(),
        status: yup.number("status must be a number.").min(1, getMessage("manga.invalid.code")).max(6, getMessage("manga.invalid.code")).required(),
        nsfw: yup.string("nsfw must be a string.").strict().matches(/(true|false)/, null).required(),
        language: yup.string("language must be a string.").strict().matches(/(pt-br|en-us|en-uk)/, null).default({ language: 'pt-br' }).required(),
       
    })

   

    schema.validate(req.body).then(() => {
        valid_language = true;

        valid_genre = true;

        if (valid_language && valid_genre && req.file){
            
                if(isValidMongoId(writer_id)){
                    if(isValidMongoId(artist_id)){
                        req.nsfw = (nsfw === "true")
                        next(); 
                    } else{
                        return res.jsonBadRequest(null, null, null)
                    }
                } else{
                    return res.jsonBadRequest(null, null, null)
                }
        
        } else{
            return res.jsonBadRequest(null, null, null)
            
        }
    })
    .catch(function(e) {
        console.log(e)
        return res.jsonBadRequest(null, null, e)
        
    });
    
    


          
                    
}

async function valid_manga_index(req, res, next){
    const {manga_id, title} = req.query

    let schema = yup.object().shape({
        title: yup.string("title must be a string.").when(["manga_id"], {
            is: (manga_id) => !manga_id,
            then: yup.string().required()
        }),
        manga_id: yup.string("manga_id must be a string.").when(["title"], {
            is: (title) => !title,
            then: yup.string().required()
        }),

    })
           

    try{
        schema.validate(req.query).then(() => {
            if(manga_id){
                if(isValidMongoId(manga_id)){
                    next();  
                } else{
                    return res.jsonBadRequest(
                        null,
                        getMessage("manga.invalid.id"),
                        null);
                }
               
            } else {
                
                next();
                
            }
        
        })
        .catch((err) => {
            return res.jsonBadRequest(null, null, err.errors)              
           
       })
       

    } catch(err){
        return res.jsonBadRequest(null, null, err.errors)
    }
   
}

async function valid_manga_list(req, res, next){        
    let schema = yup.object().shape({
        title: yup.string("title must be a string.").strict(),
        genre: yup.string("genre must be a string.").strict(),
        scan: yup.string("scan must be a string.").strict(),
        recent: yup.boolean()

    })
           

    try{
        schema.validate(req.query).then(() => {                                             
            next();    
                    
        })
        .catch((err) => {
            return res.jsonBadRequest(null, null, err.errors)              
           
       })
       

    } catch(err){
        return res.jsonBadRequest(null, null, err.errors)
    }
   
}

async function valid_manga_update(req, res, next){        
    let schema = yup.object().shape({
        title: yup.string("title must be a string.").strict().min(2, getMessage("manga.invalid.title.short")).max(60, getMessage("manga.invalid.title.long")),
        genre: yup.string("genre must be a string.").strict(),
        writer_id: yup.string("must be a string").strict(),
        artist_id: yup.string("must be a string").strict(),
        synopsis: yup.string("synopsis must be a string.").strict().min(10, getMessage("manga.invalid.synopsis.short")).max(400, getMessage("manga.invalid.synopsis.long")),
        n_chapters: yup.number("chapters must be a number.").min(1, 'There must be at least one chapter.'),
        status: yup.number("status must be a number.").min(1, getMessage("manga.invalid.code")).max(6, getMessage("manga.invalid.code")),
        nsfw: yup.string("nsfw must be a string.").strict().matches(/(true|false)/, null),
        language: yup.string("language must be a string.").strict().matches(/(pt-br|en-us|en-uk)/, null).default({ language: 'pt-br' }),
        manga_id: yup.string("must be a string").strict().required(),
    })
           

    try{
        schema.validate(req.body).then(() => {             
            if(isValidMongoId(manga_id)){
                next();                                             
            }
            else{
                return res.jsonBadRequest(
                    null,
                    getMessage("manga.invalid.id"),
                    null);
            }                                
        })
        .catch((err) => {
            return res.jsonBadRequest(null, null, err.errors)              
           
       })
       

    } catch(err){
        return res.jsonBadRequest(null, null, err.errors)
    }
   
}

async function valid_manga_remove(req, res, next){        
    const { manga_id } = req.query;       

    if (mongoose.Types.ObjectId.isValid(manga_id)) {   
        if (String(new mongoose.Types.ObjectId(manga_id)) === manga_id) {  
            next();     
        } else { 

            return res.jsonBadRequest(
                    null,
                    getMessage("manga.invalid.id"),
                    null);
           
        } 
    } else {
        return res.jsonBadRequest(
                null,
                getMessage("manga.invalid.id"),
                null);         
    }                     
}  

export default {
    valid_manga_store,
    valid_manga_index,
    valid_manga_list, 
    valid_manga_update,
    valid_manga_remove
}