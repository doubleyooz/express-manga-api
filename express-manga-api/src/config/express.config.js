import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { apiReference } from '@scalar/express-api-reference'
import corsOptions from "./cors.config.js";

import swaggerDocument from "../config/swagger.json" assert { type: "json" };

import { errorHandler } from "../middlewares/error.middleware.js";

import authRoute from "../routes/auth.route.js";
import authorRoute from "../routes/authors.route.js";
import coversRoute from "../routes/covers.route.js";
import chaptersRoute from "../routes/chapters.route.js";
import mangaRoute from "../routes/manga.route.js";
import reviewRoute from "../routes/review.route.js";
import usersRoute from "../routes/users.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
//app.use(cors());
app.use(cors(corsOptions));


app.use("/docs/json", (req, res) => {
    res.json(swaggerDocument);
});

app.use(
    '/docs/scalar',
    apiReference({
        url: '/docs/json',
    }),
  )

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/files", express.static("uploads"));

app.use(authRoute);
app.use(authorRoute);
app.use(chaptersRoute);
app.use(coversRoute);
app.use(mangaRoute);
app.use(reviewRoute);
app.use(usersRoute);
app.use(errorHandler);

export { app };
