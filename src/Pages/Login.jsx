import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Lock } from "lucide-react";
import Captcha from "../Components/Login/Captcha";
import api from "../Utils/axios";
import { setLoading, setError, setSuccess } from "../redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
const Login = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captcha: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

 
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.captcha) newErrors.captcha = "Captcha is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleCaptchaVerify = (token) => {
    setFormData((prev) => ({
      ...prev,
      captcha: token,
    }));
    console.log('Captcha token:', token);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      console.log("hi");
      const response = await api.post("/auth/login", formData);
      dispatch(setSuccess(response.data));
      navigate('/'); 
    } catch (error) {
      console.log(error);
      dispatch(
        setError(
          error.response?.data?.error || "Login failed. Please try again."
        )
      );
      setErrors((prev) => ({
        ...prev,
        general:
          error.response?.data?.error || "Login failed. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex  justify-center bg-gray-50 mt-20">
      <div className="w-full max-w-md p-8">
        <h1 className="text-center text-3xl font-bold mb-8">
          <span className="text-primary">LOGIN</span>
          {/* <span className="text-gray-700"> FOR E-AUCTION</span> */}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          {/* email Input */}
          <div className="relative">
            <div>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="email"
            />
            </div>
          </div>
          {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Password"
            />
          </div>
          {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          {/* Captcha */}
          <Captcha onCaptchaVerify={handleCaptchaVerify} />
          {errors.captcha && (
            <p className="mt-1 text-xs text-red-500">{errors.captcha}</p>
          )}
          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-primary hover:text-primary text-sm"
            >
              I forgot my Password
            </Link>
          </div>

          {/* Register Link */}
          <div className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary font-medium"
            >
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
