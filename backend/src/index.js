import dotenv from "dotenv";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
//import io from 'socket.io';

import { response } from "./middlewares/ResponseMiddleware.js";

import corsOptionsDelegate from "./config/cors.js";
import limiter from "./config/limiter.js";

import authRoute from "./routes/Authentication.js";
import authorRoute from "./routes/Author.js";
import chapterRoute from "./routes/Chapter.js";
import mangaRoute from "./routes/Manga.js";
import reviewRoute from "./routes/Review.js";
import userRoute from "./routes/User.js";

dotenv.config();

const app = express();
const server = http.Server(app);

mongoose.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-c09yq.mongodb.net/MangaReader?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	}
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static("uploads"));

app.use(cookieParser());
app.use(cors(corsOptionsDelegate));
app.use(limiter); // limiting all requests
app.use(response);

app.use(authRoute);
app.use("/author", authorRoute);
app.use("/chapter", chapterRoute);
app.use("/manga", mangaRoute);
app.use("/review", reviewRoute);
app.use("/user", userRoute);

server.listen(parseInt(`${process.env.PORT}`), () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
