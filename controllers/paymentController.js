function createPaymentIntent(req, res) {
  const { amount, currency } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, error: 'Amount is required.' });
  }

  const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2, 10)}`;

  res.json({
    success: true,
    clientSecret,
    amount,
    currency: currency || 'INR',
    status: 'requires_payment_method',
    message: 'Payment intent created successfully'
  });
}

function verifyPayment(req, res) {
  const { paymentIntentId } = req.body;

  res.json({
    success: true,
    paymentIntentId,
    status: 'succeeded',
    message: 'Payment verified successfully'
  });
}

module.exports = {
  createPaymentIntent,
  verifyPayment
};
