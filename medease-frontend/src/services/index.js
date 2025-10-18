// Test file to verify imports work
import consultationService from './consultationService';
import appointmentService from './appointmentService';
import authService from './authService';
import paymentService from './paymentService';

console.log('All services imported successfully:', {
  consultationService: !!consultationService,
  appointmentService: !!appointmentService,
  authService: !!authService,
  paymentService: !!paymentService
});

export { consultationService, appointmentService, authService, paymentService };
