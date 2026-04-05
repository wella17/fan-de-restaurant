const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { sendOrderConfirmation } = require('../services/emailService');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const { status, orderType, limit = 50 } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by order number
router.get('/number/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;

    // Validate order data
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!orderData.customerInfo || !orderData.customerInfo.fullName || !orderData.customerInfo.phone || !orderData.customerInfo.email) {
      return res.status(400).json({ error: 'Customer information is required' });
    }

    if (orderData.orderType === 'delivery') {
      if (!orderData.zip || !orderData.customerInfo.address || !orderData.customerInfo.city || !orderData.customerInfo.state) {
        return res.status(400).json({ error: 'Complete delivery address is required for delivery orders' });
      }
    }

    const order = new Order(orderData);
    await order.save();

    // Send order confirmation email
    try {
      await sendOrderConfirmation(order);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending_payment', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update order
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete order (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;