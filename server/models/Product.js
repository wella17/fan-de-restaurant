const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  tag: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  category: {
    type: String,
    default: 'pastries',
    trim: true
  },
  available: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 100,
    min: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ available: 1 });

module.exports = mongoose.model('Product', productSchema);