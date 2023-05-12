const { db } = require("../database/config");
const { DataTypes } = require("sequelize");

const Meal = db.define("meals", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("available", "disabled"),
    defaultValue: "available",
  },
});

module.exports = Meal;
