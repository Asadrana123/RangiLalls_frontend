import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, X, Loader } from 'lucide-react';
import api from '../../Utils/axios';

const EditAuctionModal = ({ auction, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fields that can be edited
  const editableFields = [
    { key: 'CUSTOMER NAME', label: 'Customer Name', type: 'text' },
    { key: 'Property Type', label: 'Property Type', type: 'text' },
    { key: 'Property Location (City)', label: 'City', type: 'text' },
    { key: 'State', label: 'State', type: 'text' },
    { key: 'Property Schedule', label: 'Property Description', type: 'textarea' },
    { key: 'Reserve Price (Rs)', label: 'Reserve Price (₹)', type: 'number' },
    { key: 'Auction Date', label: 'Auction Date', type: 'text' },
    { key: 'EMD Submission', label: 'EMD Submission Date', type: 'text' }
  ];

  useEffect(() => {
    if (auction) {
      const initialData = {};
      editableFields.forEach(field => {
        initialData[field.key] = auction[field.key] || '';
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
      const response = await api.put(`/admin/auctions/${auction['Auction ID']}`, formData);
      
      if (response.data.success) {
        onSuccess(formData);
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