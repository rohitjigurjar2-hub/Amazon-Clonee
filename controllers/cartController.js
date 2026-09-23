const { getDb, saveDb } = require('../config/db');

function getCartKey(req) {
  return req.user ? req.user.id : (req.headers['x-session-id'] || 'guest-session');
}

function getCart(req, res) {
  const db = getDb();
  const cartKey = getCartKey(req);
  const userCart = db.cart[cartKey] || [];

  // Populate product info for each cart item
  const detailedItems = userCart.map(item => {
    const product = db.products.find(p => p.id === item.productId);
    return {
      productId: item.productId,
      quantity: item.quantity,
      product: product || null
    };
  }).filter(item => item.product !== null);

  const subtotal = detailedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalItems = detailedItems.reduce((sum, item) => sum + item.quantity, 0);

  res.json({
    success: true,
    cartKey,
    totalItems,
    subtotal,
    items: detailedItems
  });
}

function addToCart(req, res) {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, error: 'Product ID is required.' });
  }

  const db = getDb();
  const product = db.products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  const cartKey = getCartKey(req);
  if (!db.cart[cartKey]) {
    db.cart[cartKey] = [];
  }

  const qty = parseInt(quantity) || 1;
  const existingItemIndex = db.cart[cartKey].findIndex(item => item.productId === productId);

  if (existingItemIndex > -1) {
    db.cart[cartKey][existingItemIndex].quantity += qty;
  } else {
    db.cart[cartKey].push({ productId, quantity: qty, addedAt: new Date().toISOString() });
  }

  saveDb(db);

  res.json({
    success: true,
    message: 'Item added to cart',
    cart: db.cart[cartKey]
  });
}

function updateCartItem(req, res) {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ success: false, error: 'productId and quantity are required.' });
  }

  const db = getDb();
  const cartKey = getCartKey(req);
  const userCart = db.cart[cartKey] || [];

  const qty = parseInt(quantity);
  if (qty <= 0) {
    db.cart[cartKey] = userCart.filter(item => item.productId !== productId);
  } else {
    const item = userCart.find(i => i.productId === productId);
    if (item) {
      item.quantity = qty;
    }
  }

  saveDb(db);

  res.json({
    success: true,
    message: 'Cart updated successfully',
    cart: db.cart[cartKey]
  });
}

function removeFromCart(req, res) {
  const { productId } = req.params;
  const db = getDb();
  const cartKey = getCartKey(req);

  if (db.cart[cartKey]) {
    db.cart[cartKey] = db.cart[cartKey].filter(item => item.productId !== productId);
    saveDb(db);
  }

  res.json({
    success: true,
    message: 'Item removed from cart'
  });
}

function clearCart(req, res) {
  const db = getDb();
  const cartKey = getCartKey(req);

  db.cart[cartKey] = [];
  saveDb(db);

  res.json({
    success: true,
    message: 'Cart cleared successfully'
  });
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
