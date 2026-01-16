const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProjectStage = sequelize.define("ProjectStage",{
  id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  project_id: DataTypes.INTEGER,
  stage_name: DataTypes.STRING,
  progress_percentage: DataTypes.INTEGER,
  status: DataTypes.STRING
},{
  tableName:"project_stages",
  timestamps:true
});

module.exports = ProjectStage;
