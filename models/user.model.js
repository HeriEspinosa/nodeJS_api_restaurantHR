const { db } = require("../database/config");
const { DataTypes } = require("sequelize");

const User = db.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: ["[a-z]", "i"],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordChangedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("available", "disabled"),
    defaultValue: "available",
  },
  role: {
    type: DataTypes.ENUM("normal", "admin"),
    defaultValue: "normal",
  },
});

module.exports = User;
