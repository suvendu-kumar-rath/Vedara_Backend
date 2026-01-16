const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Design = sequelize.define("Design",{
  id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  project_id: DataTypes.INTEGER,
  file_path: DataTypes.STRING,
  uploaded_by: DataTypes.INTEGER
},{
  tableName:"designs",
  timestamps:true
});

module.exports = Design;
