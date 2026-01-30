const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Quotation = sequelize.define("Quotation",{
  id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  client_id: DataTypes.INTEGER,
  project_id: DataTypes.INTEGER,
  base_amount: DataTypes.FLOAT,
  discount_percent: DataTypes.FLOAT,
  final_amount: DataTypes.FLOAT,
  valid_until: DataTypes.DATE,
  notes: DataTypes.TEXT,
  status:{
    type:DataTypes.ENUM("sent","approved","rejected"),
    defaultValue:"sent"
  }
},{
  tableName:"quotations",
  timestamps:true
});

module.exports = Quotation;
