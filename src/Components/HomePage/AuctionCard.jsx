import React from "react";
import {  
  Clock, 
  MapPin, 
  Building2, 
  Landmark, 
  ArrowRight, 
  Timer,
  IndianRupee
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();
  
  if (!auction) {
    return <p className="text-red-500">Error: Auction data is missing.</p>;
  }

  const getTimeRemaining = (endDate) => {
    if (!endDate) return 0;
    
    const parsedEndDate = parseDate(endDate);
    const total = parsedEndDate - Date.now();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Helper to parse various date formats
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    
    // Handle "DD-MMM-YY" format (like "10-Jan-25")
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const monthNames = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        
        const day = parseInt(parts[0], 10);
        const month = monthNames[parts[1]];
        let year = parseInt(parts[2], 10);
        // Adjust two-digit year
        year = year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year;
        
        return new Date(year, month, day);
      }
    }
    
    // Fallback to standard date parsing
    return new Date(dateStr);
  };

  // Extract customer name without property number if present
  const customerName = auction["CUSTOMER NAME"] 
    ? auction["CUSTOMER NAME"].split("(Property")[0].trim() 
    : "";

  // Calculate days left until EMD submission deadline
  const daysLeft = getTimeRemaining(auction[" EMD Submission"]);
  const progressPercentage = Math.min(100, Math.max(0, (daysLeft / 30) * 100));

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-4">
            {/* Property Type Icon Container */}
            <div className="rounded-lg bg-purple-50 p-3">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {auction["Property Type"] || "Untitled Property"}
              </h3>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{auction["Property Location (City)"]}, {auction["State"] || ""}</span>
              </div>
            </div>
          </div>

          {/* Asset Type Badge */}
          <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
            {auction["Types of  Possession"] || "N/A"}
          </span>
        </div>

        {/* Price and Details Grid */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* Left Column - Price and Borrower Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Reserve Price</p>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-5 h-5 text-gray-700" />
                <span className="text-2xl font-bold text-gray-800">
                  {auction["Reserve Price (Rs.)"]?.toLocaleString() || "N/A"}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Landmark className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {auction["Vendor"] || "Vendor N/A"}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Borrower:</strong> {customerName || "N/A"}
              </div>
            </div>
          </div>

          {/* Right Column - Time Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Auction Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {auction["Auction Date"] || "N/A"}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Details</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Loan: {auction["Loan Account No"] || "N/A"}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <strong>Zone:</strong> {auction["ZONE"] || "N/A"} | <strong>Region:</strong> {auction["REGION"] || "N/A"}
            </div>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-600">
                EMD Submission Deadline
              </span>
            </div>
            <span className="text-sm font-medium text-primary">
              {daysLeft} days left
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Participation Info */}
        <div className="text-sm text-gray-600">
          EMD Submission deadline: {auction[" EMD Submission"] || "N/A"}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex border-t border-gray-100">
        <button 
          className="flex-1 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors border border-transparent hover:border-primary"
          onClick={() => window.location.href=`/property/${auction._id}`}
        >
          View Property Details
        </button>
        <button 
          className="flex-1 px-6 py-4 text-white bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 font-medium border border-transparent hover:border-primary"
          onClick={() =>  window.location.href=`/property/${auction._id}/tender-payment`}
        >
          Bid Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AuctionCard;