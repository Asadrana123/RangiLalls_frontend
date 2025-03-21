import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, Users, IndianRupee, Search, FileText, AlertCircle, ChevronDown } from 'lucide-react';
import api from '../../Utils/axios';
import { formatDateToDDMMMYY } from '../../Utils/helper';

const AuctionReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchAuctionReports();
  }, []);

  const fetchAuctionReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/auction-reports');
      if (response.data.success) {
        setReports(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch auction reports');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error fetching auction reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandRow = (reportId) => {
    setExpandedRows(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  const viewDetailReport = async (auctionId) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/auction-reports/${auctionId}`);
      if (response.data.success) {
        setSelectedReport(response.data.data);
        setShowDetailModal(true);
      } else {
        setError(response.data.error || 'Failed to fetch auction report details');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error fetching auction report details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      report.auctionId.toLowerCase().includes(searchLower) ||
      report.propertyType.toLowerCase().includes(searchLower) ||
      report.propertyLocation.toLowerCase().includes(searchLower) ||
      report.customerName.toLowerCase().includes(searchLower)
    );
  });

  if (loading && reports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex justify-center items-center h-64">
        <div className="text-gray-500">Loading auction reports...</div>
      </div>
    );
  }

  if (error && reports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="bg-red-50 p-4 rounded-lg text-red-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
        <button 
          onClick={fetchAuctionReports}
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
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Auction Reports
        </h2>
        <button
          onClick={fetchAuctionReports}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by auction ID, property type, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No auction reports found</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Highest Bid
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <React.Fragment key={report._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-2 py-4">
                      <button 
                        onClick={() => toggleExpandRow(report._id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ChevronDown className={`w-5 h-5 transform transition-transform ${expandedRows[report._id] ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium">{report.auctionId}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>{report.propertyType}</div>
                      <div className="text-xs text-gray-500">{report.customerName}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>{report.propertyLocation}</div>
                      <div className="text-xs text-gray-500">{report.state}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDateToDDMMMYY(report.auctionDate)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center text-sm">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {report.registeredParticipants}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      {report.highestBid > 0 ? (
                        <div className="flex items-center justify-end text-sm font-medium">
                          <IndianRupee className="w-4 h-4 mr-1 text-primary" />
                          {report.highestBid.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-gray-500">No bids</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewDetailReport(report.auctionId)}
                        className="text-primary hover:text-primary-dark"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                  {expandedRows[report._id] && (
                    <tr>
                      <td colSpan="8" className="px-4 py-4 bg-gray-50 border-b">
                        <div className="text-sm">
                          <h4 className="font-medium mb-2">Auction Summary</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p><span className="font-medium">Reserve Price:</span> ₹{report.reservePrice?.toLocaleString()}</p>
                              <p><span className="font-medium">Total Bids:</span> {report.totalBids}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Highest Bidder:</span> {report.highestBidder || 'N/A'}</p>
                              <p><span className="font-medium">Active Bidders:</span> {report.activeBidders}</p>
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">Auction Success:</span> {report.highestBid >= report.reservePrice 
                                ? <span className="text-green-600">Yes</span> 
                                : <span className="text-red-600">No</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDetailModal && selectedReport && (
        <DetailedAuctionModal
          report={selectedReport}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

const DetailedAuctionModal = ({ report, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold">Auction Report Details</h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
            >
              &times;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Auction Details</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Auction ID:</span> {report.auctionId}</p>
                <p><span className="font-medium">Property Type:</span> {report.propertyType}</p>
                <p><span className="font-medium">Customer:</span> {report.customerName}</p>
                <p><span className="font-medium">Location:</span> {report.propertyLocation}, {report.state}</p>
                <p><span className="font-medium">Auction Date:</span> {formatDateToDDMMMYY(report.auctionDate)}</p>
                <p><span className="font-medium">Reserve Price:</span> ₹{report.reservePrice?.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Bidding Summary</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Registered Participants:</span> {report.registeredParticipants}</p>
                <p><span className="font-medium">Active Bidders:</span> {report.activeBidders}</p>
                <p><span className="font-medium">Total Bids:</span> {report.totalBids}</p>
                <p><span className="font-medium">Highest Bid:</span> ₹{report.highestBid.toLocaleString()}</p>
                <p><span className="font-medium">Highest Bidder:</span> {report.highestBidder}</p>
                <p>
                  <span className="font-medium">Auction Success:</span> {report.highestBid >= report.reservePrice 
                  ? <span className="text-green-600">Yes</span> 
                  : <span className="text-red-600">No</span>}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-800">Bid History</h4>
          </div>

          {report.bids && report.bids.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bid Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bidder
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.bids.map((bid, index) => (
                    <tr key={index} className={index === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        ₹{bid.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {bid.bidder}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {bid.organization}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(bid.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No bids recorded for this auction
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionReports;