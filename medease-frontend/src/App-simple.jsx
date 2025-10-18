import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import TestPage from './pages/TestPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <div className="App">
            <Routes>
              {/* Test Route */}
              <Route path="/test" element={<TestPage />} />
              
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Default redirect to test page */}
              <Route path="/" element={<Navigate to="/test" replace />} />
              <Route path="*" element={<Navigate to="/test" replace />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
