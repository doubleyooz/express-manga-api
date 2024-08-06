import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import swaggerUi from "swagger-ui-express";
import corsOptions from "./cors.config.js";

// import * as swaggerDocument from "../config/swagger.json";

// import authRoute from "../routes/authentication.route.js";
// import authorRoute from "../routes/author.route.js";
// import chapterRoute from "../routes/chapter.route.js";
// import mangaRoute from "../routes/manga.route.js";
// import reviewRoute from "../routes/review.route.js";
import userRoute from "../routes/users.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
//app.use(cors());
app.use(cors(corsOptions));
// app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use("/auth", authRoute);
// app.use("/authors", authorRoute);
// app.use("/chapters", chapterRoute);
// app.use("/mangas", mangaRoute);
// app.use("/reviews", reviewRoute);
app.use("/users", userRoute);

export { app };
