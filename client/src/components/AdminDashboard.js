import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    'pending_payment',
    'confirmed',
    'preparing',
    'ready',
    'completed',
    'cancelled'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Fan de Admin Dashboard</h1>
            <a
              href="/"
              className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              View Store
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              filter === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Orders
          </button>
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize ${
                filter === status
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                    <p className="text-sm text-gray-600">{order.customerInfo.fullName}</p>
                    <p className="text-sm text-gray-600">{order.customerInfo.phone}</p>
                    <p className="text-sm text-gray-600">{order.customerInfo.email}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Order Details</h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {order.orderType}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Time:</span> {order.pickup}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Payment:</span> {order.paymentMethod}
                    </p>
                  </div>
                </div>

                {order.orderType === 'delivery' && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.customerInfo.address}
                      {order.customerInfo.apartment && `, ${order.customerInfo.apartment}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.customerInfo.city}, {order.customerInfo.state} {order.zip}
                    </p>
                    {order.customerInfo.deliveryInstructions && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Instructions:</span> {order.customerInfo.deliveryInstructions}
                      </p>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.qty}</span>
                        <span>${item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${order.subtotal}</span>
                    </div>
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee</span>
                        <span>${order.deliveryFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${order.total}</span>
                    </div>
                  </div>
                </div>

                {order.customerInfo.orderNotes && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Order Notes</h4>
                    <p className="text-sm text-gray-600">{order.customerInfo.orderNotes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;