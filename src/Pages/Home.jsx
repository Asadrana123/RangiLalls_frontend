// In Home.jsx

import React, { useState, useEffect } from "react";
import AuctionCard from "../Components/HomePage/AuctionCard";
import { ModernFilterSection } from '../Components/HomePage/CustomInput';
import { useSelector } from "react-redux";
import SEO from "../Utils/SEO";

const Home = () => {
  const { properties, error } = useSelector((state) => state.property);
  const [filteredProperties, setFilteredProperties] = useState([]);
  
  useEffect(() => {
    // Initially show all properties
    setFilteredProperties(properties);
  }, [properties]);

  const handleSearch = (filters) => {
    // Filter the properties based on selected filters
    const filtered = properties.filter(property => {
      // Property Type filter
      if (filters.propertyType && property["Property Type"] !== filters.propertyType) {
        return false;
      }
      
      // City filter
      if (filters.city && property["Property Location (City)"] !== filters.city) {
        return false;
      }
      
      // Bank/Vendor filter
      // if (filters.bank && property["Vendor"] !== filters.bank) {
      //   return false;
      // }
      
      // Price filter - check if reserve price is less than or equal to the specified price
      console.log(filters.price);
      if (filters.price && property["Reserve Price (Rs)"] <= parseFloat(filters.price)) {
        return false;
      }
      
      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const auctionDate = new Date(property["Auction Date"]);
        
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (auctionDate < fromDate) return false;
        }
        
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (auctionDate > toDate) return false;
        }
      }
      
      return true;
    });
    
    setFilteredProperties(filtered);
  };

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

 // Update the Auction Listings section in Home.jsx

return (
  <>
    <SEO 
      title="Rangi Lalls - Premier Government Auctioneers – India's Leading Property Auction Platform"
      description="Find and bid on property auctions across India with Rangi Lalls. Secure, transparent, and hassle-free online bidding. Register now!"
      keywords="property auction, e-auction platform, bank auction property, real estate bidding, online property auction India, buy auction property, industrial auction, foreclosure auction"
      url="https://www.rangilalls.com/"
    />
    <div className="min-h-screen bg-gray-50 mt-20 flex flex-col">
      <div className="container mx-auto p-4 flex flex-col flex-grow">
        {/* Filter Section - This stays fixed */}
        <div className="mb-8">
          <ModernFilterSection onSearch={handleSearch} />
        </div>

        {/* Auction Listings - This becomes scrollable */}
        <div className="flex-grow overflow-hidden flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Available Properties 
            <span className="ml-2 text-sm text-primary bg-purple-50 px-3 py-1 rounded-full">
              {filteredProperties.length}
            </span>
          </h2>
          
          <div className="flex-grow overflow-y-auto pr-2" style={{ maxHeight: "calc(110vh - 100px)" }}>
            <div className="space-y-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((auction) => (
                  <AuctionCard key={auction._id} auction={auction} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No properties match your selected filters.</p>
                  <button 
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    onClick={() => setFilteredProperties(properties)}
                  >
                    Show All Properties
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
};

export default Home;