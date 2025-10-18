import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import appointmentService from '../../services/appointmentService';

const Payment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [paymentStatus, setPaymentStatus] = useState('pending');

  useEffect(() => {
    fetchAppointmentDetails();
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(response.data);
    } catch (error) {
      console.error('Failed to fetch appointment details:', error);
    }
  };

  const handlePayment = async () => {
    if (!appointment) return;
    
    setLoading(true);
    
    try {
      const amount = 500; // Consultation fee
      const response = await paymentService.createPayment(appointmentId, amount);
      
      if (paymentMethod === 'razorpay') {
        // Initialize Razorpay
        const options = {
          key: 'rzp_test_your_key_here', // Replace with actual Razorpay key
          amount: amount * 100, // Amount in paise
          currency: 'INR',
          name: 'MEDEASE',
          description: 'Medical Consultation Payment',
          order_id: response.data.orderId,
          handler: async function (response) {
            try {
              await paymentService.verifyPayment(response.razorpay_payment_id, response.razorpay_signature);
              setPaymentStatus('success');
              alert('Payment successful!');
              navigate('/patient');
            } catch (error) {
              console.error('Payment verification failed:', error);
              setPaymentStatus('failed');
            }
          },
          prefill: {
            name: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
            email: appointment.patient.email,
            contact: appointment.patient.phone,
          },
          theme: {
            color: '#3b82f6',
          },
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading appointment details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment</h1>
        
        {/* Appointment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Doctor:</span>
              <span className="font-medium">
                Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Specialization:</span>
              <span className="font-medium">{appointment.doctor.specialization}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date(appointment.appointmentDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">
                {new Date(appointment.appointmentDate).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Patient:</span>
              <span className="font-medium">
                {appointment.patient.firstName} {appointment.patient.lastName}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-primary-600"
              />
              <div className="flex items-center space-x-2">
                <img src="/razorpay-logo.png" alt="Razorpay" className="h-6" />
                <span>Razorpay (Cards, UPI, Net Banking)</span>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-primary-600"
              />
              <div className="flex items-center space-x-2">
                <img src="/stripe-logo.png" alt="Stripe" className="h-6" />
                <span>Stripe (Cards, Apple Pay, Google Pay)</span>
              </div>
            </label>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Consultation Fee:</span>
              <span className="font-medium">₹500.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee:</span>
              <span className="font-medium">₹0.00</span>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>₹500.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus === 'success' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            ✅ Payment successful! Your appointment is confirmed.
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            ❌ Payment failed. Please try again.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/patient')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading || paymentStatus === 'success'}
            className="btn-primary"
          >
            {loading ? 'Processing...' : 'Pay ₹500.00'}
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Your payment is secure and encrypted</p>
          <p>We use industry-standard security measures to protect your information</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
