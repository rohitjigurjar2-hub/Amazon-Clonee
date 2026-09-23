function errorHandler(err, req, res, next) {
  console.error('❌ Server Error:', err.stack || err.message);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}

function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Route not found - ${req.originalUrl}`
  });
}

module.exports = {
  errorHandler,
  notFound
};
