// src/components/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../Utils/axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  useEffect(() => {
    const controller = new AbortController();
  
    if (status === 'success') return;  // ✅ Prevent extra requests
  
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`, {
          signal: controller.signal, // ✅ Abort request if component unmounts
        });
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        if (error.name !== 'AbortError') { 
          setStatus('error');
          setMessage(error.response?.data?.error || 'Verification failed');
        }
      }
    };
  
    verifyEmail();
  
    return () => controller.abort(); // ✅ Cleanup on unmount
  }, []);
  

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md mt-24">
      {status === 'verifying' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Verifying your email...</h2>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Email Verified!</h2>
          <p className="mb-6">{message}</p>
          <Link 
            to="/login" 
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
          >
            Proceed to Login
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Verification Failed</h2>
          <p className="mb-6">{message}</p>
          <Link 
            to="/register" 
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
          >
            Back to Registration
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;