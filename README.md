# 🛒 Amazon Clone Backend API Server

A production-ready REST API backend for the **Amazon Clone** application (`https://amazon-frontend-1-8hxv.onrender.com/`).

Supports both **Node.js / Express** and **Python** runtime environments for maximum flexibility and seamless zero-setup local/cloud deployment.

---

## 🚀 Quick Start

### Option A: Run with Python (Zero Setup Required)
```bash
python app.py
```
*Server will start instantly at `http://localhost:5000`.*

### Option B: Run with Node.js & Express
```bash
npm install
npm start
```
*or in development mode:*
```bash
npm run dev
```

---

## 📡 REST API Documentation

### 1. Health & Status
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root API documentation overview |
| `GET` | `/api/health` | Server uptime & status check |

### 2. User Authentication (`/api/auth`)
| Method | Endpoint | Payload / Params | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ "name", "email", "password", "address" }` | Register new user account |
| `POST` | `/api/auth/login` | `{ "email", "password" }` | Login & receive JWT token |
| `GET` | `/api/auth/profile` | `Header: Authorization: Bearer <token>` | Get user profile details |
| `PUT` | `/api/auth/profile` | `{ "name", "address" }` | Update profile information |

### 3. Products & Catalog (`/api/products`)
| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/products` | `?category=...&search=...&minPrice=...&maxPrice=...&sort=...` | List all products with filtering |
| `GET` | `/api/products/categories` | None | Fetch all product departments |
| `GET` | `/api/products/:id` | None | Fetch detailed product specifications |
| `POST` | `/api/products` | `{ "title", "category", "price", "description", "image" }` | Add new product to catalog |

### 4. Shopping Cart (`/api/cart`)
| Method | Endpoint | Headers / Payload | Description |
|---|---|---|---|
| `GET` | `/api/cart` | `Header: x-session-id` or `Authorization` | Get cart items & subtotal |
| `POST` | `/api/cart/add` | `{ "productId", "quantity" }` | Add product to cart |
| `PUT` | `/api/cart/update` | `{ "productId", "quantity" }` | Update item quantity |
| `DELETE` | `/api/cart/remove/:id`| None | Remove single item from cart |
| `DELETE` | `/api/cart/clear` | None | Clear entire shopping cart |

### 5. Orders & Checkout (`/api/orders`)
| Method | Endpoint | Payload / Headers | Description |
|---|---|---|---|
| `POST` | `/api/orders` | `{ "items": [...], "shippingAddress": {...} }` | Place order & calculate total |
| `GET` | `/api/orders/my-orders` | `Header: Authorization: Bearer <token>` | Fetch user order history |
| `GET` | `/api/orders/:id` | None | Fetch single order receipt |

### 6. Payments (`/api/payments`)
| Method | Endpoint | Payload | Description |
|---|---|---|---|
| `POST` | `/api/payments/create-intent` | `{ "amount", "currency" }` | Generate Stripe/Mock payment client secret |
| `POST` | `/api/payments/verify` | `{ "paymentIntentId" }` | Verify payment status |

---

## 📂 Project Structure

```
project/
├── app.py                  # Dual Python backend implementation (Zero-dep)
├── server.js               # Node.js Express server entry point
├── package.json            # Node.js dependencies & scripts
├── render.yaml             # Render deployment configuration
├── .env.example            # Environment variables template
├── test_backend.js         # Automated test suite (Node.js)
├── verify_backend.py       # Automated test suite (Python)
├── config/
│   └── db.js               # Database persistent engine & seed handler
├── controllers/
│   ├── authController.js   # User registration & JWT auth logic
│   ├── productController.js# Product listing, search & category logic
│   ├── cartController.js   # Cart CRUD logic
│   ├── orderController.js  # Order creation & tax/shipping calculation
│   └── paymentController.js# Payment processing stub
├── routes/
│   ├── authRoutes.js       # Express Auth routes
│   ├── productRoutes.js    # Express Product routes
│   ├── cartRoutes.js       # Express Cart routes
│   ├── orderRoutes.js      # Express Order routes
│   └── paymentRoutes.js    # Express Payment routes
├── middleware/
│   ├── authMiddleware.js   # JWT authentication middleware
│   └── errorMiddleware.js  # Global error & 404 handler
└── data/
    ├── productsSeed.json   # Seed catalog matching Amazon India frontend
    └── db.json             # Persistent JSON database store
```

---

## 🌐 Deploying to Render

1. Push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New Web Service**.
3. Select this repository. Render will automatically detect `render.yaml` or you can configure:
   - **Environment**: Node / Python
   - **Build Command**: `npm install` (Node) or `pip install -r requirements.txt` (Python)
   - **Start Command**: `node server.js` or `python app.py`
4. Set environment variable `PORT` (e.g. `10000` or `5000`).
5. Render will deploy your live API endpoint!

---

## 🔗 Connecting to Frontend (`https://amazon-frontend-1-8hxv.onrender.com`)

In your React frontend code or Axios setup:
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`);
  return response.data;
};
```
