const User = require('./user.model');
const quatation = require ('./quatation.model');
const projectStage = require ('./projectStage.model');
const project = require ('./project.model');
const leads = require ('./leads.model');
const design = require ('./design.model');
const client = require ('./clients.model');

// Define associations
leads.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });

module.exports = {
    User,
    quatation,
    projectStage,
    project,
    leads,
    design,
    client        
};