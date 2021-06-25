
const path = require("path");
const multer = require("multer");
const crypto = require('crypto');
const fs = require('fs');

const folder = "uploads/"


const files = {
  
  storage: multer.diskStorage({
    destination: (req, files, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', folder, req.body.manga_title + "/", req.body.number));

      let dir = "./" + folder + req.body.manga_title + "/"


      if (!fs.existsSync(dir))       
        fs.mkdirSync(dir);

      if (!fs.existsSync(dir + req.body.number))       
        fs.mkdirSync(dir + req.body.number);
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        
       
          var filename = `${hash.toString('hex')}-${file.originalname}`
        
         
          
          cb(null, filename)



      });
      
    },

  }),
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)){
      
      cb(null, true)
    } else{
      var message = `${file.originalname} is invalid. Only accept png/jpeg/jpg.`;
      cb(new Error(message));
    } 
  }

}

const file = {
  
  storage: multer.diskStorage({
    destination: (req, files, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', folder, req.body.manga_title + "/", req.body.number));

      let dir = "./" + folder + req.body.manga_title + "/"
      if (!fs.existsSync(dir))       
        fs.mkdirSync(dir);
    
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        
          var filename = `${hash.toString('hex')}-${file.originalname}`
        
         
          
          cb(null, filename)



      });
      
    },

  }),
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)){
      
      cb(null, true)
    } else{
      var message = `${file.originalname} is invalid. Only accept png/jpeg/jpg.`;
      cb(new Error(message));
    } 
  }

}


module.exports = {
  file, files
}