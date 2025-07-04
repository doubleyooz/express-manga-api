import swaggerAutogen from "swagger-autogen";

import env from "../env.js";

const doc = {
  info: {
    version: "1.0.0",
    title: "My API",
    description: "Some description...",
  },
  host: `${env.SERVER}:${env.PORT}`,
  servers: [
    {
      url: `${env.SERVER}:${env.PORT}`,
    },
  ],
  components: {
    schemas: {
      someBody: {
        $name: "Jhon Doe",
        $age: 29,
        about: "",
      },
      someResponse: {
        name: "Jhon Doe",
        age: 29,
        diplomas: [
          {
            school: "XYZ University",
            year: 2020,
            completed: true,
            internship: {
              hours: 290,
              location: "XYZ Company",
            },
          },
        ],
      },
      someEnum: {
        "@enum": ["red", "yellow", "green"],
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
      basicAuth: {
        type: "http",
        scheme: "basic",
      },
    },
  },
};

const outputFile = "./swagger.json";
const routes = ["./express.config.js"];
swaggerAutogen()(outputFile, routes, doc);
