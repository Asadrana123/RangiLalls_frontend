import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

// This would be in a separate slice file in practice
const updateUserProfileSuccess = (updatedUser) => ({
  type: 'auth/updateUserProfileSuccess',
  payload: updatedUser
});

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organizationName: '',
    email: '',
    mobile: '',
    landlineNo: '',
    pancardNo: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    bankName: '',
    accountNo: '',
    ifscCode: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (user) {
      // Populate form with user data
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        organizationName: user.organizationName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        landlineNo: user.landlineNo || '',
        pancardNo: user.pancardNo || '',
        address: user.address || '',
        state: user.state || '',
        city: user.city || '',
        pincode: user.pincode || '',
        bankName: user.bankName || '',
        accountNo: user.accountNo || '',
        ifscCode: user.ifscCode || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (activeTab === 'personal') {
      if (!formData.firstName || !formData.lastName || !formData.organizationName) {
        setMessage({
          text: 'Please fill out all required fields',
          type: 'error'
        });
        return false;
      }
      
      // Mobile validation
      if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile)) {
        setMessage({
          text: 'Please enter a valid 10-digit mobile number',
          type: 'error'
        });
        return false;
      }
      
      // PAN validation
      if (formData.pancardNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pancardNo)) {
        setMessage({
          text: 'Please enter a valid PAN card number (e.g., ABCDE1234F)',
          type: 'error'
        });
        return false;
      }
    } else if (activeTab === 'address') {
      // Simple validation for required address fields
      if (!formData.state || !formData.city) {
        setMessage({
          text: 'State and City are required',
          type: 'error'
        });
        return false;
      }
      
      // Pincode validation
      if (formData.pincode && !/^[1-9][0-9]{5}$/.test(formData.pincode)) {
        setMessage({
          text: 'Please enter a valid 6-digit pincode',
          type: 'error'
        });
        return false;
      }
    } else if (activeTab === 'bank') {
      // Bank details validation (optional but if provided, all fields required)
      if ((formData.bankName || formData.accountNo || formData.ifscCode) && 
          (!formData.bankName || !formData.accountNo || !formData.ifscCode)) {
        setMessage({
          text: 'Please fill all bank details or leave them all empty',
          type: 'error'
        });
        return false;
      }
      
      // IFSC code validation (if provided)
      if (formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
        setMessage({
          text: 'Please enter a valid IFSC code',
          type: 'error'
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Only send the fields relevant to the current tab
      let dataToUpdate = {};
      
      if (activeTab === 'personal') {
        dataToUpdate = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          organizationName: formData.organizationName,
          mobile: formData.mobile,
          landlineNo: formData.landlineNo,
          pancardNo: formData.pancardNo,
        };
      } else if (activeTab === 'address') {
        dataToUpdate = {
          address: formData.address,
          state: formData.state,
          city: formData.city,
          pincode: formData.pincode,
        };
      } else if (activeTab === 'bank') {
        dataToUpdate = {
          bankName: formData.bankName,
          accountNo: formData.accountNo,
          ifscCode: formData.ifscCode,
        };
      }
      
      const response = await axios.put('/api/users/profile', dataToUpdate);
      
      if (response.data.success) {
        // Update redux state with the updated user
        dispatch(updateUserProfileSuccess(response.data.data));
        
        setMessage({
          text: 'Profile updated successfully',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: error.response?.data?.error || 'Error updating profile. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-3 px-6 font-medium text-sm transition-colors ${
              activeTab === 'personal'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`py-3 px-6 font-medium text-sm transition-colors ${
              activeTab === 'address'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Address Details
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`py-3 px-6 font-medium text-sm transition-colors ${
              activeTab === 'bank'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bank Details
          </button>
        </nav>
      </div>
      
      {/* Message */}
      {message.text && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          <div className="flex items-center">
            {message.type === 'success' ? (
              <FaCheck className="mr-2" />
            ) : (
              <FaExclamationTriangle className="mr-2" />
            )}
            <p>{message.text}</p>
          </div>
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landline Number
                </label>
                <input
                  type="text"
                  name="landlineNo"
                  value={formData.landlineNo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Optional"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN Card Number
              </label>
              <input
                type="text"
                name="pancardNo"
                value={formData.pancardNo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Format: ABCDE1234F"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
            </div>
          </div>
        )}
        
        {/* Address Details */}
        {activeTab === 'address' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  placeholder="6-digit pincode"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value="India"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
            </div>
          </div>
        )}
        
        {/* Bank Details */}
        {activeTab === 'bank' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                name="accountNo"
                value={formData.accountNo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Format: SBIN0123456"
              />
              <p className="text-xs text-gray-500 mt-1">Bank details are used for refund purposes</p>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;