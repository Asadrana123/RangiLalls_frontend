import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import StatusMessage from '../Components/Registration/StatusMessage';
import Input from '../Components/Registration/Input';
import Select from '../Components/Registration/Select';
import api from "../Utils/axios";
import { useParams } from 'react-router-dom';
const AuctionRegistrationForm = () => {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const { properties } = useSelector((state) => state.property);
  const selectedProperty = properties.find(property => property._id === id);
  const states = [
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' }
  ];

  const cities = {
    'uttar-pradesh': [
      { value: 'muzaffarnagar', label: 'Muzaffarnagar' },
      { value: 'lucknow', label: 'Lucknow' },
      { value: 'kanpur', label: 'Kanpur' }
    ],
    'rajasthan': [
      { value: 'udaipur', label: 'Udaipur' },
      { value: 'jaipur', label: 'Jaipur' },
      { value: 'jodhpur', label: 'Jodhpur' }
    ],
    'madhya-pradesh': [
      { value: 'indore', label: 'Indore' },
      { value: 'bhopal', label: 'Bhopal' }
    ]
  };

  const banks = [
    { value: 'sbi', label: 'State Bank of India' },
    { value: 'hdfc', label: 'HDFC Bank' },
    { value: 'icici', label: 'ICICI Bank' },
    { value: 'axis', label: 'Axis Bank' }
  ];

  const paymentModes = [
    { value: 'Neft - Rtgs', label: 'NEFT - RTGS' },
    { value: 'Demand Draft', label: 'Demand Draft' },
    { value: 'Payorder', label: 'Pay Order' },
    { value: 'Cheque', label: 'Cheque' }
  ];

  // Form state
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    organizationName: user.
    organizationName,
    address: user.address,
    country: user.country,
    state: user.state,
    city: user.city,
    pincode: user.pincode,
    landline: user.landlineNo,
    mobile: user.mobile,
    fax: user.fax,
    pancardFile: null,
    addressProof: null,
    bankName: '',
    accountNo: '',
    ifscCode: '',
    offerValue: '',
    paymentMode: 'Neft - Rtgs',
    utrNo: '',
    paymentReceipt: null
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [availableCities, setAvailableCities] = useState([]);

  // Validation functions
  const validateLandline = (landline) => {
    const cleanNumber = landline.replace(/[^\d]/g, '');
    
    if (!landline) return "Landline number is required";
    if (cleanNumber.length < 8) return "Landline number is too short";
    if (cleanNumber.length > 11) return "Landline number is too long";
    
    const validStdPatterns = /^(0[0-9]{2,4}|[1-9][0-9]{1,3})$/;
    
    if (cleanNumber.length > 8) {
      const stdCode = cleanNumber.slice(0, cleanNumber.length - 8);
      if (!validStdPatterns.test(stdCode)) {
        return "Invalid STD code";
      }
    }
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

  const validateIfscCode = (ifscCode) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return !ifscRegex.test(ifscCode) ? "Invalid IFSC code" : "";
  };

  // Field validation
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return !value.trim() ? "First name is required" : "";
      case 'lastName':
        return !value.trim() ? "Last name is required" : "";
      case 'organizationName':
        return !value.trim() ? "Organization name is required" : "";
      case 'landline':
        return validateLandline(value);
      case 'mobile':
        return validateMobile(value);
      case 'pincode':
        return validatePincode(value);
      case 'bankName':
        return !value ? "Bank name is required" : "";
      case 'accountNo':
        return !value.trim() ? "Account number is required" : "";
      case 'ifscCode':
        return validateIfscCode(value);
      case 'offerValue':
        const minValue = selectedProperty['Reserve Price (Rs.)'];
        return !value ? "Offer value is required" : 
               parseFloat(value) < minValue ? `Offer must be at least ₹${minValue.toLocaleString()}` : "";
      case 'utrNo':
        return formData.paymentMode === 'Neft - Rtgs' && !value.trim() ? "UTR number is required" : "";
      case 'paymentReceipt':
        return formData.paymentMode !== 'Neft - Rtgs' && !value ? "Payment receipt is required" : "";
      case 'pancardFile':
        return !value ? "PAN Card file is required" : "";
      case 'addressProof':
        return !value ? "Address proof is required" : "";
      case 'state':
        return !value ? "State is required" : "";
      case 'city':
        return !value ? "City is required" : "";
      default:
        return "";
    }
  };

  // Event handlers
  const handleInputChange = (field) => (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
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

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
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
  
    const formDataToSend = new FormData();
    // Add all text fields
    Object.keys(formData).forEach(key => {
      if (key !== 'pancardFile' && key !== 'addressProof' && key !== 'paymentReceipt') {
        formDataToSend.append(key, formData[key]);
      }
    });
    formDataToSend.append('auctionId',selectedProperty['Auction ID']);
    formDataToSend.append('email',user.email);
    formDataToSend.append('auctionDate',selectedProperty['Auction Date']);
    // Add files
    if (formData.pancardFile) formDataToSend.append('pancardFile', formData.pancardFile);
    if (formData.addressProof) formDataToSend.append('addressProof', formData.addressProof);
    if (formData.paymentReceipt) formDataToSend.append('paymentReceipt', formData.paymentReceipt);
  
    setIsLoading(true);
    try {
      const response = await api.post('/auction/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
      setSubmitStatus('success');
      setSubmitMessage('Registration successful! Please check your email for further instructions.');
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-primary text-3xl mb-4">Participate Registration for E-Auction</h1>
        <div className="flex items-center">
          <h2 className="text-gray-700 text-xl">AUCTION ID: </h2>
          <span className="text-primary text-xl ml-2">{selectedProperty['Auction ID']}</span>
        </div>
      </div>

      <StatusMessage status={submitStatus} message={submitMessage} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Buyer Detail Section */}
        <div className="mb-6">
          <div className="bg-gray-500 text-white p-2 mb-4">
            Buyer Detail
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="block mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={handleInputChange('address')}
                className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <Select
              label="Country"
              value={formData.country}
              placeholder={formData.country}
              onChange={handleInputChange('country')}
              options={[{ value: 'India', label: 'India' }]}
              required
            />

            <Select
              label="State"
              value={formData.state}
              onChange={handleStateChange}
              options={states}
              placeholder={formData.state}
              required
              error={errors.state}
            />

            <Select
              label="City"
              value={formData.city}
              onChange={handleInputChange('city')}
              options={availableCities}
              placeholder={formData.city}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Input
              label="Landline No"
              value={formData.landline}
              onChange={handleInputChange('landline')}
              onBlur={handleBlur('landline')}
              error={errors.landline}
              required
            />

            <Input
              label="Mobile"
              value={formData.mobile}
              onChange={handleInputChange('mobile')}
              onBlur={handleBlur('mobile')}
              error={errors.mobile}
              required
            />

            <Input
              label="Fax"
              value={formData.fax}
              onChange={handleInputChange('fax')}
            />
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="mb-6">
          <div className="bg-gray-500 text-white p-2 mb-4">
            Document Upload
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block mb-1">
                Pan Card <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={handleInputChange('pancardFile')}
                className="w-full p-2 border rounded"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <p className="text-sm text-gray-500 mt-1">(You can upload pdf or image file)</p>
              {errors.pancardFile && (
                <p className="text-xs text-red-500 mt-1">{errors.pancardFile}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">
                Address Proof <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={handleInputChange('addressProof')}
                className="w-full p-2 border rounded"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <p className="text-sm text-gray-500 mt-1">(You can upload pdf or image file)</p>
              {errors.addressProof && (
                <p className="text-xs text-red-500 mt-1">{errors.addressProof}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bank Detail Section */}
        <div className="mb-6">
          <div className="bg-gray-500 text-white p-2 mb-4">
            Bank Detail
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Bank Name"
              value={formData.bankName}
              onChange={handleInputChange('bankName')}
              options={banks}
              placeholder="Select Bank"
              required
              error={errors.bankName}
            />

            <Input
              label="Account No"
              value={formData.accountNo}
              onChange={handleInputChange('accountNo')}
              onBlur={handleBlur('accountNo')}
              error={errors.accountNo}
              required
              placeholder="Account No"
            />

            <Input
              label="IFSC Code"
              value={formData.ifscCode}
              onChange={handleInputChange('ifscCode')}
              onBlur={handleBlur('ifscCode')}
              error={errors.ifscCode}
              required
              placeholder="IFSC Code"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <Input
                label="Offer Value"
                type="number"
                value={formData.offerValue}
                onChange={handleInputChange('offerValue')}
                onBlur={handleBlur('offerValue')}
                error={errors.offerValue}
                required
                placeholder="Enter offer value"
              />
              <p className="text-sm text-gray-500 mt-1">(Reserve Price : {selectedProperty['Reserve Price (Rs.)']})</p>
            </div>

            <Select
              label="Payment Mode"
              value={formData.paymentMode}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  paymentMode: e.target.value,
                  utrNo: '',
                  paymentReceipt: null
                }));
                setErrors(prev => ({
                  ...prev,
                  utrNo: '',
                  paymentReceipt: ''
                }));
              }}
              options={paymentModes}
              required
              error={errors.paymentMode}
            />

            {formData.paymentMode === 'Neft - Rtgs' ? (
              <Input
                label="UTR No"
                value={formData.utrNo}
                onChange={handleInputChange('utrNo')}
                onBlur={handleBlur('utrNo')}
                error={errors.utrNo}
                required
              />
            ) : (
              <div>
                <label className="block mb-1">
                  Upload Receipt <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData(prev => ({
                      ...prev,
                      paymentReceipt: file
                    }));
                    const error = validateField('paymentReceipt', file);
                    setErrors(prev => ({
                      ...prev,
                      paymentReceipt: error
                    }));
                  }}
                  className={`w-full p-2 border rounded-md transition-colors
                    ${errors.paymentReceipt 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                    }`}
                />
                <p className="text-xs text-gray-500 mt-1">(You can upload pdf or image file)</p>
                {errors.paymentReceipt && (
                  <p className="text-xs text-red-500 mt-1">{errors.paymentReceipt}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notice Section */}
        <div className="bg-gray-50 p-4 mb-6 text-center">
          <p className="text-gray-700">
            <span className="text-primary font-medium">Notice to Bidders : </span>
            Please enter the above data carefully. Your entered data will be utilized for the automatic generation of the Bid Document. Following the generation of the Bid Document, you will receive a PDF format containing all filled data after the generation of the EMD (Earnest Money Deposit) challan.
          </p>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark
              focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Processing...
              </>
            ) : (
              'I ACCEPT, REGISTER ME'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuctionRegistrationForm;