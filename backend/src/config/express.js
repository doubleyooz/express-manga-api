import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "../routes/Authentication.js";
import authorRoute from "../routes/Author.js";
import chapterRoute from "../routes/Chapter.js";
import mangaRoute from "../routes/Manga.js";
import reviewRoute from "../routes/Review.js";
import userRoute from "../routes/User.js";

import corsOptionsDelegate from "./cors.js";
import limiter from "./limiter.js";

import { response } from "../middlewares/ResponseMiddleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static("uploads"));

app.use(cookieParser());
app.use(cors(corsOptionsDelegate));
app.use(limiter); // limiting all requests
app.use(response);

app.use(authRoute);
app.use("/authors", authorRoute);
app.use("/chapters", chapterRoute);
app.use("/mangas", mangaRoute);
app.use("/reviews", reviewRoute);
app.use("/users", userRoute);

export { app };
