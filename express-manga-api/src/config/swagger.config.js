import "dotenv/config";
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0.0",
    title: "My API",
    description: "Some description...",
  },
  servers: [
    {
      url: process.env.SERVER + ":" + process.env.PORT,
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
    },
  },
};

const outputFile = "./swagger.json";
const routes = [
  "src/routes/app.route.ts",
  "src/routes/authentication.route.ts",
  "src/routes/author.route.ts",
  "src/routes/chapter.route.ts",
  "src/routes/manga.route.ts",
  "src/routes/review.route.ts",
  "src/routes/user.route.ts",
];
swaggerAutogen()(outputFile, routes, doc);
