const express = require('express');
const multer = require('multer');
const multerConfig = require('./config/upload')

const UserController = require("./controllers/UserController");
const ChapterController = require('./controllers/ChapterController');
const MangaController = require('./controllers/MangaController');

const MangaMiddleware = require('./middlewares/manga');


const routes = express.Router()


routes.get('/', (req, res) => {
    return res.jsonOK( null, "Hello World", null);

});

routes.post('/sign-up', UserController.store);
routes.post('/sign-in', UserController.auth);
routes.get('/user/index', UserController.index);
routes.delete('/user/delete', UserController.delete);


routes.post('/manga/post', MangaMiddleware.valid_manga_store, MangaController.store);

routes.get('/manga/index', MangaController.index);

routes.put('/manga/update', MangaController.update);

routes.delete('/manga/delete', MangaMiddleware.valid_manga_delete, MangaController.delete);



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