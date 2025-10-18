import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PatientDashboard from './pages/Patient/PatientDashboard';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import AppointmentBooking from './pages/Appointment/AppointmentBooking';
import Consultation from './pages/Consultation/Consultation';
import Payment from './pages/Payment/Payment';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<Navigate to="/login" replace />} />
                <Route path="patient" element={<Layout><PatientDashboard /></Layout>} />
                <Route path="doctor" element={<Layout><DoctorDashboard /></Layout>} />
                <Route path="appointment" element={<Layout><AppointmentBooking /></Layout>} />
                <Route path="consultation/:id" element={<Layout><Consultation /></Layout>} />
                <Route path="payment/:appointmentId" element={<Layout><Payment /></Layout>} />
              </Route>
              
              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default App;