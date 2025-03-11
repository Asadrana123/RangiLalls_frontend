import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Lock } from "lucide-react";
import api from "../Utils/axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await api.get(`/auth/verify-reset-token/${token}`);
        if (!response.data.valid) {
          setTokenValid(false);
          setErrors({ general: "This password reset link has expired or is invalid." });
        }
      } catch (err) {
        setTokenValid(false);
        setErrors({ general: "This password reset link has expired or is invalid." });
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
      setErrors({ general: "No reset token provided" });
    }
  }, [token]);

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
    
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !tokenValid) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword: formData.newPassword
      });
      
      setMessage("Your password has been reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Reset password error:", err);
      
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
            <span className="text-primary">RESET</span>
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

        {tokenValid ? (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="New password"
                />
              </div>
              {errors?.newPassword && (
                <p className="mt-1 text-xs text-red-500">{errors?.newPassword}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Confirm password"
                />
              </div>
              {errors?.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors?.confirmPassword}</p>
              )}
            </div>

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
        ) : (
          <div className="mt-6">
            <p className="text-center text-gray-500">
              The password reset link has expired or is invalid.
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
            >
              Request New Reset Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;