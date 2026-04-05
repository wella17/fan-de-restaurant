const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent for Stripe
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: 'usd',
      metadata: {
        source: 'fan-de-restaurant'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment (webhook handler would go here in production)
router.post('/confirm', async (req, res) => {
  try {
    const { orderId, paymentData } = req.body;

    // In production, you would verify the payment with Stripe
    // and update the order status accordingly

    res.json({
      success: true,
      message: 'Payment confirmed'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment information
router.get('/payment-intent/:id', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100 // Convert back to dollars
    });
  } catch (error) {
    console.error('Retrieve payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;