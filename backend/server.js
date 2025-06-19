const app = require("./src/app");
const connection = require("./src/database");

const PORT = process.env.PORT || 3000;

connection.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
