const { Model, DataTypes } = require("sequelize");

class Sale extends Model {
  static init(sequelize) {
    super.init(
      {
        value: DataTypes.DECIMAL(10, 2),
        date: DataTypes.DATE,
        description: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Client, { foreignKey: "client_id", as: "client" });
  }
}

module.exports = Sale;
