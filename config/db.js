const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');
const SEED_FILE = path.join(__dirname, '..', 'data', 'productsSeed.json');

// Initial schema structure
const DEFAULT_DATA = {
  users: [],
  products: [],
  cart: {},     // { userId: [ { productId, quantity, addedAt } ] }
  orders: []    // [ { id, userId, items, shippingAddress, totalAmount, paymentStatus, orderStatus, createdAt } ]
};

function ensureDbExists() {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    let initialProducts = [];
    if (fs.existsSync(SEED_FILE)) {
      try {
        const seedRaw = fs.readFileSync(SEED_FILE, 'utf8');
        initialProducts = JSON.parse(seedRaw);
      } catch (err) {
        console.error('Failed to read seed products:', err);
      }
    }
    const initialDb = { ...DEFAULT_DATA, products: initialProducts };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf8');
    console.log('✅ Initialized new DB with seed data.');
  }
}

function getDb() {
  ensureDbExists();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const data = JSON.parse(raw);
    return {
      users: data.users || [],
      products: data.products || [],
      cart: data.cart || {},
      orders: data.orders || []
    };
  } catch (err) {
    console.error('Error reading db.json:', err);
    return DEFAULT_DATA;
  }
}

function saveDb(data) {
  ensureDbExists();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

module.exports = {
  getDb,
  saveDb,
  ensureDbExists
};
