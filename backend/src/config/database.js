require("dotenv").config();

module.exports = {
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "avant_soft",
  dialect: "mysql",
  define: {
    timestamps: true,
    underscored: true,
  },
  logging: false, // Desabilitar logs SQL para desenvolvimento
};
