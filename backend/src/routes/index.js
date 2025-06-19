const express = require("express");
const authRoutes = require("./auth.routes");
const clientRoutes = require("./client.routes");
const salesRoutes = require("./sales.routes");

const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/api", clientRoutes);
routes.use("/api", salesRoutes);

module.exports = routes;
