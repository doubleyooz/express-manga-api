import dotenv from 'dotenv';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
//import io from 'socket.io';

import routes from './routes.js';
import { response } from './middlewares/response.js';
import corsOptionsDelegate from './config/cors.js';

dotenv.config()

const app = express();
const server = http.Server(app);

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-c09yq.mongodb.net/MangaReader?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static("uploads"));
 

app.use(cookieParser())
app.use(cors(corsOptionsDelegate));
app.use(response)

app.use(routes);
server.listen(parseInt(`${process.env.PORT}`), () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
