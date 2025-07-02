import http from "node:http";
import mongoose from "mongoose";
import { app } from "./config/express.config.js";

import env from "./env.js";

mongoose.connect(env.DB_CONNECTION);
const server = http.Server(app);

const PORT = Number.parseInt(env.PORT, 10);
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
