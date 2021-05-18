const express = require('express');
const multer = require('multer');
const multerConfig = require('./config/upload')

const UserController = require("./controllers/UserController");
const ChapterController = require('./controllers/ChapterController');
const MangaController = require('./controllers/MangaController');
const AuthController = require('./controllers/AuthController');

const MangaMiddleware = require('./middlewares/manga');
const UserMiddleware = require('./middlewares/user');
const AuthMiddleware = require('./middlewares/auth');
const response = require("./common/response");
const routes = express.Router()


routes.get('/', (req, res) => {
    return res.json(response.jsonOK( null, "Hello World", null));

});


routes.get('/me', AuthMiddleware.auth, (req, res) => {
    res.send(req.auth)
   
})

routes.post("/authentication/activate/:tky", AuthController.activateAccount);// POST
routes.put("/authentication/recover/:tky", AuthController.recoverPassword);// PUT

routes.post('/sign-up', UserMiddleware.valid_sign_up, UserController.store);
routes.get('/sign-in', UserMiddleware.valid_sign_in, AuthController.sign_in);
routes.get('/user/index', AuthMiddleware.auth, UserController.index);
routes.put('/user/update', AuthMiddleware.auth, UserController.update)
routes.delete('/user/delete', AuthMiddleware.auth, UserController.delete);


routes.post('/manga/post', AuthMiddleware.auth, MangaMiddleware.valid_manga_store, MangaController.store);
routes.get('/manga/index', AuthMiddleware.auth, MangaController.index);
routes.put('/manga/update', AuthMiddleware.auth, MangaController.update);
routes.delete('/manga/delete', AuthMiddleware.auth, MangaMiddleware.valid_manga_delete, MangaController.delete);


routes.post('/chapter/post', AuthMiddleware.auth, multer(multerConfig).array('imgCollection'), ChapterController.store);
routes.get('/chapter/index', AuthMiddleware.auth, (req, res) => {
    ChapterController.index();
   
})
routes.put('/chapter/update', AuthMiddleware.auth, ChapterController.update);
routes.delete('/chapter/delete', AuthMiddleware.auth, ChapterController.delete);

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