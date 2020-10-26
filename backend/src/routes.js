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

routes.get('/manga/index', MangaController.index);

routes.put('/manga/update', MangaController.update);

routes.delete('/manga/delete', MangaController.delete);



routes.post('/chapter/post', multer(multerConfig).array('imgCollection'), ChapterController.store);

routes.get('/chapter/index', (req, res) => {
    ChapterController.index();
   
})

routes.put('/chapter/update',  ChapterController.update);

routes.delete('/chapter/delete', ChapterController.delete);

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