const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema({
  zipCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  deliveryFee: {
    type: Number,
    default: 5,
    min: 0
  },
  freeDeliveryMinimum: {
    type: Number,
    default: 30,
    min: 0
  },
  estimatedDeliveryTime: {
    type: String,
    default: '30-45 minutes'
  }
}, {
  timestamps: true
});

// Index for faster lookups
deliveryZoneSchema.index({ zipCode: 1 });
deliveryZoneSchema.index({ active: 1 });

module.exports = mongoose.model('DeliveryZone', deliveryZoneSchema);