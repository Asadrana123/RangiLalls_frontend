import React from "react";
import {  Clock, 
  MapPin, 
  Building2, 
  Landmark, 
  ArrowRight, 
  Timer,
  IndianRupee} from 'lucide-react';
import {useNavigate} from "react-router-dom";
const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();
  if (!auction) {
    return <p className="text-red-500">Error: Auction data is missing.</p>;
  }

  const getTimeRemaining = (endDate) => {
    const total = Date.parse(endDate) - Date.parse(new Date());
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysLeft = getTimeRemaining(auction.participationClosingDate?.date);
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
                {auction.auctionTitle || "Untitled Auction"}
              </h3>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{auction.noticeDetails?.issuedBranch || "Location N/A"}</span>
              </div>
            </div>
          </div>

          {/* Asset Type Badge */}
          <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
            {auction.assetType}
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
                  {auction.reservePrice?.toLocaleString() || "N/A"}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Landmark className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {auction.noticeDetails?.issuedBy || "Bank N/A"}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Borrower:</strong> {auction.borrowerDetails?.name || "N/A"}
              </div>
            </div>
          </div>

          {/* Right Column - Time Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Auction Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(auction.auctionDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Bid Time</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {auction.bidTimeDetails?.timeIn} - {auction.bidTimeDetails?.time}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <strong>Zone:</strong> {auction.zoneName}
            </div>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-600">
                Registration Closes In
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
          Participation closes on: {new Date(auction.participationClosingDate?.date).toLocaleDateString()} {auction.participationClosingDate?.time}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex border-t border-gray-100">
        <button className="flex-1 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors border border-transparent hover:border-primary"
         onClick={() => window.location.href=`/property/${auction._id}`}
        >
          View Property Details
        </button>
        <button className="flex-1 px-6 py-4 text-white bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 font-medium border border-transparent hover:border-primary"
         onClick={() => window.location.href=`/property/${auction._id}/tender-payment`}
        >
          Bid Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AuctionCard;