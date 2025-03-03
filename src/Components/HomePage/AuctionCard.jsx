import React from "react";
import {  
  Clock, 
  MapPin, 
  Building2, 
  Landmark, 
  ArrowRight, 
  Timer,
  IndianRupee,
  Gavel
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { isRegistrationOpen,isAuctionLive,getTimeRemaining } from "../../Utils/helper";
const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();
  console.log(auction["Reserve Price (Rs.)"]);
  if (!auction) {
    return <p className="text-red-500">Error: Auction data is missing.</p>;
  }
  const customerName = auction["CUSTOMER NAME"] 
    ? auction["CUSTOMER NAME"].split("(Property")[0].trim() 
    : "";

  // Calculate days left until EMD submission deadline
  const isLive = isAuctionLive(auction["Auction Date"]);
  const canRegister = isRegistrationOpen(auction[" EMD Submission"], auction["Auction Date"]);
  const daysLeft = getTimeRemaining(auction["EMD Submission"]);
  const progressPercentage = Math.min(100, Math.max(0, (daysLeft / 30) * 100));
  const renderActionButton = () => {
    if (isLive) {
      return (
        <button 
          className="flex-1 px-6 py-4 text-white bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 font-medium border border-transparent hover:border-primary"
          onClick={() => window.location.href=`/property/${auction._id}/live-auction`}
        >
          <Gavel className="w-4 h-4" />
          Bid Now
        </button>
      );
    }

    if (canRegister) {
      return (
        <button 
          className="flex-1 px-6 py-4 text-white bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 font-medium border border-transparent hover:border-green-600"
          onClick={() => window.location.href=`/property/${auction._id}/tender-payment`}
        >
          Register Now
        </button>
      );
    }

    return (
      <button 
        className="flex-1 px-6 py-4 text-gray-500 bg-gray-100 cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        disabled
      >
        Registration Closed
      </button>
    );
  };
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
                {`${auction["Reserve Price (Rs"][')']?.toLocaleString()}` || "N/A"}
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
          EMD Submission deadline: {auction["EMD Submission"] || "N/A"}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button 
          className="flex-1 px-6 py-4 text-primary-dark transition-colors border border-primary hover:border-primary"
          onClick={() => window.location.href=`/property/${auction._id}`}
        >
          View Property Details
        </button>
        {renderActionButton()}
      </div>
    </div>
  );
};

export default AuctionCard;