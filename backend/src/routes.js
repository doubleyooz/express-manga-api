const express = require('express');
const multer = require('multer');
const multerConfig = require('./config/upload')

const UploadController = require("./controllers/UploadController");
const ChapterController = require('./controllers/ChapterController');
const MangaController = require('./controllers/MangaController');


const routes = express.Router()


routes.get('/', (req, res) => {
    return res.json({ message: "Hello World"});

});


routes.post('/manga/post', MangaController.store);

routes.post('/chapter/post', multer(multerConfig).array('imgCollection'), ChapterController.store);


routes.get('/get', (req, res) => {
    ChapterController.index();
    return res.json({message: "Works"});
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