const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Avant Soft",
      version: "1.0.0",
      description:
        "API para gerenciamento de clientes e vendas da loja de brinquedos Avant Soft",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // arquivos que contém anotações do Swagger
};

const specs = swaggerJsdoc(options);
module.exports = specs;
