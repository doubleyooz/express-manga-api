const express = require('express');

const UserController = require("./controllers/UserController");
const AuthorController = require("./controllers/AuthorController");
const ChapterController = require('./controllers/ChapterController');
const MangaController = require('./controllers/MangaController');
const AuthController = require('./controllers/SessionController');
const LikeController = require('./controllers/LikeController');
const NotifyController = require('./controllers/NotifyController')

const ChapterMiddleware = require('./middlewares/chapter');
const MangaMiddleware = require('./middlewares/manga');
const UserMiddleware = require('./middlewares/user');
const Authorize = require('./middlewares/auth');
const getRole = require('./middlewares/getRole');
const UploadMiddleware = require('./middlewares/upload')

const routes = express.Router()



routes.get('/', (req, res) => {
    return res.jsonOK( null, "Hello World", null);

});


routes.get('/me', Authorize(), (req, res) => {
    res.send(req.auth)
   
})

routes.post("/authentication/activate/:tky", AuthController.activateAccount);// POST
routes.put("/authentication/recover/:tky", AuthController.recoverPassword);// PUT

routes.post('/sign-up', UserMiddleware.valid_sign_up, UserController.store);
routes.get('/sign-in', UserMiddleware.valid_sign_in, AuthController.sign_in);
routes.post("/google-sign-in", AuthController.google_sign_in)
routes.post("/google-sign-up", UserMiddleware.valid_google_sign_up, UserController.store)
routes.get('/refresh-token', AuthController.refreshAccessToken)

routes.get('/user/index', Authorize(["Scan", "User"]), UserController.index);
routes.put('/user/update', Authorize(["Scan", "User"]), UserController.update)
routes.delete('/user/delete', Authorize(["Scan", "User"]), UserMiddleware.valid_user_delete, UserController.delete);
routes.put('/user/like', Authorize("User"), LikeController.likeUser);
routes.get('/user/notify', Authorize("Scan"), NotifyController.notifyUsers)


routes.post('/manga/post', Authorize("Scan"), UploadMiddleware.upload_single, MangaMiddleware.valid_manga_store, MangaController.store);
routes.get('/manga/list',  getRole(), MangaMiddleware.valid_manga_list, MangaController.list);
routes.get('/manga/index',  getRole(), MangaMiddleware.valid_manga_index, MangaController.index);
routes.put('/manga/update', Authorize("Scan"), MangaController.update);
routes.delete('/manga/delete', Authorize("Scan"), MangaMiddleware.valid_manga_delete, MangaController.delete);
routes.put('/manga/like', Authorize("User"), LikeController.likeManga);
routes.put('/manga/pin', Authorize("User"), LikeController.pinManga);


routes.post('/chapter/post', Authorize("Scan"), UploadMiddleware.upload_many_manga, ChapterMiddleware.valid_chapter_store, ChapterController.store);
routes.get('/chapter/list', getRole(), ChapterMiddleware.valid_chapter_list, ChapterController.list);
routes.get('/chapter/index', getRole(), ChapterMiddleware.valid_chapter_index, ChapterController.index);
routes.put('/chapter/update', Authorize("Scan"), ChapterController.update);
routes.delete('/chapter/delete', Authorize("Scan"), ChapterMiddleware.valid_chapter_delete,  ChapterController.delete);

routes.post('/author/post', Authorize("Scan"), UploadMiddleware.upload_many_author, AuthorController.store);
routes.put('/author/update', Authorize("Scan"), AuthorController.update);
routes.get('/author/list', AuthorController.list);
routes.get('/author/index', AuthorController.index);
routes.delete('/author/delete', Authorize("Scan"), AuthorController.delete);

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