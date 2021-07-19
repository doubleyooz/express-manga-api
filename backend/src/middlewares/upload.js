const multer = require('multer');

const multerConfig = require('../config/multer')

const upload1 = multer(multerConfig.file).single('cover')
const upload2 = multer(multerConfig.files).array('imgCollection')
const upload2 = multer(multerConfig.creatorFiles).array('imgCollection')


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

    upload_many(req, res, next){        
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

    upload_many_2(req, res, next){        
        upload3(req, res, function (err) {
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


    track_progress(req, res, next){
        let progress = 0;
        let fileSize = req.headers['content-length'] ? parseInt(req.headers['content-length']) : 0;

        // set event listener

        req.on('data', (chunk) => {        
            progress += chunk.length;
            //res.write((`${Math.floor((progress * 100) / fileSize)} `));
            if (progress === fileSize) {
                console.log('Finished', progress, fileSize)
            } else {
                console.log(`Sending ${Math.floor((progress * 100) / fileSize)}% `)
            }
        });

        // invoke next middleware
        next();
    }
}