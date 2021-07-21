const multer = require('multer');
const fs = require('fs');

const multerConfig = require('../config/multer')

const upload1 = multer(multerConfig.file).single('cover')
const upload2 = multer(multerConfig.files).array('imgCollection')
const upload3 = multer(multerConfig.artistFiles).array('photos')
const upload4 = multer(multerConfig.writerFiles).array('photos')

module.exports = {
    
    upload_single(req, res){
        upload1(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.                
                return res.jsonBadRequest(null, null, err)
                
            } else if (err) {
                // An unknown error occurred when uploading.                 
                return res.jsonBadRequest(null, null, err)
                
            } 
            // Everything went fine.
            next()
            
        })
    },

    upload_many_manga(req, res, next){        
        upload2(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.                
                return res.jsonBadRequest(null, null, err)
                
            } else if (err) {
                // An unknown error occurred when uploading.                 
                return res.jsonBadRequest(null, null, err)
                
            } 
            // Everything went fine.
            next()
            
        })
    },
    
    upload_many_artist(req, res, next){ 
        let dir = "./" + "uploads/" + "authors/" 
       
        if (!fs.existsSync(dir))       
          fs.mkdirSync(dir);
        dir = dir + "artist" + "/"

        if (!fs.existsSync(dir))       
            fs.mkdirSync(dir);      
        
        upload3(req, res, function (err) {
             
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading. 
                console.log("if")                  
                return res.jsonBadRequest(null, null, err)
                
            } else if (err) {
                // An unknown error occurred when uploading.          
                console.log("else")          
                return res.jsonBadRequest(null, null, err)
                
            } 
            // Everything went fine.
            next()
            
        })
    },

    upload_many_writer(req, res, next){ 
        let dir = "./" + "uploads/" + "authors/" 
       
        if (!fs.existsSync(dir))       
          fs.mkdirSync(dir);
        dir = dir + "writer" + "/"

        if (!fs.existsSync(dir))       
            fs.mkdirSync(dir);      
        
        upload4(req, res, function (err) {
             
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading. 
                console.log("if")                  
                return res.jsonBadRequest(null, null, err)
                
            } else if (err) {
                // An unknown error occurred when uploading.          
                console.log("else")          
                return res.jsonBadRequest(null, null, err)
                
            } 
            // Everything went fine.
            next()
            
        })
    },

   
  
}