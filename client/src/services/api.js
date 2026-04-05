import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menu API
export const menuAPI = {
  getProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// Payment API
export const paymentsAPI = {
  createStripePaymentIntent: (amount) => api.post('/payments/create-payment-intent', { amount }),
  confirmPayment: (orderId, paymentData) => api.post('/payments/confirm', { orderId, paymentData }),
};

// Delivery API
export const deliveryAPI = {
  checkZipCode: (zipCode) => api.get(`/delivery/check/${zipCode}`),
  calculateDeliveryFee: (zipCode, subtotal) => api.get(`/delivery/fee`, { params: { zipCode, subtotal } }),
};

export default api;