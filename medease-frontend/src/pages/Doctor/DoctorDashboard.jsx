import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../../store/slices/appointmentSlice';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appointments, loading } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const todayAppointments = appointments.filter(app => {
    const appointmentDate = new Date(app.appointmentDate);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString() && app.status === 'CONFIRMED';
  });

  const upcomingAppointments = appointments.filter(
    app => new Date(app.appointmentDate) > new Date() && app.status === 'CONFIRMED'
  );

  const completedAppointments = appointments.filter(
    app => app.status === 'COMPLETED'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, Dr. {user?.firstName} {user?.lastName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your appointments and consultations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-blue-600">📅</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{todayAppointments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-green-600">⏰</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingAppointments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-purple-600">✅</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedAppointments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="text-2xl text-yellow-600">💰</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-semibold text-gray-900">₹12,500</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </h3>
                      <p className="text-gray-600">Patient ID: {appointment.patient?.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.appointmentDate).toLocaleTimeString()}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          Notes: {appointment.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {appointment.status}
                      </span>
                      <div>
                        <Link
                          to={`/consultation/${appointment.id}`}
                          className="btn-primary text-sm"
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
              No appointments scheduled for today
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
        </div>
        <div className="p-6">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </h3>
                      <p className="text-gray-600">Patient ID: {appointment.patient?.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                        {new Date(appointment.appointmentDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No upcoming appointments
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
