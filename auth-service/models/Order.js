// auth-service/models/Order.js
const { DataTypes } = require('sequelize');

// Define the Order model
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cart: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    shippingDetails: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending',
    },
  });

  return Order;
};
