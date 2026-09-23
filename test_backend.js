/**
 * Automated Verification & Testing Script for Amazon Backend
 */

const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Amazon Backend Automated Test Suite...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ ${name}:`, err.message || err);
    }
  }

  // 1. Health Check
  await test('GET /api/health should return ok', async () => {
    const res = await makeRequest('/api/health');
    if (res.status !== 200 || res.data.status !== 'ok') {
      throw new Error(`Expected 200 ok, got ${res.status}`);
    }
  });

  // 2. Fetch Products
  await test('GET /api/products should return product list', async () => {
    const res = await makeRequest('/api/products');
    if (res.status !== 200 || !Array.isArray(res.data.products)) {
      throw new Error(`Expected products array, got ${JSON.stringify(res.data)}`);
    }
    if (res.data.products.length === 0) {
      throw new Error('Products seed is empty');
    }
  });

  // 3. Categories
  await test('GET /api/products/categories should return categories', async () => {
    const res = await makeRequest('/api/products/categories');
    if (res.status !== 200 || !Array.isArray(res.data.categories)) {
      throw new Error('Failed to get categories');
    }
  });

  // 4. User Registration & Login
  let userToken = '';
  const testEmail = `testuser_${Date.now()}@example.com`;

  await test('POST /api/auth/register should create user and return JWT token', async () => {
    const res = await makeRequest('/api/auth/register', 'POST', {
      name: 'Amazon Tester',
      email: testEmail,
      password: 'testPassword123'
    });
    if (res.status !== 201 || !res.data.token) {
      throw new Error(`Registration failed: ${JSON.stringify(res.data)}`);
    }
    userToken = res.data.token;
  });

  await test('POST /api/auth/login should authenticate user', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: testEmail,
      password: 'testPassword123'
    });
    if (res.status !== 200 || !res.data.token) {
      throw new Error(`Login failed: ${JSON.stringify(res.data)}`);
    }
  });

  // 5. Add to Cart
  await test('POST /api/cart/add should add item to cart', async () => {
    const res = await makeRequest('/api/cart/add', 'POST', {
      productId: 'prod-1',
      quantity: 2
    }, {
      'Authorization': `Bearer ${userToken}`
    });
    if (res.status !== 200 || !res.data.success) {
      throw new Error(`Add to cart failed: ${JSON.stringify(res.data)}`);
    }
  });

  // 6. Get Cart
  await test('GET /api/cart should return user cart details', async () => {
    const res = await makeRequest('/api/cart', 'GET', null, {
      'Authorization': `Bearer ${userToken}`
    });
    if (res.status !== 200 || res.data.totalItems !== 2) {
      throw new Error(`Cart state mismatch: ${JSON.stringify(res.data)}`);
    }
  });

  // 7. Create Order
  await test('POST /api/orders should create order', async () => {
    const res = await makeRequest('/api/orders', 'POST', {
      items: [{ productId: 'prod-1', quantity: 2 }],
      shippingAddress: { address: '123 Tech Park', city: 'Mumbai', pincode: '400001' }
    }, {
      'Authorization': `Bearer ${userToken}`
    });
    if (res.status !== 201 || !res.data.order) {
      throw new Error(`Order creation failed: ${JSON.stringify(res.data)}`);
    }
  });

  // 8. Payment Intent
  await test('POST /api/payments/create-intent should generate payment client secret', async () => {
    const res = await makeRequest('/api/payments/create-intent', 'POST', { amount: 143998 });
    if (res.status !== 200 || !res.data.clientSecret) {
      throw new Error(`Payment intent failed: ${JSON.stringify(res.data)}`);
    }
  });

  console.log(`\n🎉 Test Suite Completed: ${passed}/${total} tests passed!`);
  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
