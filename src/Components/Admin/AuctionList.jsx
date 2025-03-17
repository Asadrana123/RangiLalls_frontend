import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  AlertCircle,
  Calendar,
  Users,
  ExternalLink,
} from "lucide-react";
import { useSelector } from "react-redux";
import api from "../../Utils/axios";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import EditAuctionModal from "./EditAuction";
import DeleteAuctionModal from "./DeleteAuction";
import DocumentViewer from "./DocumentViewer";
import {formatDateToDDMMMYY} from "../../Utils/helper";
const AuctionList = () => {
  // Get auctions/properties from Redux state instead of making API call
  const { properties } = useSelector((state) => state.property);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [viewingRegistration, setViewingRegistration] = useState(null);
  const [showRegistrationDetailsModal, setShowRegistrationDetailsModal] = useState(false);
  const [editingAuction, setEditingAuction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingAuction, setDeletingAuction] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState({});

  const handleEditAuction = (auction) => {
    setEditingAuction(auction);
    setShowEditModal(true);
    setActionMenuOpen({});
  };

  const handleDeleteAuction = (auction) => {
    setDeletingAuction(auction);
    setShowDeleteModal(true);
    setActionMenuOpen({});
  };

  const handleEditSuccess = (updatedData) => {
    setShowEditModal(false);
    alert("Auction updated successfully");
    // If you need to refresh the data, you can dispatch your Redux action here
    // dispatch(fetchProperties());
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    alert("Auction deleted successfully");
    // If you need to refresh the data, you can dispatch your Redux action here
    // dispatch(fetchProperties());
  };

  const toggleActionMenu = (auctionId) => {
    setActionMenuOpen((prev) => ({
      ...prev,
      [auctionId]: !prev[auctionId],
    }));
  };

  const updateStatus = async (registrationId, status) => {
    try {
      setStatusUpdateLoading(true);
      await api.put(`/admin/registrations/${registrationId}/status`, {
        status,
      });
      // Update local state to reflect the change
      setRegistrations(
        registrations.map((reg) =>
          reg._id === registrationId ? { ...reg, status } : reg
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Function to open the details modal
  const handleViewDetails = (registration) => {
    setViewingRegistration(registration);
    setShowRegistrationDetailsModal(true);
  };

  const fetchRegistrationsForAuction = async (auctionId) => {
    try {
      setRegistrationsLoading(true);
      // Now using _id as the identifier
      const response = await api.get(
        `/admin/auctions/${encodeURIComponent(auctionId)}/registrations`
      );
      setRegistrations(response.data.data);
    } catch (error) {
      console.error("Failed to fetch registrations for auction", error);
      setRegistrations([]);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const handleViewRegistrations = (auction) => {
    setSelectedAuction(auction);
    setShowRegistrationsModal(true);
    // Now using _id as the identifier
    fetchRegistrationsForAuction(auction._id);
  };


  

  // Status badge component for registration status
  const StatusBadge = ({ status }) => {
    let color, icon;
    switch (status) {
      case "approved":
        color = "bg-green-100 text-green-800";
        icon = <div className="w-2 h-2 bg-green-600 rounded-full"></div>;
        break;
      case "rejected":
        color = "bg-red-100 text-red-800";
        icon = <div className="w-2 h-2 bg-red-600 rounded-full"></div>;
        break;
      default:
        color = "bg-yellow-100 text-yellow-800";
        icon = <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>;
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}
      >
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Modal to show registrations for a specific auction
  const RegistrationsModal = ({ auction, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">
                Registrations for Auction
              </h3>
              <p className="text-gray-600 mt-1">
                Auction ID: {auction._id} | {auction.customerName}{" "}
                | {auction.propertyLocation}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
            >
              &times;
            </button>
          </div>

          {registrationsLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading registrations...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                No registrations found for this auction
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offer Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-medium">
                          {registration.firstName} {registration.lastName}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {registration.mobile}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {registration.organizationName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        ₹{registration.offerValue?.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={registration.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {new Date(registration.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(registration)}
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
        </div>
      </div>
    </div>
  );

  const RegistrationDetailsModal = ({ registration, onClose }) => {
    const [viewingDocument, setViewingDocument] = useState(null);
    
    return (
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
              
              {/* Document Section */}
              <div className="border-b pb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {registration.pancardFile && (
                    <div className="border rounded-md p-2">
                      <p className="text-sm font-medium mb-2">PAN Card</p>
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-full bg-gray-100 mb-2 flex items-center justify-center overflow-hidden">
                          <img 
                            src={registration.pancardFile} 
                            alt="PAN Card" 
                            className="h-full object-cover cursor-pointer"
                            onClick={() => setViewingDocument({
                              url: registration.pancardFile,
                              title: 'PAN Card'
                            })}
                          />
                        </div>
                        <button
                          onClick={() => setViewingDocument({
                            url: registration.pancardFile,
                            title: 'PAN Card'
                          })}
                          className="text-primary text-sm hover:underline"
                        >
                          View Full Image
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {registration.addressProof && (
                    <div className="border rounded-md p-2">
                      <p className="text-sm font-medium mb-2">Address Proof</p>
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-full bg-gray-100 mb-2 flex items-center justify-center overflow-hidden">
                          <img 
                            src={registration.addressProof} 
                            alt="Address Proof" 
                            className="h-full object-cover cursor-pointer"
                            onClick={() => setViewingDocument({
                              url: registration.addressProof,
                              title: 'Address Proof'
                            })}
                          />
                        </div>
                        <button
                          onClick={() => setViewingDocument({
                            url: registration.addressProof,
                            title: 'Address Proof'
                          })}
                          className="text-primary text-sm hover:underline"
                        >
                          View Full Image
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {registration.paymentReceipt && (
                    <div className="border rounded-md p-2">
                      <p className="text-sm font-medium mb-2">Payment Receipt</p>
                      <div className="flex flex-col items-center">
                        <div className="h-32 w-full bg-gray-100 mb-2 flex items-center justify-center overflow-hidden">
                          <img 
                            src={registration.paymentReceipt} 
                            alt="Payment Receipt" 
                            className="h-full object-cover cursor-pointer"
                            onClick={() => setViewingDocument({
                              url: registration.paymentReceipt,
                              title: 'Payment Receipt'
                            })}
                          />
                        </div>
                        <button
                          onClick={() => setViewingDocument({
                            url: registration.paymentReceipt,
                            title: 'Payment Receipt'
                          })}
                          className="text-primary text-sm hover:underline"
                        >
                          View Full Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
        
        {/* Document Viewer Modal */}
        {viewingDocument && (
          <DocumentViewer 
            url={viewingDocument.url} 
            title={viewingDocument.title}
            onClose={() => setViewingDocument(null)}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex justify-center items-center h-64">
        <div className="text-gray-500">Loading auctions...</div>
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
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Auction List</h2>
      </div>

      {!properties || properties.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No auctions found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auction Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((auction, index) => (
                <tr
                  key={auction._id || index}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium">
                      {auction.customerName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {auction.cifId}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>{auction.propertyType}</div>
                    <div
                      className="text-xs text-gray-500 truncate max-w-xs"
                      title={auction.propertySchedule}
                    >
                      {auction.propertySchedule}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>{auction.propertyLocation}</div>
                    <div className="text-xs text-gray-500">
                      {auction.state}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDateToDDMMMYY(auction.auctionDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      EMD by: {formatDateToDDMMMYY(auction.emdSubmission)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewRegistrations(auction)}
                        className="text-primary hover:text-primary-dark flex items-center gap-1"
                      >
                        <Users className="w-4 h-4" />
                        View Registrations
                      </button>
                      <div className="relative">
                        <button
                          onClick={() =>
                            toggleActionMenu(auction._id)
                          }
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>

                        {actionMenuOpen[auction._id] && (
                          <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-md py-1 z-10 w-36 border">
                            <button
                              onClick={() => handleEditAuction(auction)}
                              className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAuction(auction)}
                              className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRegistrationsModal && selectedAuction && (
        <RegistrationsModal
          auction={selectedAuction}
          onClose={() => setShowRegistrationsModal(false)}
        />
      )}
      {showRegistrationDetailsModal && viewingRegistration && (
        <RegistrationDetailsModal
          registration={viewingRegistration}
          onClose={() => setShowRegistrationDetailsModal(false)}
        />
      )}
      {showEditModal && editingAuction && (
        <EditAuctionModal
          auction={editingAuction}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {showDeleteModal && deletingAuction && (
        <DeleteAuctionModal
          auction={deletingAuction}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default AuctionList;