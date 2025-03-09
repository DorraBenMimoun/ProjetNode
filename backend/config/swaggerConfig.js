const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestion des Tâches",
      version: "1.0.0",
      description: "Documentation de l'API de gestion des tâches avec WebSockets",
    },
    servers: [
      {
        url: "http://localhost:9091",
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
      security: [
        {
          bearerAuth: [],
        },
      ],
  },
  apis: ["./routes/*.js"], // Inclut les fichiers de routes pour générer la doc
};



const swaggerDocs = swaggerJsdoc(options);


module.exports = swaggerDocs;
