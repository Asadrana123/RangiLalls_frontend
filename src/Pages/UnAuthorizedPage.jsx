// src/pages/UnauthorizedPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 mt-20">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center mt-20">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>
        <Link to="/" className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:text-white">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;