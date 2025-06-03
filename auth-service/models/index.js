// auth-service/models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/config');

// Create a new Sequelize instance using the configuration
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

const db = {};

// Add Sequelize and sequelize instances to db object
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load the Order model after the sequelize instance is created
db.Order = require('./Order')(sequelize, Sequelize.DataTypes);  // Pass sequelize instance and Sequelize.DataTypes to Order model

// Synchronize all models with the database
db.sequelize.sync()
  .then(() => console.log('PostgreSQL DB synced'))
  .catch(err => console.error('Sync error:', err));

module.exports = db;  // Export db object with all models
