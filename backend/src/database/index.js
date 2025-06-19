const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

const User = require("../models/User");
const Client = require("../models/Client");
const Sale = require("../models/Sale");

const connection = new Sequelize(dbConfig);

User.init(connection);
Client.init(connection);
Sale.init(connection);

if (User.associate) {
  User.associate(connection.models);
}
if (Client.associate) {
  Client.associate(connection.models);
}
if (Sale.associate) {
  Sale.associate(connection.models);
}

module.exports = connection;
