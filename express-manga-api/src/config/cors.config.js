import env from "../env.js";

const allowedOrigins = [env.CLIENT];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

export default corsOptions;
