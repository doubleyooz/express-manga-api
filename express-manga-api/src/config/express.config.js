import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { apiReference } from '@scalar/express-api-reference'
import corsOptions from "./cors.config.js";

import swaggerDocument from "../config/swagger.json" assert { type: "json" };

import authRoute from "../routes/auth.route.js";
// import authorRoute from "../routes/author.route.js";
import chaptersRoute from "../routes/chapter.route.js";
import mangaRoute from "../routes/manga.route.js";
// import reviewRoute from "../routes/review.route.js";
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
      // Put your OpenAPI url here:
        url: '/docs/json',
        
        
    }),
  )

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/files", express.static("uploads"));

app.use("/auth", authRoute);
// app.use("/authors", authorRoute);
app.use("/chapters", chaptersRoute);
app.use("/mangas", mangaRoute);
// app.use("/reviews", reviewRoute);
app.use("/users", usersRoute);

export { app };
