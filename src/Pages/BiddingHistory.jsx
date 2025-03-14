import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  FaArrowUp, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaSearch,
  FaTrophy,
  FaClock
} from 'react-icons/fa';
import api from '../Utils/axios';

const BiddingHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'won', 'active', 'lost'

  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/bidding-history');
        console.log(response)
        // Assuming the bids come with property details already populated
        // If not, you might need to fetch property details separately
        setBids(response.data.data);
        setError('');
      } catch (err) {
        console.error('Error fetching bid history:', err);
        setError('Failed to load your bidding history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBidHistory();
  }, [user._id]);

  // Filter bids based on search term and filter type
  const filteredBids = bids.filter(bid => {
    const matchesSearch = 
      bid.property?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.property?.propertyType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.property?.propertyLocation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'won') return matchesSearch && bid.isWinningBid;
    if (filter === 'active') return matchesSearch && bid.auctionActive;
    if (filter === 'lost') return matchesSearch && !bid.isWinningBid && !bid.auctionActive;
    
    return matchesSearch;
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Bidding History</h2>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by property name or location..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All Bids
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'active' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('won')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'won' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Won
          </button>
          <button
            onClick={() => setFilter('lost')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'lost' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Lost
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}
      
      {filteredBids.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">
            {searchTerm || filter !== 'all' 
              ? 'No bids match your search criteria.' 
              : 'You have not placed any bids yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
          {filteredBids.map((bid, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Property Info */}
                <div className="p-4 md:w-2/3">
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <FaBuilding className="text-primary text-xl" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">
                        {bid.property?.propertyType || "Unknown Property Type"}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>
                          {bid.property?.propertyLocation || "Unknown Location"}, 
                          {bid.property?.["State"] || ""}
                        </span>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                          Loan A/C: {bid.property?.loanAccountNo || "N/A"}
                        </span>
                        <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-xs">
                          Owner: {bid.property?.customerName|| "N/A"}
                        </span>
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs">
                          Auction Date: {bid.property?.auctionDate || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bid Info */}
                <div className={`p-4 md:w-1/3 flex flex-col justify-between ${
                  bid.isWinningBid 
                    ? 'bg-green-50 border-l-4 border-green-500' 
                    : bid.auctionActive
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'bg-gray-50 border-l-4 border-gray-300'
                }`}>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Your bid:</span>
                      <span className="font-bold text-lg">₹{bid.amount?.toLocaleString() || "0"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-600">Status:</span>
                      <span className={`flex items-center ${
                        bid.isWinningBid 
                          ? 'text-green-600' 
                          : bid.auctionActive
                            ? 'text-blue-600'
                            : 'text-gray-600'
                      }`}>
                        {bid.isWinningBid ? (
                          <>
                            <FaTrophy className="mr-1" />
                            <span>Winning Bid</span>
                          </>
                        ) : bid.auctionActive ? (
                          <>
                            <FaClock className="mr-1" />
                            <span>Auction Active</span>
                          </>
                        ) : (
                          <>
                            <span>Auction Ended</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-right text-xs text-gray-500">
                    <span>Bid placed: {new Date(bid.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BiddingHistory;