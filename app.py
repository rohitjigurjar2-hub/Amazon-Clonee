"""
Amazon Clone REST API Backend Server (Python Flask Implementation)
Production ready for Render deployment with Gunicorn and Flask-CORS.
"""

import os
import json
import time
from datetime import datetime

try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    HAS_FLASK = True
except ImportError:
    HAS_FLASK = False

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DB_FILE = os.path.join(DATA_DIR, "db.json")
SEED_FILE = os.path.join(DATA_DIR, "productsSeed.json")

def load_db():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DB_FILE):
        products = []
        if os.path.exists(SEED_FILE):
            with open(SEED_FILE, "r", encoding="utf-8") as f:
                products = json.load(f)
        initial = {"users": [], "products": products, "cart": {}, "orders": []}
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(initial, f, indent=2)
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(db):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)

if HAS_FLASK:
    app = Flask(__name__)
    CORS(app)

    @app.route("/", methods=["GET"])
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "ok",
            "service": "Amazon Clone Python Backend",
            "timestamp": datetime.now().isoformat()
        })

    @app.route("/api/products", methods=["GET"])
    def get_products():
        db = load_db()
        products = list(db["products"])
        cat = request.args.get("category")
        search = request.args.get("search")

        if cat and cat != "all":
            products = [p for p in products if cat.lower() in p["category"].lower()]
        if search:
            q = search.lower()
            products = [p for p in products if q in p["title"].lower() or q in p["description"].lower()]

        return jsonify({"success": True, "count": len(products), "products": products})

    @app.route("/api/products/categories", methods=["GET"])
    def get_categories():
        db = load_db()
        cats = list(set(p["category"] for p in db["products"]))
        return jsonify({"success": True, "categories": cats})

    @app.route("/api/products/<productId>", methods=["GET"])
    def get_product_by_id(productId):
        db = load_db()
        prod = next((p for p in db["products"] if p["id"] == productId), None)
        if prod:
            return jsonify({"success": True, "product": prod})
        return jsonify({"success": False, "error": "Product not found"}), 404

    @app.route("/api/auth/register", methods=["POST"])
    def register():
        body = request.get_json() or {}
        email = body.get("email", "").strip().lower()
        if not email or not body.get("password"):
            return jsonify({"success": False, "error": "Email and password required"}), 400
        
        db = load_db()
        if any(u["email"] == email for u in db["users"]):
            return jsonify({"success": False, "error": "User already exists"}), 400
        
        user = {
            "id": f"user-{int(time.time()*1000)}",
            "name": body.get("name", "Customer"),
            "email": email,
            "address": body.get("address", "")
        }
        db["users"].append(user)
        save_db(db)
        return jsonify({"success": True, "message": "Registered successfully", "user": user, "token": f"token-{user['id']}"}), 201

    @app.route("/api/auth/login", methods=["POST"])
    def login():
        body = request.get_json() or {}
        email = body.get("email", "").strip().lower()
        db = load_db()
        user = next((u for u in db["users"] if u["email"] == email), None)
        if user:
            return jsonify({"success": True, "message": "Logged in successfully", "user": user, "token": f"token-{user['id']}"})
        return jsonify({"success": False, "error": "Invalid email or password"}), 401

    @app.route("/api/cart", methods=["GET"])
    def get_cart():
        session_id = request.headers.get("x-session-id", "guest-session")
        db = load_db()
        cart_items = db["cart"].get(session_id, [])
        detailed = []
        subtotal = 0
        for item in cart_items:
            p = next((prod for prod in db["products"] if prod["id"] == item["productId"]), None)
            if p:
                detailed.append({"productId": item["productId"], "quantity": item["quantity"], "product": p})
                subtotal += p["price"] * item["quantity"]
        return jsonify({
            "success": True,
            "subtotal": subtotal,
            "totalItems": sum(i["quantity"] for i in detailed),
            "items": detailed
        })

    @app.route("/api/cart/add", methods=["POST"])
    def add_to_cart():
        body = request.get_json() or {}
        pid = body.get("productId")
        session_id = request.headers.get("x-session-id", "guest-session")
        db = load_db()
        if session_id not in db["cart"]:
            db["cart"][session_id] = []
        items = db["cart"][session_id]
        existing = next((i for i in items if i["productId"] == pid), None)
        qty = int(body.get("quantity", 1))
        if existing:
            existing["quantity"] += qty
        else:
            items.append({"productId": pid, "quantity": qty})
        save_db(db)
        return jsonify({"success": True, "message": "Item added to cart", "cart": items})

    @app.route("/api/orders", methods=["POST"])
    def create_order():
        body = request.get_json() or {}
        items = body.get("items", [])
        db = load_db()
        order_items = []
        subtotal = 0
        for item in items:
            p = next((prod for prod in db["products"] if prod["id"] == item["productId"]), None)
            if p:
                tot = p["price"] * item.get("quantity", 1)
                subtotal += tot
                order_items.append({"productId": p["id"], "title": p["title"], "price": p["price"], "quantity": item.get("quantity", 1), "total": tot})
        tax = int(subtotal * 0.18)
        new_order = {
            "id": f"order-{int(time.time()*1000)}",
            "items": order_items,
            "subtotal": subtotal,
            "tax": tax,
            "totalAmount": subtotal + tax,
            "paymentStatus": "PAID",
            "orderStatus": "CONFIRMED",
            "createdAt": datetime.now().isoformat()
        }
        db["orders"].insert(0, new_order)
        save_db(db)
        return jsonify({"success": True, "message": "Order placed successfully", "order": new_order}), 201

    @app.route("/api/payments/create-intent", methods=["POST"])
    def create_payment_intent():
        return jsonify({"success": True, "clientSecret": f"pi_secret_{int(time.time())}", "status": "succeeded"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    if HAS_FLASK:
        app.run(host="0.0.0.0", port=port)
    else:
        import http.server, socketserver, urllib.parse
        class SimpleHandler(http.server.BaseHTTPRequestHandler):
            def do_GET(self):
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                db = load_db()
                self.wfile.write(json.dumps({"status": "ok", "service": "Amazon Python Backend", "products": db["products"]}).encode())
        server = socketserver.TCPServer(("", port), SimpleHandler)
        print(f"Server running on port {port}")
        server.serve_forever()
