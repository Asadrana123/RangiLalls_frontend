import React, { useState } from 'react';
import { Trash2, AlertCircle, X, Loader } from 'lucide-react';
import api from '../../Utils/axios';

const DeleteAuctionModal = ({ auction, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);

    try {
      const response = await api.delete(`/admin/auctions/${auction['Auction ID']}`);
      
      if (response.data.success) {
        onSuccess();
      } else {
        setError(response.data.error || 'Failed to delete auction');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error deleting auction');
      
      // Capture additional details like registration count
      if (error.response?.data?.registrationsCount) {
        setErrorDetails({
          registrationsCount: error.response.data.registrationsCount
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold flex items-center text-red-600 gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Auction
            </h3>
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
              <div>
                <p className="font-medium">{error}</p>
                {errorDetails?.registrationsCount && (
                  <p className="mt-1 text-sm">
                    This auction has {errorDetails.registrationsCount} registrations. 
                    You must delete or reassign these registrations before deleting the auction.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-2 mb-4">
            <p className="mb-3">
              Are you sure you want to delete this auction? This action cannot be undone.
            </p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p><span className="font-medium">Auction ID:</span> {auction['Auction ID']}</p>
              <p><span className="font-medium">Customer:</span> {auction['CUSTOMER NAME']}</p>
              <p><span className="font-medium">Property:</span> {auction['Property Type']} in {auction['Property Location (City)']}</p>
              <p><span className="font-medium">Auction Date:</span> {auction['Auction Date']}</p>
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
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Auction
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAuctionModal;