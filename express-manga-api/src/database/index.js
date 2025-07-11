import env from "../env.js";

export const DB_CONNECTION = `mongodb+srv://${env.DB_USER}:${env.DB_PASS}@${env.DB_CLUSTER}/${env.DB_NAME}?retryWrites=true&w=majority`;