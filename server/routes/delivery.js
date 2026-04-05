const express = require('express');
const router = express.Router();
const DeliveryZone = require('../models/DeliveryZone');

// Predefined delivery zones (you can modify these)
const DEFAULT_DELIVERY_ZONES = [
  '98101', '98102', '98103', '98104', '98105',
  '98106', '98107', '98108', '98109', '98110',
  '98111', '98112', '98113', '98114', '98115',
  '98116', '98117', '98118', '98119', '98121',
  '98122', '98125', '98126', '98133', '98134',
  '98136', '98144', '98146', '98148', '98154',
  '98164', '98174', '98177', '98178', '98195',
  '98199'
];

// Check if ZIP code is in delivery zone
router.get('/check/:zipCode', async (req, res) => {
  try {
    const { zipCode } = req.params;

    // First check database
    let deliveryZone = await DeliveryZone.findOne({ zipCode: zipCode.trim() });

    // If not in database, check against default zones
    if (!deliveryZone && DEFAULT_DELIVERY_ZONES.includes(zipCode.trim())) {
      // Create new delivery zone record
      deliveryZone = new DeliveryZone({
        zipCode: zipCode.trim(),
        active: true
      });
      await deliveryZone.save();
    }

    const eligible = deliveryZone && deliveryZone.active;

    res.json({
      eligible,
      zipCode,
      deliveryFee: eligible ? deliveryZone.deliveryFee : 0,
      freeDeliveryMinimum: eligible ? deliveryZone.freeDeliveryMinimum : null,
      estimatedDeliveryTime: eligible ? deliveryZone.estimatedDeliveryTime : null
    });
  } catch (error) {
    console.error('Delivery check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Calculate delivery fee
router.get('/fee', async (req, res) => {
  try {
    const { zipCode, subtotal } = req.query;

    if (!zipCode || !subtotal) {
      return res.status(400).json({ error: 'ZIP code and subtotal are required' });
    }

    const deliveryZone = await DeliveryZone.findOne({ zipCode: zipCode.trim(), active: true });

    if (!deliveryZone) {
      return res.json({ fee: 0, eligible: false });
    }

    const subtotalAmount = parseFloat(subtotal);
    const fee = subtotalAmount >= deliveryZone.freeDeliveryMinimum ? 0 : deliveryZone.deliveryFee;

    res.json({
      fee,
      eligible: true,
      freeDeliveryMinimum: deliveryZone.freeDeliveryMinimum,
      qualifiesForFreeDelivery: subtotalAmount >= deliveryZone.freeDeliveryMinimum
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all delivery zones (admin)
router.get('/zones', async (req, res) => {
  try {
    const zones = await DeliveryZone.find().sort({ zipCode: 1 });
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create delivery zone (admin)
router.post('/zones', async (req, res) => {
  try {
    const zone = new DeliveryZone(req.body);
    await zone.save();
    res.status(201).json(zone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update delivery zone (admin)
router.put('/zones/:id', async (req, res) => {
  try {
    const zone = await DeliveryZone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!zone) {
      return res.status(404).json({ error: 'Delivery zone not found' });
    }

    res.json(zone);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete delivery zone (admin)
router.delete('/zones/:id', async (req, res) => {
  try {
    const zone = await DeliveryZone.findByIdAndDelete(req.params.id);
    if (!zone) {
      return res.status(404).json({ error: 'Delivery zone not found' });
    }
    res.json({ message: 'Delivery zone deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;