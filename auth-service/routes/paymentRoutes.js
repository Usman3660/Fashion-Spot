// backend/routes/paymentRoutes.js

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key
const router = express.Router();

// Payment intent route
router.post('/payment', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses the smallest unit (e.g., cents)
      currency: currency,
      payment_method_types: ['card'],
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
