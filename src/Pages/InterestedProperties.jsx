import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaRupeeSign, 
  FaCalendarAlt, 
  FaHeart, 
  FaSearch,
  FaArrowRight
} from 'react-icons/fa';
import api from "../Utils/axios"
const InterestedProperties = () => {
  const { user } = useSelector((state) => state.auth);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed'

  useEffect(() => {
    const fetchInterestedProperties = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/interested-properties');
        setProperties(response.data.data);
        setError('');
      } catch (err) {
        console.error('Error fetching interested properties:', err);
        setError('Failed to load your interested properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterestedProperties();
  }, [user?._id]);

  const removeFromInterested = async (propertyId) => {
    try {
      const response = await api.delete(`/auth/interested-properties/${propertyId}`);
      if (response.data.success) {
        setProperties(properties.filter(prop => prop._id !== propertyId));
      }
    } catch (err) {
      console.error('Error removing property from interested list:', err);
      setError('Failed to remove property from your interested list. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString();
  };
  const isAuctionUpcoming = (auctionDate) => {
    if (!auctionDate) return false;
    
    const auctionDateTime = new Date(auctionDate);
    
    // Compare with today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return auctionDateTime >= today;
  };
  // Filter properties based on search term and filter type
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.propertyType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.propertyLocation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check auction date to determine if upcoming or completed
    const isUpcoming = isAuctionUpcoming(property.auctionDate);
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'upcoming') return matchesSearch && isUpcoming;
    if (filter === 'completed') return matchesSearch && !isUpcoming;
    
    return matchesSearch;
  });

  // Helper function to check if auction is upcoming
 
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Interested Properties</h2>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by property type, location, or owner..."
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
            All
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'upcoming' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'completed' 
                ? 'bg-gray-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}
      
      {filteredProperties.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">
            {searchTerm || filter !== 'all' 
              ? 'No properties match your search criteria.' 
              : 'You have not added any properties to your interested list yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProperties.map((property) => (
            <div key={property._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <FaBuilding className="text-primary text-xl" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">
                        {property.propertyType || "Unknown Property Type"}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>
                          {property.propertyLocation || "Unknown Location"}, 
                          {property.state || ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeFromInterested(property._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FaHeart size={20} />
                  </button>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-sm">Reserve Price</div>
                    <div className="flex items-center font-semibold mt-1">
                      <FaRupeeSign className="text-primary mr-1" />
                      {property.reservePrice?.toLocaleString() || "N/A"}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-sm">Auction Date</div>
                    <div className="flex items-center font-semibold mt-1">
                      <FaCalendarAlt className="text-primary mr-1" />
                      {formatDate(property.auctionDate)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  Owner: <span className="font-medium">{property.customerName || "N/A"}</span>
                </div>
                
                <div className={`mt-3 text-sm ${
                  isAuctionUpcoming(property.auctionDate)
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 bg-gray-50'
                } py-1 px-2 rounded inline-block`}>
                  {isAuctionUpcoming(property.auctionDate) 
                    ? 'Upcoming Auction' 
                    : 'Auction Completed'}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Link 
                    to={`/property/${property._id}`}
                    className="flex items-center text-primary hover:text-primary-dark transition-colors"
                  >
                    View Details
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterestedProperties;