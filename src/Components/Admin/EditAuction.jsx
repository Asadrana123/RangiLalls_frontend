import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, X, Loader, Clock } from 'lucide-react';
import api from '../../Utils/axios';

const EditAuctionModal = ({ auction, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fields that can be edited
  const editableFields = [
    { key: 'customerName', label: 'Customer Name', type: 'text' },
    { key: 'propertyType', label: 'Property Type', type: 'text' },
    { key: 'propertyLocation', label: 'City', type: 'text' },
    { key: 'state', label: 'State', type: 'text' },
    { key: 'propertySchedule', label: 'Property Description', type: 'textarea' },
    { key: 'reservePrice', label: 'Reserve Price (₹)', type: 'number' },
    { key: 'auctionDate', label: 'Auction Date', type: 'date' },
    { key: 'emdSubmission', label: 'EMD Submission Date', type: 'date' }
  ];

  // Add time fields for auction start and end
  const timeFields = [
    { key: 'auctionStartTime', label: 'Auction Start Time', defaultHour: 10, defaultMinute: 0 },
    { key: 'auctionEndTime', label: 'Auction End Time', defaultHour: 17, defaultMinute: 0 }
  ];

  useEffect(() => {
    if (auction) {
      const initialData = {};
      editableFields.forEach(field => {
        if (field.type === 'date' && auction[field.key]) {
          // Format dates for input field
          const date = new Date(auction[field.key]);
          initialData[field.key] = date.toISOString().split('T')[0];
        } else {
          initialData[field.key] = auction[field.key] || '';
        }
      });

      // Handle auction start and end times
      timeFields.forEach(field => {
        if (auction[field.key]) {
          const date = new Date(auction[field.key]);
          // Format time as HH:MM for time input
          initialData[field.key] = date.toTimeString().substring(0, 5);
        } else {
          // Set default times if not present
          const defaultTime = `${field.defaultHour.toString().padStart(2, '0')}:${field.defaultMinute.toString().padStart(2, '0')}`;
          initialData[field.key] = defaultTime;
        }
      });

      setFormData(initialData);
    }
  }, [auction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the data - convert dates back to Date objects for MongoDB
      const dataToSubmit = { ...formData };
      
      // Handle date fields
      if (dataToSubmit.auctionDate) {
        dataToSubmit.auctionDate = new Date(dataToSubmit.auctionDate);
        
        // Set auction start time using the date from auctionDate and time from auctionStartTime
        if (dataToSubmit.auctionStartTime) {
          const [hours, minutes] = dataToSubmit.auctionStartTime.split(':');
          const startTime = new Date(dataToSubmit.auctionDate);
          startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          dataToSubmit.auctionStartTime = startTime;
        }
        
        // Set auction end time using the date from auctionDate and time from auctionEndTime
        if (dataToSubmit.auctionEndTime) {
          const [hours, minutes] = dataToSubmit.auctionEndTime.split(':');
          const endTime = new Date(dataToSubmit.auctionDate);
          endTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          dataToSubmit.auctionEndTime = endTime;
        }
      }
      
      if (dataToSubmit.emdSubmission) {
        dataToSubmit.emdSubmission = new Date(dataToSubmit.emdSubmission);
      }
      
      // Convert number fields
      if (dataToSubmit.reservePrice) {
        dataToSubmit.reservePrice = Number(dataToSubmit.reservePrice);
      }

      const response = await api.put(`/admin/auctions/${auction._id}`, dataToSubmit);
      
      if (response.data.success) {
        onSuccess(dataToSubmit);
      } else {
        setError(response.data.error || 'Failed to update auction');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error updating auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">Edit Auction</h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 p-3 rounded-md text-red-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editableFields.map(field => (
                field.type === 'textarea' ? (
                  <div className="md:col-span-2" key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <textarea
                      name={field.key}
                      value={formData[field.key] || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.key}
                      value={formData[field.key] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )
              ))}
              
              {/* Auction Time Fields Section */}
              <div className="md:col-span-2 mt-4 border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Auction Time Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {timeFields.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="time"
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {field.key === 'auctionStartTime' 
                          ? 'Default is 10:00 AM if not set' 
                          : 'Default is 5:00 PM if not set'}
                      </p>
                    </div>
                  ))}
                </div>
                {auction.auctionExtensionCount > 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-md text-sm">
                    <p className="font-medium text-yellow-800">
                      This auction has been extended {auction.auctionExtensionCount} times due to last-minute bidding.
                    </p>
                    <p className="text-yellow-700 mt-1">
                      Editing the end time will override any automatic extensions.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAuctionModal;