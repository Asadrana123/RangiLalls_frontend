import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropertyMap from "../Components/AuctionDetails/PropertyMap";
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Clock,
  IndianRupee,
  FileText,
  Building2,
  Users,
  Timer,
  ArrowRight,
  Info,
  Home,
  FileSpreadsheet
} from 'lucide-react';

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-[#d12b3f] text-white' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const InfoCard = ({ icon: Icon, label, value, variant }) => (
  <div className={`flex items-center gap-3 p-4 rounded-lg ${
    variant === 'highlight' 
      ? 'bg-[#fff5f6] text-[#d12b3f]' 
      : 'bg-gray-50'
  }`}>
    <Icon className="w-6 h-6" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const PropertyDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties,loading,error } = useSelector((state) => state.property);
  const property = properties.find((p) => p._id === id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 bg-gray-50 px-6 py-4 rounded-lg">
           Loading
        </div>
      </div>
    );
  }
 if (error || !property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 bg-gray-50 px-6 py-4 rounded-lg">
             Property not found
        </div>
      </div>
    );
  }
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'details', label: 'Property Details', icon: Info },
    { id: 'documents', label: 'Documents', icon: FileSpreadsheet }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard 
                icon={IndianRupee}
                label="Reserve Price"
                value={`₹${property.reservePrice?.toLocaleString()}`}
                variant="highlight"
              />
              <InfoCard 
                icon={Timer}
                label="Auction Date"
                value={new Date(property.auctionDate).toLocaleDateString()}
              />
              <InfoCard 
                icon={Users}
                label="Bank"
                value={property.noticeDetails?.issuedBy}
              />
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Property Overview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#d12b3f]" />
                  Property Overview
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Property Type</p>
                    <p className="font-medium">{property.assetType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{property.propertyAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Zone</p>
                    <p className="font-medium">{property.zoneName}</p>
                  </div>
                </div>
              </div>

              {/* Auction Timeline */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#d12b3f]" />
                  Auction Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#d12b3f]" />
                    <div>
                      <p className="text-sm text-gray-500">Registration Deadline</p>
                      <p className="font-medium">
                        {new Date(property.participationClosingDate?.date).toLocaleDateString()} at {property.participationClosingDate?.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#d12b3f]" />
                    <div>
                      <p className="text-sm text-gray-500">Auction Time</p>
                      <p className="font-medium">
                        {property.bidTimeDetails?.timeIn} - {property.bidTimeDetails?.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#d12b3f]" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Help Line</p>
                    <p className="font-medium">{property.helpLineNo}</p>
                  </div>
                  {property.inspectionDetails && (
                    <div>
                      <p className="text-sm text-gray-500">Inspection Contact</p>
                      <p className="font-medium">{property.inspectionDetails.contactDetails}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-[#d12b3f]" />
                  Financial Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Earnest Money</p>
                    <p className="font-medium">₹{property.earnestMoney?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Incremental Value</p>
                    <p className="font-medium">₹{property.incrementalValue?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Outstanding Amount</p>
                    <p className="font-medium">₹{property.outstandingAmount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            {property.location && property.location.coordinates && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Location Map</h3>
                </div>
                <PropertyMap
                  coordinates={property.location.coordinates}
                  address={property.propertyAddress}
                />
              </div>
            )}
          </div>
        );

      case 'details':
        return (
          <div className="space-y-8">
            {/* Borrower Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Borrower Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{property.borrowerDetails?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{property.borrowerDetails?.address}</p>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Detailed Description</h3>
              <p className="text-gray-600">{property.description}</p>
            </div>

            {/* Inspection Details */}
            {property.inspectionDetails && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Inspection Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{property.inspectionDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{property.inspectionDetails.time}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'documents':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Property Documents</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#d12b3f]" />
                  <span>Auction Notice</span>
                </div>
                <ArrowRight className="w-5 h-5" />
              </button>
              {/* Add more document buttons as needed */}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {property.auctionTitle}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{property.noticeDetails?.issuedBranch}</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/property/${id}/tender-payment`)}
              className="px-6 py-3 bg-[#d12b3f] text-white rounded-lg hover:bg-[#b82537] transition-colors flex items-center gap-2"
            >
              Participate in Auction
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                icon={tab.icon}
                label={tab.label}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PropertyDetails;