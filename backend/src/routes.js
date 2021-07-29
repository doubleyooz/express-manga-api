import express from 'express';

//controllers
import AuthorController from './controllers/AuthorController.js';
import ChapterController from './controllers/ChapterController.js';
import MangaController from './controllers/MangaController.js';
import UserController from './controllers/UserController.js';

import SessionController from './controllers/SessionController.js';
import LikeController from './controllers/LikeController.js';
import NotifyController from './controllers/NotifyController.js';

//middlewares
import AuthorMiddleware from './middlewares/Author.js';
import ChapterMiddleware from './middlewares/Chapter.js';
import MangaMiddleware from './middlewares/Manga.js';
import UserMiddleware from './middlewares/User.js';

import { auth as Authorize, easyAuth }  from './middlewares/auth.js';

import UploadMiddleware from './middlewares/upload.js';


const routes = express.Router()


routes.get('/', (req, res) => {
    return res.jsonOK( null, "Hello World", null);

});


routes.get('/me', Authorize(), SessionController.me);

routes.post("/authentication/activate/:tky", SessionController.activateAccount);// POST
routes.put("/authentication/recover/:tky", SessionController.recoverPassword);// PUT

routes.post('/sign-up', UserMiddleware.valid_sign_up, UserController.store);
routes.get('/sign-in', UserMiddleware.valid_sign_in, SessionController.sign_in);
routes.post("/google-sign-in", SessionController.google_sign_in)
routes.post("/google-sign-up", UserMiddleware.valid_google_sign_up, UserController.store)
routes.get('/refresh-token', SessionController.refreshAccessToken)

routes.get('/user/read', easyAuth(), UserMiddleware.valid_user_read, UserController.read);
routes.get('/user/list', easyAuth(),  UserMiddleware.valid_user_list,UserController.list);
routes.put('/user/update', Authorize(["Scan", "User"]), UserMiddleware.valid_user_update, UserController.update)
routes.delete('/user/delete', Authorize(["Scan", "User"]), UserMiddleware.valid_user_remove, UserController.remove);
routes.put('/user/like', Authorize("User"), LikeController.likeUser);
routes.get('/user/notify', Authorize("Scan"), NotifyController.notifyUsers)


routes.post('/manga/post', Authorize("Scan"), UploadMiddleware.upload_single, MangaMiddleware.valid_manga_store, MangaController.store);
routes.get('/manga/list',  easyAuth(), MangaMiddleware.valid_manga_list, MangaController.list);
routes.get('/manga/read',  easyAuth(), MangaMiddleware.valid_manga_read, MangaController.read);
routes.put('/manga/update', Authorize("Scan"), MangaMiddleware.valid_manga_update, MangaController.update);
routes.delete('/manga/delete', Authorize("Scan"), MangaMiddleware.valid_manga_remove, MangaController.remove);
routes.put('/manga/like', Authorize("User"), LikeController.likeManga);
routes.put('/manga/pin', Authorize("User"), LikeController.pinManga);

routes.post('/chapter/post', Authorize("Scan"), UploadMiddleware.upload_many_manga, ChapterMiddleware.valid_chapter_store, ChapterController.store);
routes.get('/chapter/list', easyAuth(), ChapterMiddleware.valid_chapter_list, ChapterController.list);
routes.get('/chapter/read', easyAuth(), ChapterMiddleware.valid_chapter_read, ChapterController.read);
routes.put('/chapter/update', Authorize("Scan"), ChapterController.update);
routes.delete('/chapter/delete', Authorize("Scan"), ChapterMiddleware.valid_chapter_remove,  ChapterController.remove);

routes.post('/author/post', Authorize("Scan"), UploadMiddleware.upload_many_author, AuthorMiddleware.valid_author_store, AuthorController.store);
routes.put('/author/update', Authorize("Scan"), AuthorController.update);
routes.get('/author/list', AuthorController.list);
routes.get('/author/read', AuthorController.read);
routes.delete('/author/delete', Authorize("Scan"), AuthorController.remove);

export default routes;