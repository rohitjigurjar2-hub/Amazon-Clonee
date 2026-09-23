const { getDb, saveDb } = require('../config/db');

function createOrder(req, res) {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Order must contain at least one item.' });
  }

  const db = getDb();
  const userId = req.user ? req.user.id : 'guest-user';
  const cartKey = req.user ? req.user.id : (req.headers['x-session-id'] || 'guest-session');

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ success: false, error: `Product ${item.productId} not found.` });
    }

    const qty = parseInt(item.quantity) || 1;
    const itemTotal = product.price * qty;
    subtotal += itemTotal;

    orderItems.push({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: qty,
      total: itemTotal
    });
  }

  const tax = Math.round(subtotal * 0.18); // 18% GST / Tax
  const shippingFee = subtotal > 499 ? 0 : 40; // Free shipping over 499
  const totalAmount = subtotal + tax + shippingFee;

  const newOrder = {
    id: `order-${Date.now()}`,
    userId,
    customerName: req.user ? req.user.name : (shippingAddress?.fullName || 'Amazon Customer'),
    customerEmail: req.user ? req.user.email : (shippingAddress?.email || 'customer@example.com'),
    items: orderItems,
    shippingAddress: shippingAddress || { address: 'Standard Delivery Address', city: 'New Delhi', pincode: '110001' },
    paymentMethod: paymentMethod || 'Amazon Pay / Card',
    paymentStatus: 'PAID',
    orderStatus: 'CONFIRMED',
    deliveryEstimated: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' }),
    subtotal,
    tax,
    shippingFee,
    totalAmount,
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Clear user cart after placing order
  db.cart[cartKey] = [];
  saveDb(db);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order: newOrder
  });
}

function getMyOrders(req, res) {
  const db = getDb();
  const userId = req.user ? req.user.id : 'guest-user';
  const userOrders = db.orders.filter(o => o.userId === userId);

  res.json({
    success: true,
    count: userOrders.length,
    orders: userOrders
  });
}

function getOrderById(req, res) {
  const db = getDb();
  const order = db.orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }

  res.json({
    success: true,
    order
  });
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
