const express = require('express');
const multer = require('multer');
const multerConfig = require('./config/upload')

const UploadController = require("./controllers/UploadController");
const ChapterController = require('./controllers/ChapterController');



const routes = express.Router()


routes.get('/', (req, res) => {
    return res.json({ message: "Hello World"});

});

routes.post('/post', multer(multerConfig).array('imgCollection'), async (req, res, next) => {
    //console.log(req.files);
    ChapterController.store;

    return res.json({ message: "Post page"});
    
});

routes.get('/get', (req, res, next) => {
    ChapterController.index
})

/*
routes.post('/sessions', function(req, res){
    SessionController.store
  });
routes.get('/sessions/login', SessionController.show);


routes.get('/tools/get', (req, res) => {
    return res.json({ message: "Hello World"});
});

routes.post('/tools/add', upload.single('icon'), ToolController.store);

*/




module.exports = routes;