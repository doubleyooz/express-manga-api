import swaggerAutogen from "swagger-autogen";

import env from "../env.js";

const doc = {
  info: {
    version: "1.0.0",
    title: "Manga Reader API",
    description: "API documentation for the Manga Reader application.",
  },
  host: `${env.SERVER}:${env.PORT}`,
  servers: [
    {
      url: `${env.SERVER}:${env.PORT}`,
    },
  ],
  components: {
    schemas: {
      User: {
        id: "123456",
        username: "mangafan",
        email: "mangafan@example.com",
        role: "user",
        createdAt: "2024-06-01T12:00:00Z",
      },
      Manga: {
        id: "manga123",
        title: "One Piece",
        author: "Eiichiro Oda",
        description: "A story about pirates searching for the ultimate treasure.",
        genres: ["Action", "Adventure"],
        coverUrl: "https://example.com/cover.jpg",
        status: "ongoing",
        createdAt: "2024-06-01T12:00:00Z",
      },
      Chapter: {
        id: "chapter001",
        mangaId: "manga123",
        title: "Romance Dawn",
        number: 1,
        pages: [
          "https://example.com/page1.jpg",
          "https://example.com/page2.jpg",
        ],
        releaseDate: "2024-06-01T12:00:00Z",
      },
      Author: {
        id: "author001",
        name: "Eiichiro Oda",
        bio: "Japanese manga artist known for One Piece.",
        avatarUrl: "https://example.com/oda.jpg",
      },
      Cover: {
        id: "cover001",
        mangaId: "manga123",
        imageUrl: "https://example.com/cover.jpg",
        uploadedAt: "2024-06-01T12:00:00Z",
      },
      AuthRequest: {
        username: "mangafan",
        password: "password123",
      },
      AuthResponse: {
        token: "jwt.token.here",
        user: {
          id: "123456",
          username: "mangafan",
          email: "mangafan@example.com",
        },
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
  tags: [
    {
      name: "Authentication",
      description: "User authentication and authorization endpoints",
    },
    {
      name: "Authors",
      description: "Author management operations",
    },
    {
      name: "Manga",
      description: "Manga management operations",
    },
    {
      name: "Chapters",
      description: "Chapter management operations",
    },
    {
      name: "Covers",
      description: "Cover image management operations",
    },
    {
      name: "Users",
      description: "User management operations",
    },
  ],
};

const outputFile = "./swagger.json";
const routes = [
  "../routes/auth.route.js",
  "../routes/manga.route.js",
  "../routes/chapters.route.js",
  "../routes/users.route.js",
  "../routes/reviews.route.js",
  "../routes/covers.route.js",
  "../routes/authors.route.js",
];
swaggerAutogen()(outputFile, routes, doc);
