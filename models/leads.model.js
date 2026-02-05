const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Lead = sequelize.define("Lead",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  source: DataTypes.STRING,
  status:{
    type:DataTypes.ENUM("new","contacted","converted","discarded"),
    defaultValue:"new"
  },
  budgetRange: DataTypes.STRING,
  propertyType: DataTypes.STRING,
  city: DataTypes.STRING,
  notes: DataTypes.TEXT,
  assigned_to: DataTypes.STRING
},{
  tableName:"leads",
  timestamps:true
});

module.exports = Lead;
