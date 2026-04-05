const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  }
});

const customerInfoSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
  },
  apartment: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  deliveryInstructions: {
    type: String,
    trim: true
  },
  orderNotes: {
    type: String,
    trim: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [orderItemSchema],
  orderType: {
    type: String,
    required: true,
    enum: ['pickup', 'delivery']
  },
  pickup: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'zelle', 'stripe']
  },
  customerInfo: customerInfoSchema,
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending_payment', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending_payment'
  },
  paymentIntentId: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `FD${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderType: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customerInfo.email': 1 });

module.exports = mongoose.model('Order', orderSchema);