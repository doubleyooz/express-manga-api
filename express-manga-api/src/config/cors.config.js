const allowedOrigins = [`${process.env.CLIENT}`];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

export default corsOptions;
