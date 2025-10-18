import api from './api';

const appointmentService = {
  getAppointments: async () => {
    return await api.get('/appointments');
  },

  getAppointmentById: async (id) => {
    return await api.get(`/appointments/${id}`);
  },

  createAppointment: async (appointmentData) => {
    return await api.post('/appointments', appointmentData);
  },

  updateAppointment: async (id, appointmentData) => {
    return await api.put(`/appointments/${id}`, appointmentData);
  },

  cancelAppointment: async (id) => {
    return await api.delete(`/appointments/${id}`);
  },

  getAvailableSlots: async (doctorId, date) => {
    return await api.get(`/appointments/available-slots`, {
      params: { doctorId, date }
    });
  },

  getDoctors: async () => {
    return await api.get('/appointments/doctors');
  },
};

export default appointmentService;
