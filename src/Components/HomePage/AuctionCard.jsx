import React, { useState, useEffect } from "react";
import {  
  Clock, 
  MapPin, 
  Building2, 
  Landmark, 
  Timer,
  IndianRupee,
  Gavel,
  Heart
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { isRegistrationOpen, isAuctionLive, getTimeRemaining } from "../../Utils/helper";
import { useSelector } from "react-redux";
import api from "../../Utils/axios"

const AuctionCard = ({ auction }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isInterested, setIsInterested] = useState(false);
  const [loadingInterest, setLoadingInterest] = useState(false);
  
  useEffect(() => {
    // Check if property is in user's interested list
    if (!user || !user.interestedProperties) return;
    
    const isInInterested = user.interestedProperties.includes(auction._id);
    setIsInterested(isInInterested);
  }, [auction, user]);

  const toggleInterested = async (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (!user) {
      navigate('/login', { state: { from: `/property/${auction._id}` } });
      return;
    }
    
    setLoadingInterest(true);
    
    try {
      if (isInterested) {
        // Remove from interested
        await api.delete(`/auth/interested-properties/${auction._id}`);
        setIsInterested(false);
      } else {
        // Add to interested
        await api.post(`/auth/interested-properties/${auction._id}`);
        setIsInterested(true);
      }
    } catch (error) {
      console.error('Error updating interested status:', error);
    } finally {
      setLoadingInterest(false);
    }
  };

  if (!auction) {
    return <p className="text-red-500">Error: Auction data is missing.</p>;
  }
  
  // Using the new property model structure
  const customerName = auction.customerName 
    ? auction.customerName.split("(Property")[0].trim() 
    : "";

  // Calculate days left until EMD submission deadline
  const isLive = isAuctionLive(auction.auctionDate);
  const canRegister = isRegistrationOpen(auction.emdSubmission, auction.auctionDate);
  const daysLeft = getTimeRemaining(auction.emdSubmission);
  const progressPercentage = Math.min(100, Math.max(0, (daysLeft / 30) * 100));
  
  const renderActionButton = () => {
    if (isLive) {
      return (
        <button 
          className="flex-1 px-6 py-4 text-white bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 font-medium border border-transparent hover:border-primary"
          onClick={() => navigate(`/property/${auction._id}/live-auction`)}
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
          onClick={() => navigate(`/property/${auction._id}/tender-payment`)}
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
                {auction.propertyType || "Untitled Property"}
              </h3>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{auction.propertyLocation}, {auction.state || ""}</span>
              </div>
            </div>
          </div>

          {/* Asset Type Badge and Interest Button */}
          <div className="flex items-start gap-2">
            <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
              {auction.possessionType || "N/A"}
            </span>
            
            <span 
              onClick={toggleInterested}
              className={`p-0 pt-1 cursor-pointer ${
                isInterested 
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-gray-50 text-gray-400'
              }`}
              aria-label={isInterested ? 'Remove from interested' : 'Add to interested'}
              title={isInterested ? 'Remove from interested' : 'Add to interested'}
            >
              <Heart className={`w-5 h-5 ${isInterested ? 'fill-current' : ''}`} />
            </span>
          </div>
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
                {`${auction.reservePrice?.toLocaleString()}` || "N/A"}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Landmark className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {auction.vendor || "Vendor N/A"}
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
                {auction.auctionDate ? new Date(auction.auctionDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Details</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Loan: {auction.loanAccountNo || "N/A"}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <strong>Zone:</strong> {auction.zone || "N/A"} | <strong>Region:</strong> {auction.region || "N/A"}
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
          EMD Submission deadline: {auction.emdSubmission ? new Date(auction.emdSubmission).toLocaleDateString() : "N/A"}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button 
          className="flex-1 px-6 py-4 text-primary-dark transition-colors border border-primary hover:border-primary"
          onClick={() => navigate(`/property/${auction._id}`)}
        >
          View Property Details
        </button>
        {renderActionButton()}
      </div>
    </div>
  );
};

export default AuctionCard;