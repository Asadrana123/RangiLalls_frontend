import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../../Utils/axios';

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/registrations');
      setRegistrations(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to load registrations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const updateStatus = async (registrationId, status) => {
    try {
      setStatusUpdateLoading(true);
      await api.put(`/admin/registrations/${registrationId}/status`, { status });
      // Update local state to reflect the change
      setRegistrations(registrations.map(reg => 
        reg._id === registrationId ? {...reg, status} : reg
      ));
      setShowDetailsModal(false);
    } catch (error) {
      setError('Failed to update status');
      console.error(error);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Get status badge component
  const StatusBadge = ({ status }) => {
    let color, icon;
    switch (status) {
      case 'approved':
        color = 'bg-green-100 text-green-800';
        icon = <CheckCircle className="w-3 h-3" />;
        break;
      case 'rejected':
        color = 'bg-red-100 text-red-800';
        icon = <XCircle className="w-3 h-3" />;
        break;
      default:
        color = 'bg-yellow-100 text-yellow-800';
        icon = <Clock className="w-3 h-3" />;
    }
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const RegistrationDetailsModal = ({ registration, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold">Registration Details</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          
          <div className="mt-4 space-y-4">
            {/* User Section */}
            <div className="border-b pb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">User Information</h4>
              <p><span className="font-medium">Name:</span> {registration.firstName} {registration.lastName}</p>
              <p><span className="font-medium">Organization:</span> {registration.organizationName}</p>
              <p><span className="font-medium">Phone:</span> {registration.mobile}</p>
            </div>
            
            {/* Auction Section */}
            <div className="border-b pb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Auction Details</h4>
              <p><span className="font-medium">Auction ID:</span> {registration.auctionId}</p>
              <p><span className="font-medium">Date:</span> {new Date(registration.auctionDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Offer Value:</span> ₹{registration.offerValue?.toLocaleString()}</p>
              <p><span className="font-medium">EMD Amount:</span> ₹{registration.emdAmount?.toLocaleString()}</p>
            </div>
            
            {/* Payment Section */}
            <div className="border-b pb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h4>
              <p><span className="font-medium">Payment Mode:</span> {registration.paymentMode}</p>
              {registration.paymentMode === 'Neft - Rtgs' && (
                <p><span className="font-medium">UTR No:</span> {registration.utrNo}</p>
              )}
              <p><span className="font-medium">Bank:</span> {registration.bankName}</p>
              <p><span className="font-medium">Account No:</span> {registration.accountNo}</p>
            </div>
            
            {/* Status Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
              <div className="flex items-center gap-2 mb-4">
                <StatusBadge status={registration.status} />
                {registration.confirmationCode && (
                  <span className="text-sm text-gray-600">Code: {registration.confirmationCode}</span>
                )}
              </div>
              
              <div className="flex gap-2 justify-end">
                {registration.status !== 'approved' && (
                  <button
                    onClick={() => updateStatus(registration._id, 'approved')}
                    disabled={statusUpdateLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                {registration.status !== 'rejected' && (
                  <button
                    onClick={() => updateStatus(registration._id, 'rejected')}
                    disabled={statusUpdateLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                )}
                {registration.status !== 'pending' && (
                  <button
                    onClick={() => updateStatus(registration._id, 'pending')}
                    disabled={statusUpdateLoading}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Set Pending
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex justify-center items-center h-64">
        <div className="text-gray-500">Loading registrations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="bg-red-50 p-4 rounded-lg text-red-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
        <button 
          onClick={fetchRegistrations}
          className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Registration Management</h2>
        <button
          onClick={fetchRegistrations}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No registrations found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auction ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations.map((registration) => (
                <tr key={registration._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium">{registration.firstName} {registration.lastName}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {registration.auctionId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    ₹{registration.offerValue?.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={registration.status} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(registration.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedRegistration(registration);
                        setShowDetailsModal(true);
                      }}
                      className="text-primary hover:text-primary-dark"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showDetailsModal && selectedRegistration && (
        <RegistrationDetailsModal 
          registration={selectedRegistration}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default RegistrationManagement;