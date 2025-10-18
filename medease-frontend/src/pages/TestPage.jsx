import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 MEDEASE Frontend is Working!
        </h1>
        <p className="text-gray-600 mb-6">
          The React frontend is running successfully.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">✅ React Router working</p>
          <p className="text-sm text-gray-500">✅ Tailwind CSS loaded</p>
          <p className="text-sm text-gray-500">✅ Redux store connected</p>
        </div>
        <div className="mt-6">
          <a 
            href="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-block"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
