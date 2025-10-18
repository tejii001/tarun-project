import api from './api';

const paymentService = {
  createPayment: async (appointmentId, amount) => {
    return await api.post('/payments/create', { appointmentId, amount });
  },

  verifyPayment: async (paymentId, signature) => {
    return await api.post('/payments/verify', { paymentId, signature });
  },

  getPaymentHistory: async () => {
    return await api.get('/payments/history');
  },

  processRefund: async (paymentId, amount) => {
    return await api.post('/payments/refund', { paymentId, amount });
  },
};

export default paymentService;
