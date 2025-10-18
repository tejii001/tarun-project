import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">MEDEASE</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.role === 'PATIENT' && (
                <>
                  <Link
                    to="/patient"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/patient') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/appointment"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/appointment') 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Book Appointment
                  </Link>
                </>
              )}
              
              {user?.role === 'DOCTOR' && (
                <Link
                  to="/doctor"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/doctor') 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
