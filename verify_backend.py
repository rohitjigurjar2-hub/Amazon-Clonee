import urllib.request
import json

base_url = "http://localhost:5000"

def test_get(endpoint):
    req = urllib.request.Request(f"{base_url}{endpoint}")
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f"SUCCESS: GET {endpoint} -> Status {resp.status}")
        return data

def test_post(endpoint, payload):
    data_bytes = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(f"{base_url}{endpoint}", data=data_bytes, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f"SUCCESS: POST {endpoint} -> Status {resp.status}")
        return data

try:
    print("--- Testing Amazon Backend Endpoints ---")
    health = test_get("/api/health")
    print("Health response:", health)

    products = test_get("/api/products")
    print(f"Found {products.get('count')} products in catalog.")

    categories = test_get("/api/products/categories")
    print("Categories:", categories.get("categories"))

    # Test Registration
    reg = test_post("/api/auth/register", {"name": "Test Customer", "email": "test@amazon.com", "password": "pass123", "address": "123 Main St"})
    print("Registration response:", reg.get("message"))

    # Test Cart
    cart = test_post("/api/cart/add", {"productId": "prod-1", "quantity": 2})
    print("Cart response:", cart.get("message"))

    # Test Order
    order = test_post("/api/orders", {"items": [{"productId": "prod-1", "quantity": 2}]})
    print("Order response:", order.get("message"), "Order ID:", order.get("order", {}).get("id"))

    print("\nALL BACKEND API ENDPOINTS VERIFIED SUCCESSFULLY!")

except Exception as e:
    print("API Test Error:", e)
