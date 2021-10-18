import express from 'express';

//controllers
import AuthorController from './controllers/AuthorController.js';
import ChapterController from './controllers/ChapterController.js';
import MangaController from './controllers/MangaController.js';
import ReviewController from './controllers/ReviewController.js';
import UserController from './controllers/UserController.js';

import SessionController from './controllers/SessionController.js';
import LikeController from './controllers/LikeController.js';
import NotifyController from './controllers/NotifyController.js';

//middlewares
import AuthorMiddleware from './middlewares/Author.js';
import ChapterMiddleware from './middlewares/Chapter.js';
import MangaMiddleware from './middlewares/Manga.js';
import ReviewMiddleware from './middlewares/Review.js';
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
routes.put('/user', Authorize(["Scan", "User"]), UserMiddleware.valid_user_update, UserController.update)
routes.delete('/user', Authorize(["Scan", "User"]), UserMiddleware.valid_user_remove, UserController.remove);
routes.put('/user/like', Authorize("User"), LikeController.likeUser);
//routes.get('/user/review',  easyAuth(), MangaMiddleware.valid_review_list, ReviewController.list);
routes.get('/user/notify', Authorize("Scan"), NotifyController.notifyUsers)


routes.post('/manga', Authorize("Scan"), UploadMiddleware.upload_single, MangaMiddleware.valid_manga_store, MangaController.store);
routes.get('/manga/list',  easyAuth(), MangaMiddleware.valid_manga_list, MangaController.list);
routes.get('/manga/read',  easyAuth(), MangaMiddleware.valid_manga_read, MangaController.read);
routes.put('/manga', Authorize("Scan"), MangaMiddleware.valid_manga_update, MangaController.update);
routes.delete('/manga', Authorize("Scan"), MangaMiddleware.valid_manga_remove, MangaController.remove);
routes.put('/manga/like', Authorize("User"), LikeController.likeManga);
routes.put('/manga/pin', Authorize("User"), LikeController.pinManga);

routes.post('/review', Authorize("User"), ReviewMiddleware.valid_store, ReviewController.store);
routes.get('/review/list',  easyAuth(), ReviewMiddleware.valid_list, ReviewController.list);
routes.get('/review/read',  easyAuth(), ReviewMiddleware.valid_read, ReviewController.read);
//routes.put('/manga/review', Authorize("User"), ReviewMiddleware.valid_manga_update, ReviewController.update);
//routes.delete('/manga/review', Authorize("User"), ReviewMiddleware.valid_manga_remove, ReviewController.remove);

routes.post('/chapter', Authorize("Scan"), UploadMiddleware.upload_many_manga, ChapterMiddleware.valid_chapter_store, ChapterController.store);
routes.get('/chapter/list', easyAuth(), ChapterMiddleware.valid_chapter_list, ChapterController.list);
routes.get('/chapter/read', easyAuth(), ChapterMiddleware.valid_chapter_read, ChapterController.read);
routes.put('/chapter', Authorize("Scan"), ChapterMiddleware.valid_chapter_update, ChapterController.update);
routes.delete('/chapter', Authorize("Scan"), ChapterMiddleware.valid_chapter_remove,  ChapterController.remove);

routes.post('/author', Authorize("Scan"), UploadMiddleware.upload_many_author, AuthorMiddleware.valid_author_store, AuthorController.store);
routes.put('/author', AuthorMiddleware.valid_author_update, Authorize("Scan"), AuthorController.update);
routes.get('/author/list', easyAuth(), AuthorController.list);
routes.get('/author/read', easyAuth(), AuthorController.read);
routes.delete('/author', Authorize("Scan"), AuthorController.remove);

export default routes;