// routes/swagger.js
const express = require("express");
const router = express.Router();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger 설정
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Notes API",
      version: "1.0.0",
      description: "A simple Express Notes API",
    },
    servers: [
      {
        url: "http://localhost:3000", // 서버 URL을 여기에 맞게 설정
      },
    ],
  },
  apis: ["./routes/*.js"], // 주석이 있는 경로
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = router;
