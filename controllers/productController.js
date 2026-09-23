const { getDb, saveDb } = require('../config/db');

function getAllProducts(req, res) {
  const db = getDb();
  let products = [...db.products];

  const { category, search, minPrice, maxPrice, sort, featured } = req.query;

  // Filter by category
  if (category && category !== 'all') {
    products = products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }

  // Filter by search term
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    );
  }

  // Filter by featured
  if (featured === 'true') {
    products = products.filter(p => p.isFeatured === true);
  }

  // Filter by price range
  if (minPrice) {
    products = products.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= parseFloat(maxPrice));
  }

  // Sorting
  if (sort === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  }

  res.json({
    success: true,
    count: products.length,
    products
  });
}

function getProductById(req, res) {
  const db = getDb();
  const product = db.products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  res.json({
    success: true,
    product
  });
}

function getCategories(req, res) {
  const db = getDb();
  const categoriesSet = new Set(db.products.map(p => p.category));
  const categories = Array.from(categoriesSet);

  res.json({
    success: true,
    categories
  });
}

function createProduct(req, res) {
  const { title, category, price, originalPrice, description, image, brand, stock, isFeatured } = req.body;

  if (!title || !category || !price) {
    return res.status(400).json({ success: false, error: 'Please provide title, category, and price.' });
  }

  const db = getDb();
  const newProduct = {
    id: `prod-${Date.now()}`,
    title,
    category,
    price: parseFloat(price),
    originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
    discountPercent: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
    rating: 4.5,
    reviewsCount: 0,
    image: image || 'https://m.media-amazon.com/images/I/71657TiFeHL._AC_UL480_QL65_.jpg',
    description: description || '',
    stock: stock ? parseInt(stock) : 20,
    isFeatured: isFeatured === true || isFeatured === 'true',
    brand: brand || 'Generic'
  };

  db.products.unshift(newProduct);
  saveDb(db);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product: newProduct
  });
}

module.exports = {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct
};
