const Sequelize = require("sequelize");
const db = require("../config/database");

module.exports = db.define(
  "Users",
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // ID_Company: {
    //   type: Sequelize.INTEGER(255),
    //   allowNull: false,
    //   primaryKey: true,
    //   references: {
    //     model: "Companies",
    //     key: "ID_Company"
    //   }
    // },
    nickname: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    user: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false
    }
  },
  {
    tableName: "Users",
    createdAt: false,
    updatedAt: false
  }
);
