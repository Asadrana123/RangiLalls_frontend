import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle, X } from 'lucide-react';
import api from '../../Utils/axios';
const PropertyAddForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const initialFormData = {
    loanAccountNo: '',
    cifId: '',
    customerName: '',
    zone: '',
    region: '',
    propertyLocation: '',
    state: '',
    propertyType: '',
    possessionType: '',
    reservePrice: '',
    emdSubmission: '',
    auctionDate: '',
    vendor: '',
    propertySchedule: ''
  };
  
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare property data
      const propertyData = {
        ...formData,
      };

      // Convert numeric fields
      if (propertyData.cifId) {
        propertyData.cifId = Number(propertyData.cifId);
      }
      
      if (propertyData.reservePrice) {
        propertyData.reservePrice = Number(propertyData.reservePrice);
      }
      const response = await api.post('/admin/add-property', propertyData);

      if (response.data.success) {
        setSuccess('Property added successfully');
        setFormData(initialFormData); // Reset form
      } else {
        setError(response.data.error || 'Failed to add property');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error adding property');
    } finally {
      setLoading(false);
    }
  };

  const possessionTypes = ["PHYSICAL", "SYMBOLIC"];
  const propertyTypes = ["RESIDENTIAL HOUSE", "RESIDENTIAL FLAT", "COMMERCIAL PROPERTY", "INDUSTRIAL PROPERTY", "LAND", "AGRICULTURAL LAND"];
  const vendors = ["Procure247", "In-house"];
  const zones = ["NORTH", "SOUTH", "EAST", "WEST", "CENTRAL"];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add New Property</h2>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <p>{success}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Customer & Account Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Account No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="loanAccountNo"
                value={formData.loanAccountNo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CIF ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="cifId"
                value={formData.cifId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Location Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zone <span className="text-red-500">*</span>
              </label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Zone</option>
                {zones.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Location (City) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="propertyLocation"
                value={formData.propertyLocation}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Property Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Property Type</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type of Possession <span className="text-red-500">*</span>
              </label>
              <select
                name="possessionType"
                value={formData.possessionType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Possession Type</option>
                {possessionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reserve Price (Rs) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="reservePrice"
                value={formData.reservePrice}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Auction Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EMD Submission Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="emdSubmission"
                value={formData.emdSubmission}
                onChange={handleChange}
                placeholder="DD-MMM-YY (e.g., 06-Mar-25)"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Format: DD-MMM-YY (e.g., 06-Mar-25)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auction Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="auctionDate"
                value={formData.auctionDate}
                onChange={handleChange}
                placeholder="DD-MMM-YY (e.g., 07-Mar-25)"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Format: DD-MMM-YY (e.g., 07-Mar-25)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Vendor</option>
                {vendors.map(vendor => (
                  <option key={vendor} value={vendor}>{vendor}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Property Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Schedule/Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="propertySchedule"
              value={formData.propertySchedule}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setFormData(initialFormData)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Adding...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyAddForm;