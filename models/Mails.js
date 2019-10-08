const Sequelize = require("sequelize");
const db = require("../config/database");

module.exports = db.define(
  "Mails",
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    from: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: false
    },
    to: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: false
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    time: {
      type: Sequelize.DATE,
      allowNull: true
    }
  },
  {
    tableName: "Mails",
    createdAt: false,
    updatedAt: false
  }
);
