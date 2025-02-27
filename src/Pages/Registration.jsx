import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {setSuccess,setError,setLoading} from "../redux/Slices/authSlice";
import StatusMessage from '../Components/Registration/StatusMessage';
import Input from '../Components/Registration/Input';
import Select from '../Components/Registration/Select';
import api from "../Utils/axios"
const Registration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);
  // Data for dropdowns
  const states = [
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'delhi', label: 'Delhi' }
  ];

  const cities = {
    'madhya-pradesh': [
      { value: 'indore', label: 'Indore' },
      { value: 'bhopal', label: 'Bhopal' },
      { value: 'jabalpur', label: 'Jabalpur' }
    ],
    'maharashtra': [
      { value: 'mumbai', label: 'Mumbai' },
      { value: 'pune', label: 'Pune' },
      { value: 'nagpur', label: 'Nagpur' }
    ],
    'gujarat': [
      { value: 'ahmedabad', label: 'Ahmedabad' },
      { value: 'surat', label: 'Surat' },
      { value: 'vadodara', label: 'Vadodara' }
    ],
    'delhi': [
      { value: 'new-delhi', label: 'New Delhi' },
      { value: 'north-delhi', label: 'North Delhi' },
      { value: 'south-delhi', label: 'South Delhi' }
    ]
  };

  const industries = [
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'banking', label: 'Banking & Finance' },
    { value: 'manufacturing', label: 'Manufacturing' }
  ];

  const subIndustries = {
    'real-estate': [
      { value: 'residential', label: 'Residential Property' },
      { value: 'commercial', label: 'Commercial Property' },
      { value: 'industrial', label: 'Industrial Property' }
    ],
    'automotive': [
      { value: 'cars', label: 'Cars & SUVs' },
      { value: 'commercial-vehicles', label: 'Commercial Vehicles' },
      { value: 'spare-parts', label: 'Spare Parts' }
    ],
    'banking': [
      { value: 'retail-banking', label: 'Retail Banking' },
      { value: 'corporate-banking', label: 'Corporate Banking' },
      { value: 'investment-banking', label: 'Investment Banking' }
    ],
    'manufacturing': [
      { value: 'textiles', label: 'Textiles' },
      { value: 'electronics', label: 'Electronics' },
      { value: 'machinery', label: 'Machinery' }
    ]
  };

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organizationName: '',
    address: '',
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    landlineNo: '',
    mobile: '',
    fax: '',
    pancardNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredLocation: {
      country: 'India',
      state: '',
      city: ''
    },
    preferredIndustry: '',
    preferredSubIndustry: '',
    acceptTerms: false
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [availableSubIndustries, setAvailableSubIndustries] = useState([]);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!re.test(email)) return "Invalid email format";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 20) return "Password must be less than 20 characters";
    if (!/\d/.test(password)) return "Password must contain at least 1 number";
    if (!/[a-zA-Z]/.test(password)) return "Password must contain at least 1 letter";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least 1 special character";
    return "";
  };

  const validateMobile = (mobile) => {
    const re = /^[0-9]{10}$/;
    if (!mobile) return "Mobile number is required";
    if (!re.test(mobile)) return "Invalid mobile number";
    return "";
  };

  const validatePincode = (pincode) => {
    const re = /^[1-9][0-9]{5}$/;
    if (!pincode) return "Pincode is required";
    if (!re.test(pincode)) return "Invalid pincode";
    return "";
  };

  const validatePanCard = (panCard) => {
    const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panCard) return "";  // Pan card is optional
    if (!re.test(panCard)) return "Invalid PAN card format";
    return "";
  };
  const validateLandline = (landline) => {
    // Remove all spaces and special characters
    const cleanNumber = landline.replace(/[^\d]/g, '');
    
    // Indian landline numbers can be:
    // - 8 digits (local number without STD code)
    // - 10-11 digits (with STD code)
    // STD codes in India are 2-4 digits
    
    if (!landline) return "Landline number is required";
    if (cleanNumber.length < 8) return "Landline number is too short";
    if (cleanNumber.length > 11) return "Landline number is too long";
    
    // Check if the number starts with valid STD code patterns
    const validStdPatterns = /^(0[0-9]{2,4}|[1-9][0-9]{1,3})$/;
    
    if (cleanNumber.length > 8) {
      const stdCode = cleanNumber.slice(0, cleanNumber.length - 8);
      if (!validStdPatterns.test(stdCode)) {
        return "Invalid STD code";
      }
    }
  
    return "";
  };
  // Field validation
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return value !== formData.password ? "Passwords don't match" : "";
      case 'mobile':
        return validateMobile(value);
      case 'firstName':
        return !value ? "First name is required" : "";
      case 'lastName':
        return !value ? "Last name is required" : "";
      case 'organizationName':
        return !value ? "Organization name is required" : "";
      case 'state':
        return !value ? "State is required" : "";
      case 'city':
        return !value ? "City is required" : "";
      case 'pincode':
        return validatePincode(value);
      case 'pancardNo':
        return validatePanCard(value); 
      default:
        return "";
    }
  };

  // Event handlers
  const handleInputChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field) => () => {
    const error = validateField(field, formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleStateChange = (e) => {
    const stateValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      state: stateValue,
      city: ''
    }));
    setAvailableCities(cities[stateValue] || []);
  };

  const handleIndustryChange = (e) => {
    const industryValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      preferredIndustry: industryValue,
      preferredSubIndustry: ''
    }));
    setAvailableSubIndustries(subIndustries[industryValue] || []);
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (!formData.acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      setSubmitMessage('Please fix the errors in the form');
      return;
    }
    setIsLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');
    dispatch(setLoading(true));
      try {
        console.log("hi");
        const response = await api.post('/auth/register', formData);
        console.log(response.data);
        setSubmitStatus('success');
        setSubmitMessage('Registration successful! Please check your email to verify your account.');;
        // navigate('/');
      } catch (error) {
        dispatch(setError(error.response?.data?.error || 'Registration failed'));
        setSubmitStatus('error');
        setSubmitMessage(error.response?.data?.error?error.response?.data?.error:"Registration failed");
        console.log(error);
      }finally{
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-center text-2xl font-bold mb-8">
            {/* <span className="text-gray-800">FREE</span>{' '} */}
            <span className="text-primary">REGISTRATION</span>
          </h1>

          <StatusMessage status={submitStatus} message={submitMessage} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                onBlur={handleBlur('firstName')}
                error={errors.firstName}
                required
                maxLength={30}
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                onBlur={handleBlur('lastName')}
                error={errors.lastName}
                required
              />
              <Input
                label="Organization Name"
                value={formData.organizationName}
                onChange={handleInputChange('organizationName')}
                onBlur={handleBlur('organizationName')}
                error={errors.organizationName}
                required
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={handleInputChange('address')}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                rows={3}
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
                label="State"
                value={formData.state}
                onChange={handleStateChange}
                options={states}
                placeholder="-- Select --"
                required
                error={errors.state}
              />
              <Select
                label="City"
                value={formData.city}
                onChange={handleInputChange('city')}
                options={availableCities}
                placeholder="-- Select --"
                required
                error={errors.city}
              />
              <Input
                label="Pincode"
                value={formData.pincode}
                onChange={handleInputChange('pincode')}
                onBlur={handleBlur('pincode')}
                error={errors.pincode}
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Landline No"
                value={formData.landlineNo}
                onChange={handleInputChange('landlineNo')}
                onBlur={handleBlur('landlineNo')}
                error={errors.landlineNo}
              />
              <Input
                label="Mobile"
                value={formData.mobile}
                onChange={handleInputChange('mobile')}
                onBlur={handleBlur('mobile')}
                required
                error={errors.mobile}
              />
              <Input
                label="Fax"
                value={formData.fax}
                onChange={handleInputChange('fax')}
              />
              <Input
                label="Pancard No."
                value={formData.pancardNo}
                onChange={handleInputChange('pancardNo')}
                onBlur={handleBlur('pancardNo')}
                error={errors.pancardNo}
              />
            </div>

            {/* Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Email / UserName"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                onBlur={handleBlur('email')}
                required
                error={errors.email}
                note="(Email will be validated and not editable in future.)"
              />
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                onBlur={handleBlur('password')}
                required
                error={errors.password}
                note="(8-20 characters, At least 1 num,1 alphabet & 1 special char.)"
              />
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                required
                error={errors.confirmPassword}
              />
            </div>

            {/* Preferences */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Preferred Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Country"
                  value={formData.preferredLocation.country}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferredLocation: { ...prev.preferredLocation, country: e.target.value }
                  }))}
                  options={[{ value: 'India', label: 'India' }]}
                />
                <Select
                  label="State"
                  value={formData.preferredLocation.state}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferredLocation: { ...prev.preferredLocation, state: e.target.value }
                  }))}
                  options={states}
                  placeholder="-- Any --"
                />
                <Select
                  label="City"
                  value={formData.preferredLocation.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferredLocation: { ...prev.preferredLocation, city: e.target.value }
                  }))}
                  options={availableCities}
                  placeholder="-- Any --"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Preferred Industry"
                value={formData.preferredIndustry}
                onChange={handleIndustryChange}
                options={industries}
                placeholder="-- Any --"
              />
              <Select
                label="Preferred SubIndustry"
                value={formData.preferredSubIndustry}
                onChange={handleInputChange('preferredSubIndustry')}
                options={availableSubIndustries}
                placeholder="-- Select --"
              />
            </div>

            {/* Terms of Service */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Terms Of Services</h3>
              <div className="bg-gray-50 p-4 rounded-md h-40 overflow-y-auto mb-4 text-sm">
                <h4 className="font-medium">1. ACCEPTANCE OF TERMS</h4>
                <p>
                  The services that Auctionfocus.in provides to User is subject to the following Terms of Use ("TOU"). Auctionfocus.in reserves the right to update the TOU at any time without notice to User...
                </p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">I accept the terms and conditions</span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-500 mt-1">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark
                  focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Registering...
                  </>
                ) : (
                  'I accept, Register Me'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;