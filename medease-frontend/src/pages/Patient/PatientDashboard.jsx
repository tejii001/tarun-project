import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../../store/slices/appointmentSlice';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appointments, loading } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const upcomingAppointments = appointments.filter(
    app => new Date(app.appointmentDate) > new Date() && app.status === 'CONFIRMED'
  );

  const pastAppointments = appointments.filter(
    app => new Date(app.appointmentDate) < new Date()
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your medical appointment overview
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/appointment"
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg p-6 text-center transition-colors"
        >
          <div className="text-3xl mb-2">📅</div>
          <h3 className="text-lg font-semibold">Book Appointment</h3>
          <p className="text-sm opacity-90">Schedule a new consultation</p>
        </Link>
        
        <div className="bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg p-6 text-center transition-colors cursor-pointer">
          <div className="text-3xl mb-2">💊</div>
          <h3 className="text-lg font-semibold">Prescriptions</h3>
          <p className="text-sm opacity-90">View your prescriptions</p>
        </div>
        
        <div className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 text-center transition-colors cursor-pointer">
          <div className="text-3xl mb-2">📋</div>
          <h3 className="text-lg font-semibold">Medical Records</h3>
          <p className="text-sm opacity-90">Access your health history</p>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      </h3>
                      <p className="text-gray-600">{appointment.doctor?.specialization}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                        {new Date(appointment.appointmentDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {appointment.status}
                      </span>
                      <div className="mt-2">
                        <Link
                          to={`/consultation/${appointment.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Start Consultation
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No upcoming appointments. <Link to="/appointment" className="text-primary-600 hover:text-primary-700">Book one now</Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Appointments</h2>
        </div>
        <div className="p-6">
          {pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      </h3>
                      <p className="text-gray-600">{appointment.doctor?.specialization}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                        {new Date(appointment.appointmentDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent appointments
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
