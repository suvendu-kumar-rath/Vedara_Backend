const User = require('./user.model');
const quatation = require ('./quatation.model');
const projectStage = require ('./projectStage.model');
const project = require ('./project.model');
const leads = require ('./leads.model');
const design = require ('./design.model');
const client = require ('./clients.model');

// Define associations
leads.belongsTo(User, {
  foreignKey: { name: 'assigned_to', allowNull: true },
  as: 'assignedUser',
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL'
});

module.exports = {
    User,
    quatation,
    projectStage,
    project,
    leads,
    design,
    client        
};