const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Quotation = sequelize.define("Quotation",{
  id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  project_id: DataTypes.INTEGER,
  amount: DataTypes.FLOAT,
  status:{
    type:DataTypes.ENUM("sent","approved","rejected"),
    defaultValue:"sent"
  }
},{
  tableName:"quotations",
  timestamps:true
});

module.exports = Quotation;
