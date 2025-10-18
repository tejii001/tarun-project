import api from './api';

const consultationService = {
  getConsultations: async () => {
    return await api.get('/consultations');
  },

  getConsultationById: async (id) => {
    return await api.get(`/consultations/${id}`);
  },

  startConsultation: async (appointmentId) => {
    return await api.post('/consultations', { appointmentId });
  },

  endConsultation: async (consultationId) => {
    return await api.put(`/consultations/${consultationId}/end`);
  },

  sendMessage: async (consultationId, message) => {
    return await api.post(`/consultations/${consultationId}/messages`, { message });
  },

  getMessages: async (consultationId) => {
    return await api.get(`/consultations/${consultationId}/messages`);
  },
};

export default consultationService;
