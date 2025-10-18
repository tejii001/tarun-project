// Environment configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_your_key_here',
  STRIPE_KEY: import.meta.env.VITE_STRIPE_KEY || 'pk_test_your_stripe_key_here',
};
