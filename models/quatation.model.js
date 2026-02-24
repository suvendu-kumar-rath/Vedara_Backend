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
  // Structured scope blocks captured from the form (store as LONGTEXT with explicit JSON serialization)
  project_info: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    get() {
      const v = this.getDataValue('project_info');
      try { return v ? JSON.parse(v) : null; } catch { return v; }
    },
    set(val) {
      this.setDataValue('project_info', val ? JSON.stringify(val) : null);
    }
  },
  global_scope: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    get() {
      const v = this.getDataValue('global_scope');
      try { return v ? JSON.parse(v) : null; } catch { return v; }
    },
    set(val) {
      this.setDataValue('global_scope', val ? JSON.stringify(val) : null);
    }
  },
  deliverables: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    get() {
      const v = this.getDataValue('deliverables');
      try { return v ? JSON.parse(v) : null; } catch { return v; }
    },
    set(val) {
      this.setDataValue('deliverables', val ? JSON.stringify(val) : null);
    }
  },
  room_wise_details: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    get() {
      const v = this.getDataValue('room_wise_details');
      try { return v ? JSON.parse(v) : null; } catch { return v; }
    },
    set(val) {
      this.setDataValue('room_wise_details', val ? JSON.stringify(val) : null);
    }
  },
  status:{
    type:DataTypes.ENUM("sent","approved","rejected"),
    defaultValue:"sent"
  }
},{
  tableName:"quotations",
  timestamps:true
});

module.exports = Quotation;
