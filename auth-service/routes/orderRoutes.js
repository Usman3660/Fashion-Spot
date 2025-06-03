// auth-service/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../models');  // Import db object to access models

// POST request to store the order data (including cart)
router.post('/create', async (req, res) => {
  const { userId, cart, totalAmount, shippingDetails } = req.body;

  try {
    const newOrder = await db.Order.create({
      userId,
      cart: JSON.stringify(cart), // Save cart as JSON
      totalAmount,
      status: 'Confirmed',
      shippingDetails: JSON.stringify(shippingDetails), // Add shipping details
    });

    res.status(200).send({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
