const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
    defaultValue: 'medium',
  },

  status: {
    type: DataTypes.ENUM(
      'open',
      'in_progress',
      'resolved',
      'closed'
    ),
    allowNull: false,
    defaultValue: 'open',
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },


  technicianId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

});

module.exports = Ticket;