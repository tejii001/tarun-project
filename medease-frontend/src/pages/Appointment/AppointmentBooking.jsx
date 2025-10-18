import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment } from '../../store/slices/appointmentSlice';
import appointmentService from '../../services/appointmentService';

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
  });
  
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading: appointmentLoading, error } = useSelector((state) => state.appointments);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await appointmentService.getDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    
    try {
      const response = await appointmentService.getAvailableSlots(doctorId, date);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'doctorId' || name === 'appointmentDate') {
      fetchAvailableSlots(
        name === 'doctorId' ? value : formData.doctorId,
        name === 'appointmentDate' ? value : formData.appointmentDate
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const appointmentData = {
        ...formData,
        patientId: user.id,
        appointmentDateTime: new Date(`${formData.appointmentDate}T${formData.appointmentTime}`),
      };
      
      const result = await dispatch(createAppointment(appointmentData));
      if (result.payload) {
        alert('Appointment booked successfully!');
        setFormData({
          doctorId: '',
          appointmentDate: '',
          appointmentTime: '',
          notes: '',
        });
        setStep(1);
      }
    } catch (error) {
      console.error('Failed to book appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && formData.doctorId) {
      setStep(2);
    } else if (step === 2 && formData.appointmentDate) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h1>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Select Doctor</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Choose Date</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Confirm</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Select a Doctor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.doctorId === doctor.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, doctorId: doctor.id })}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-gray-600">{doctor.specialization}</p>
                        <p className="text-sm text-gray-500">{doctor.experience} years experience</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.doctorId}
                  className="btn-primary"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Choose Date and Time */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Choose Date and Time</h2>
              
              <div>
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                  Select Date
                </label>
                <input
                  id="appointmentDate"
                  name="appointmentDate"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field mt-1"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                />
              </div>

              {availableSlots.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`p-2 text-sm rounded border transition-colors ${
                          formData.appointmentTime === slot
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData({ ...formData, appointmentTime: slot })}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.appointmentDate || !formData.appointmentTime}
                  className="btn-primary"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm Appointment */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Appointment</h2>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Appointment Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Doctor:</span> Dr. {
                    doctors.find(d => d.id === formData.doctorId)?.firstName
                  } {
                    doctors.find(d => d.id === formData.doctorId)?.lastName
                  }</p>
                  <p><span className="font-medium">Specialization:</span> {
                    doctors.find(d => d.id === formData.doctorId)?.specialization
                  }</p>
                  <p><span className="font-medium">Date:</span> {
                    new Date(formData.appointmentDate).toLocaleDateString()
                  }</p>
                  <p><span className="font-medium">Time:</span> {formData.appointmentTime}</p>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="input-field mt-1"
                  placeholder="Any specific concerns or symptoms you'd like to discuss..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading || appointmentLoading}
                  className="btn-primary"
                >
                  {loading || appointmentLoading ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AppointmentBooking;
