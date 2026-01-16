const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Project = sequelize.define("Project",{
  id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  client_id: DataTypes.INTEGER,
  title: DataTypes.STRING,
  location: DataTypes.STRING,
  project_type: DataTypes.STRING,
  budget: DataTypes.FLOAT,
  status:{
    type:DataTypes.ENUM("active","completed","onhold"),
    defaultValue:"active"
  },
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE
},{
  tableName:"projects",
  timestamps:true
});

module.exports = Project;
