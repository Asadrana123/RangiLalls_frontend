import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import api from "../Utils/axios";
import Captcha from "../Components/Login/Captcha";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    captcha: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    
    // Clear errors for this field if any
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    
    // Uncomment if you want to use captcha
    // if (!formData.captcha) newErrors.captcha = "Captcha is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCaptchaChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      captcha: value,
    }));
    if (errors.captcha) {
      setErrors((prev) => ({
        ...prev,
        captcha: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await api.post("/auth/forgot-password", {
        email: formData.email,
      });
      
      setMessage("Password reset instructions sent to your email");

    } catch (err) {
      console.error("Forgot password error:", err);
      
      if (err.response?.data?.error) {
        // If error is an object with properties
        if (typeof err.response.data.error === 'object') {
          setErrors(err.response.data.error);
        } 
        // If error is a string
        else if (typeof err.response.data.error === 'string') {
          setErrors({ general: err.response.data.error });
        }
      } else {
        // Generic error handling
        setErrors({ general: "An error occurred. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 min-h-screen flex justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold">
            <span className="text-primary">FORGOT</span>
            <span className="text-gray-800"> PASSWORD</span>
          </h2>
        </div>

        {errors?.general && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {errors?.general}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm">
            {message}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter email"
            />
          </div>
          {errors?.email && (
            <p className="mt-1 text-xs text-red-500">{errors?.email}</p>
          )}
          
          {/* Captcha Section - Uncomment if you want to use captcha */}
          {/* <div className="space-y-2">
            <div className="border border-gray-300 rounded-md p-2">
              <Captcha onChange={handleCaptchaChange} />
            </div>
          </div>
          {errors?.captcha && (
            <p className="mt-1 text-xs text-red-500">{errors?.captcha}</p>
          )} */}
          
          {/* Submit Button */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-primary text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;