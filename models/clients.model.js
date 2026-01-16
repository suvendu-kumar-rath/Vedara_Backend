const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Client = sequelize.define("Client",{
  id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  address: DataTypes.TEXT
},{
  tableName:"clients",
  timestamps:true
});

module.exports = Client;
