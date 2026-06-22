import { useMemo, useState, useEffect } from "react";
import { ordersAPI, deliveryAPI } from '../services/api';
import PaymentModal from './PaymentModal';

export default function FanDeOrderingSite() {
  const empandaImage = "/images/empanda.png";
  const hopiaImage = "/images/Hopia.png";
  const pandesalImage = "/images/pandesal.png";
  const hopiaAssortmentImage = "/images/Hopia Assorment.png";

  const products = [
    {
      id: 1,
      name: "Empanada",
      price: 12,
      description: "Traditional Filipino empanada with savory filling, golden and crispy. Made with authentic Philippine flavors.",
      tag: "Best Seller",
      image: empandaImage,
    },
    {
      id: 2,
      name: "Hopia",
      price: 8,
      description: "Classic Filipino pastry with sweet mung bean filling. A beloved traditional treat with modern twist.",
      tag: "Traditional",
      image: hopiaImage,
    },
    {
      id: 3,
      name: "Pandesal",
      price: 6,
      description: "The iconic Filipino bread roll, soft and slightly sweet. Perfect for breakfast or any time of day.",
      tag: "Filipino Classic",
      image: pandesalImage,
    },
    {
      id: 4,
      name: "Hopia Assortment",
      price: 18,
      description: "A variety pack of our different hopia flavors - mung bean, ube, and pork (Porkiedot). Perfect for sharing.",
      tag: "Variety Pack",
      image: hopiaAssortmentImage,
    },
  ];

  const [cart, setCart] = useState([]);
  const [pickup, setPickup] = useState("Today • 4:00 PM");
  const [zip, setZip] = useState("");
  const [orderType, setOrderType] = useState("pickup");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [placedOrders, setPlacedOrders] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    deliveryInstructions: '',
    orderNotes: ''
  });

  // Check delivery eligibility when ZIP code changes
  useEffect(() => {
    if (zip.trim() && orderType === 'delivery') {
      checkDeliveryEligibility(zip.trim());
    }
  }, [zip, orderType]);

  const checkDeliveryEligibility = async (zipCode) => {
    try {
      const response = await deliveryAPI.checkZipCode(zipCode);
      setIsEligible(response.data.eligible);
    } catch (error) {
      console.error('Error checking delivery eligibility:', error);
      setIsEligible(false);
    }
  };

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { ...product, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateOrder = () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return false;
    }

    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.email) {
      setError('Please fill in all required customer information');
      return false;
    }

    if (orderType === 'delivery') {
      if (!zip || !isEligible) {
        setError('Please enter a valid ZIP code for delivery');
        return false;
      }
      if (!customerInfo.address || !customerInfo.city || !customerInfo.state) {
        setError('Please fill in complete delivery address');
        return false;
      }
    }

    setError('');
    return true;
  };

  async function saveOrder() {
    if (!validateOrder()) return;

    setLoading(true);
    try {
      const orderData = {
        items: cart,
        orderType,
        pickup,
        zip: orderType === 'delivery' ? zip : null,
        paymentMethod,
        customerInfo,
        subtotal,
        deliveryFee,
        total,
        status: paymentMethod === 'cash' ? 'confirmed' : 'pending_payment'
      };

      if (paymentMethod === 'stripe') {
        setShowPaymentModal(true);
        setLoading(false);
        return;
      }

      const response = await ordersAPI.createOrder(orderData);

      setPlacedOrders((current) => [response.data, ...current]);
      setCart([]);
      setZip("");
      setOrderType("pickup");
      setPaymentMethod("cash");
      setCustomerInfo({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        deliveryInstructions: '',
        orderNotes: ''
      });
      setShowConfirmation(false);

      if (paymentMethod === "zelle") {
        alert("Order received! Please send payment via Zelle. Check your email for payment details.");
      } else {
        alert("Order confirmed! We'll prepare your order for pickup.");
      }

    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const orderData = {
        items: cart,
        orderType,
        pickup,
        zip: orderType === 'delivery' ? zip : null,
        paymentMethod: 'stripe',
        customerInfo,
        subtotal,
        deliveryFee,
        total,
        status: 'confirmed',
        paymentIntentId: paymentData.paymentIntentId
      };

      const response = await ordersAPI.createOrder(orderData);

      setPlacedOrders((current) => [response.data, ...current]);
      setCart([]);
      setZip("");
      setOrderType("pickup");
      setPaymentMethod("cash");
      setCustomerInfo({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        deliveryInstructions: '',
        orderNotes: ''
      });
      setShowConfirmation(false);
      setShowPaymentModal(false);

      alert("Payment successful! Your order has been confirmed.");

    } catch (error) {
      console.error('Error creating order after payment:', error);
      setError('Payment successful but order creation failed. Please contact support.');
    }
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const deliveryFee = useMemo(() => {
    if (orderType !== "delivery") return 0;
    if (!isEligible) return 0;
    if (subtotal >= 30) return 0;
    return 5;
  }, [orderType, isEligible, subtotal]);

  const total = subtotal + deliveryFee;

  const pickupSteps = [
    "Choose your favorite Fandekitchen pastries",
    "Add items to your cart",
    "Select pickup or delivery",
    "Pay online and enjoy fresh pastries",
  ];

  return (
    <div className="min-h-screen bg-orange-100/60 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-orange-100 bg-orange-100/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <img
              src="/images/fandekitchen-mascot-v3.png"
              alt="Fandekitchen mascot"
              className="h-12 w-12 rounded-full object-cover object-top border-2 border-orange-400 shadow-md bg-white"
            />
            <div>
              <div className="text-lg font-bold tracking-wide text-slate-900">Fandekitchen</div>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#menu" className="hover:text-orange-500">Menu</a>
            <a href="#how-it-works" className="hover:text-orange-500">How It Works</a>
            <a href="#pickup" className="hover:text-orange-500">Order</a>
          </nav>
          <button
            onClick={() => document.getElementById('pickup').scrollIntoView({ behavior: 'smooth' })}
            className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
          >
            Order Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-orange-50 to-white">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-orange-100 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 md:px-10 lg:px-16 lg:py-20">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit rounded-full border border-orange-200 bg-white px-4 py-1 text-sm font-medium text-orange-600 shadow-sm">
              Freshly baked • Pickup & Limited Delivery (nearby areas only)
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Fandekitchen
              <span className="block text-lg font-medium text-orange-500 md:text-xl">
                FanDe Liciou$
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Enjoy a seamless pickup and online ordering experience. At Fandekitchen, every baked creation is
              inspired by authentic Philippine flavors—thoughtfully crafted with a modern twist to elevate
              every bite. Missing the taste of home? Let Fandekitchen bring those familiar, comforting flavors back
              to you one delicious bite at a time.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#menu"
                className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
              >
                View Menu
              </a>
              <a
                href="#pickup"
                className="rounded-2xl border border-orange-200 bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-200/60"
              >
                Order Details
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
                <div className="text-2xl font-bold text-orange-500">Fresh</div>
                <div className="text-sm text-slate-500">Daily bakery feel</div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
                <div className="text-2xl font-bold text-orange-500">Easy</div>
                <div className="text-sm text-slate-500">Simple ordering</div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
                <div className="text-2xl font-bold text-orange-500">Nearby</div>
                <div className="text-sm text-slate-500">Limited delivery</div>
              </div>
            </div>
          </div>

          <div className="self-center flex flex-col items-center mascot-entrance">
            <div className="relative flex items-center justify-center">
              {/* Decorative orange glow circle */}
              <div className="absolute h-72 w-72 rounded-full bg-orange-400/20 blur-2xl" />
              <div className="absolute h-56 w-56 rounded-full border-4 border-orange-300/40 mascot-ring" />
              {/* Mascot */}
              <img
                src="/images/fandekitchen-mascot-v3.png"
                alt="Fandekitchen chef mascot"
                className="mascot-float relative z-10 h-[420px] w-auto object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(249,115,22,0.3))' }}
              />
            </div>
            {/* Name tag below mascot */}
            <div className="mt-4 rounded-2xl bg-orange-500 px-6 py-2 text-white font-bold text-lg shadow-lg shadow-orange-200 tracking-wide">
              FanDe Liciou$
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Menu Preview
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              Best sellers and bundles
            </h2>
          </div>
          <button className="rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-200/60">
            See Full Menu
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-orange-50 border border-orange-200 p-4 text-orange-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Products Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-[2rem] bg-white/95 shadow-lg shadow-orange-200/40 ring-1 ring-orange-200 transition hover:-translate-y-1"
              >
                <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
                <div className="p-6">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="rounded-full bg-orange-100/60 px-3 py-1 text-xs font-semibold text-orange-600">
                      {product.tag}
                    </span>
                    <span className="text-lg font-bold text-orange-500">${product.price}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Sidebar */}
          <aside
            className="h-fit rounded-[2rem] bg-white/95 p-6 shadow-lg shadow-orange-200/40 ring-1 ring-orange-200 lg:sticky lg:top-24"
            id="pickup"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Your Order</h3>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                Pickup & Delivery
              </span>
            </div>

            {/* Order Type Selection */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">Order Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType("pickup")}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    orderType === "pickup"
                      ? "bg-orange-500 text-white"
                      : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                  }`}
                >
                  Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("delivery")}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    orderType === "delivery"
                      ? "bg-orange-500 text-white"
                      : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                  }`}
                >
                  Delivery
                </button>
              </div>
            </div>

            {/* ZIP Code for Delivery */}
            {orderType === "delivery" && (
              <>
                <label className="mb-2 block text-sm font-medium text-slate-700">Enter ZIP Code</label>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="e.g. 98105"
                  className="mb-4 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm outline-none focus:border-orange-300"
                />

                {zip && (
                  <div
                    className={`mb-4 rounded-xl p-3 text-sm ${
                      isEligible ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-500"
                    }`}
                  >
                    {isEligible
                      ? "Delivery available in your area"
                      : "Delivery not available. Pickup only"}
                  </div>
                )}
              </>
            )}

            {/* Pickup/Delivery Time */}
            <label className="mb-3 block text-sm font-medium text-slate-700">
              {orderType === "pickup" ? "Pickup Time" : "Preferred Time"}
            </label>
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="mb-5 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
            >
              <option>Today • 4:00 PM</option>
              <option>Today • 6:00 PM</option>
              <option>Tomorrow • 10:00 AM</option>
              <option>Tomorrow • 2:00 PM</option>
            </select>

            {/* Cart Items */}
            <div className="space-y-3">
              {cart.length === 0 ? (
                <div className="rounded-2xl bg-orange-50 p-4 text-sm text-slate-600">
                  Your cart is empty. Add pastries to start your order.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-orange-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="text-sm text-slate-500">${item.price} each</div>
                      </div>
                      <div className="text-right font-semibold text-orange-500">
                        ${item.price * item.qty}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeQty(item.id, -1)}
                        className="h-8 w-8 rounded-full border border-orange-200 text-orange-600"
                      >
                        −
                      </button>
                      <div className="min-w-6 text-center text-sm font-semibold">{item.qty}</div>
                      <button
                        type="button"
                        onClick={() => changeQty(item.id, 1)}
                        className="h-8 w-8 rounded-full border border-orange-200 text-orange-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Total */}
            <div className="mt-6 rounded-2xl bg-orange-50 p-4">
              <div className="flex justify-between text-sm text-slate-700">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              {orderType === "delivery" && isEligible && (
                <div className="mt-1 flex justify-between text-sm text-slate-700">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee}</span>
                </div>
              )}
              <div className="mt-3 flex justify-between border-t border-orange-100 pt-3 font-bold text-slate-900">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            {/* Delivery Address */}
            {orderType === "delivery" && (
              <div className="mb-2 mt-6">
                <h4 className="mb-3 text-sm font-semibold text-slate-700">Delivery Address</h4>

                <input
                  type="text"
                  placeholder="Street Address *"
                  value={customerInfo.address}
                  onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                  className="mb-3 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
                />

                <input
                  type="text"
                  placeholder="Apartment, Suite, Unit (optional)"
                  value={customerInfo.apartment}
                  onChange={(e) => handleCustomerInfoChange('apartment', e.target.value)}
                  className="mb-3 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City *"
                    value={customerInfo.city}
                    onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                    className="mb-3 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={customerInfo.state}
                    onChange={(e) => handleCustomerInfoChange('state', e.target.value)}
                    className="mb-3 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
                  />
                </div>

                <textarea
                  placeholder="Delivery instructions (gate code, landmark, etc.)"
                  value={customerInfo.deliveryInstructions}
                  onChange={(e) => handleCustomerInfoChange('deliveryInstructions', e.target.value)}
                  className="mb-4 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
                />
              </div>
            )}

            {/* Payment Method */}
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold text-slate-700">Payment Method</h4>
              <div className="mb-5 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    paymentMethod === "cash"
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-orange-100 bg-white text-slate-700 hover:bg-orange-50"
                  }`}
                >
                  Pay with Cash on Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("zelle")}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    paymentMethod === "zelle"
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-orange-100 bg-white text-slate-700 hover:bg-orange-50"
                  }`}
                >
                  Pay with Zelle
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    paymentMethod === "stripe"
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-orange-100 bg-white text-slate-700 hover:bg-orange-50"
                  }`}
                >
                  Pay with Credit Card
                </button>
              </div>

              {/* Customer Information */}
              <h4 className="mb-3 text-sm font-semibold text-slate-700">Customer Information</h4>

              <input
                type="text"
                placeholder="Full Name *"
                value={customerInfo.fullName}
                onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                className="mb-3 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
              />

              <input
                type="tel"
                placeholder="Phone Number *"
                value={customerInfo.phone}
                onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                className="mb-3 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
              />

              <input
                type="email"
                placeholder="Email Address *"
                value={customerInfo.email}
                onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                className="mb-3 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
              />

              <textarea
                placeholder="Order notes (optional)"
                value={customerInfo.orderNotes}
                onChange={(e) => handleCustomerInfoChange('orderNotes', e.target.value)}
                className="mb-4 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm"
              />
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setShowConfirmation(true)}
              disabled={loading || cart.length === 0}
              className="mt-2 w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Continue to Checkout'}
            </button>

            {/* Order Confirmation */}
            {showConfirmation && cart.length > 0 && (
              <div className="mt-6 rounded-2xl border border-orange-200 bg-white p-5">
                <h3 className="mb-3 text-lg font-bold text-slate-900">Order Summary</h3>

                <div className="mb-3 space-y-1 text-sm text-slate-700">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x{item.qty}</span>
                      <span>${item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-2 border-t pt-2 text-sm text-slate-700">
                  <strong>Order Type:</strong> {orderType}
                </div>
                <div className="mb-2 text-sm text-slate-700">
                  <strong>Payment Method:</strong> {paymentMethod}
                </div>
                <div className="mb-2 text-sm text-slate-700">
                  <strong>Time:</strong> {pickup}
                </div>
                {orderType === "delivery" && zip && (
                  <div className="mb-2 text-sm text-slate-700">
                    <strong>ZIP:</strong> {zip}
                  </div>
                )}
                <div className="mb-2 text-sm text-slate-700">
                  <strong>Customer:</strong> {customerInfo.fullName}
                </div>
                <div className="mb-4 text-base font-bold text-slate-900">Total: ${total}</div>

                <button
                  onClick={saveOrder}
                  disabled={loading}
                  className="w-full rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            )}

            {/* Placed Orders */}
            {placedOrders.length > 0 && (
              <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-slate-900">Recent Orders</h4>
                <div className="space-y-3">
                  {placedOrders.slice(0, 3).map((order) => (
                    <div key={order._id} className="rounded-xl bg-white p-3 text-sm text-slate-700">
                      <div className="font-semibold text-slate-900">Order #{order.orderNumber}</div>
                      <div>{new Date(order.createdAt).toLocaleString()}</div>
                      <div className="mt-1">{order.orderType} • {order.pickup}</div>
                      <div>Status: {order.status}</div>
                      <div>Total: ${order.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-orange-100/60" id="how-it-works">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-2 md:px-10 lg:px-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              Easy ordering for web and mobile
            </h2>
            <p className="mt-4 max-w-xl text-slate-600">
              Customers can browse pastries, choose pickup or delivery, and place their order
              quickly from phone or desktop.
            </p>
          </div>

          <div className="grid gap-4">
            {pickupSteps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-orange-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="pt-2 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16">
        <div className="rounded-[2rem] bg-slate-900 px-8 py-10 text-white shadow-2xl">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
                Fandekitchen • FanDe Liciou$
              </p>
              <h2 className="mt-2 text-3xl font-bold">Fresh pastries worth sharing</h2>
              <p className="mt-4 max-w-xl text-slate-300">
                Start your order today! Fresh baked pastries with convenient pickup and delivery options.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <button
                onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-400"
              >
                Order Now
              </button>
              <button className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-8">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="/images/fandekitchen-mascot-v3.png"
                  alt="Fandekitchen mascot"
                  className="h-14 w-14 rounded-full object-cover object-top border-2 border-orange-400 bg-white"
                />
                <div>
                  <div className="text-lg font-bold">Fandekitchen</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Authentic Philippine flavors, freshly baked with a modern twist.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Contact Us</div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>📞 <a href="tel:2534496728" className="hover:text-orange-400">253 449 6728</a></li>
                <li>✉️ <a href="mailto:fandekitchen@fandelicious.shop" className="hover:text-orange-400">fandekitchen@fandelicious.shop</a></li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Location</div>
              <p className="text-sm text-slate-300">
                2500 SW 336th St Ste A<br />
                Federal Way, WA 98023-3800
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-700 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Fandekitchen. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          amount={total}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentModal(false)}
          customerInfo={customerInfo}
        />
      )}
    </div>
  );
}