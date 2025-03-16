import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PropertyMap from "../Components/AuctionDetails/PropertyMap";
import api from "../Utils/axios"
import {formatDateToDDMMMYY} from "../Utils/helper";
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
  FileSpreadsheet,
  Heart
} from "lucide-react";

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
      active ? "bg-[#d12b3f] text-white" : "text-gray-600 hover:bg-gray-50"
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const InfoCard = ({ icon: Icon, label, value, variant }) => (
  <div
    className={`flex items-center gap-3 p-4 rounded-lg ${
      variant === "highlight" ? "bg-[#fff5f6] text-[#d12b3f]" : "bg-gray-50"
    }`}
  >
    <Icon className="w-6 h-6" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const PropertyDetails = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isInterested, setIsInterested] = useState(false);
  const [loadingInterest, setLoadingInterest] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector((state) => state.property);
  const { user } = useSelector((state) => state.auth);
  const property = properties.find((p) => p._id === id);

  useEffect(() => {
    // Check if property is in user's interested list
    if (!user || !user.interestedProperties || !property) return;
    
    const isInInterested = user.interestedProperties.includes(property._id);
    setIsInterested(isInInterested);
  }, [property, user]);

  const toggleInterested = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/property/${id}` } });
      return;
    }
    
    setLoadingInterest(true);
    
    try {
      if (isInterested) {
        // Remove from interested
        await api.delete(`/auth/interested-properties/${property._id}`);
        setIsInterested(false);
      } else {
        // Add to interested
        await api.post(`/auth/interested-properties/${property._id}`);
        setIsInterested(true);
      }
    } catch (error) {
      console.error('Error updating interested status:', error);
    } finally {
      setLoadingInterest(false);
    }
  };

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
    { id: "overview", label: "Overview", icon: Home },
    { id: "details", label: "Property Details", icon: Info },
    { id: "documents", label: "Documents", icon: FileSpreadsheet },
  ];

  // Extract customer name without property number if present
  const customerName = property.customerName
    ? property.customerName.split("(Property")[0].trim()
    : "";

  // Format dates for display
  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    //if (typeof dateValue === 'string') return dateValue;
    return new Date(dateValue).toLocaleDateString();
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
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
                value={formatDateToDDMMMYY(property.auctionDate)}
              />
              <InfoCard
                icon={Users}
                label="Vendor"
                value={property.vendor || "N/A"}
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
                    <p className="font-medium">{property.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">
                      {property.propertyLocation}, {property.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Zone</p>
                    <p className="font-medium">{property.zone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Region</p>
                    <p className="font-medium">{property.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Possession Type</p>
                    <p className="font-medium">
                      {property.possessionType}
                    </p>
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
                      <p className="text-sm text-gray-500">
                        EMD Submission Deadline
                      </p>
                      <p className="font-medium">
                        {formatDateToDDMMMYY(property.emdSubmission)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#d12b3f]" />
                    <div>
                      <p className="text-sm text-gray-500">Auction Date</p>
                      <p className="font-medium">{formatDateToDDMMMYY(property.auctionDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#d12b3f]" />
                    <div>
                      <p className="text-sm text-gray-500">Property ID</p>
                      <p className="font-medium">{property._id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#d12b3f]" />
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Loan Account No</p>
                    <p className="font-medium">{property.loanAccountNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CIF ID</p>
                    <p className="font-medium">{property.cifId}</p>
                  </div>
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
                    <p className="text-sm text-gray-500">Reserve Price</p>
                    <p className="font-medium">
                    ₹{property.reservePrice?.toLocaleString()}
                    </p>
                  </div>
                  {/* If you have EMD amount, add it here */}
                </div>
              </div>
            </div>

            {/* Map Section - Conditionally rendered if location coordinates exist */}
            {property.location && property.location.coordinates && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Location Map</h3>
                </div>
                <PropertyMap
                  coordinates={property.location.coordinates}
                  address={`${property.propertyLocation}, ${property.state}`}
                />
              </div>
            )}
          </div>
        );

      case "details":
        return (
          <div className="space-y-8">
            {/* Borrower Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                Borrower Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CIF ID</p>
                  <p className="font-medium">{property.cifId}</p>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                Detailed Description
              </h3>
              <p className="text-gray-600">{property.propertySchedule}</p>
            </div>
          </div>
        );

      case "documents":
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

  // Get property title from customer name or default to property location
  const propertyTitle = property.customerName
    ? `${property.propertyType} - ${customerName}`
    : `${property.propertyType} in ${property.propertyLocation}`;

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {propertyTitle}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {property.propertyLocation}, {property.state}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleInterested}
                disabled={loadingInterest}
                className={`p-3 rounded-lg transition-colors flex items-center gap-2 ${
                  isInterested 
                    ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                aria-label={isInterested ? 'Remove from interested' : 'Add to interested'}
              >
                <Heart className={`w-5 h-5 ${isInterested ? 'fill-current' : ''}`} />
                {isInterested ? 'Saved' : 'Save Property'}
              </button>
              
              <button
                onClick={() => navigate(`/property/${id}/live-auction`)}
                className="px-6 py-3 bg-[#d12b3f] text-white rounded-lg hover:bg-[#b82537] transition-colors flex items-center gap-2"
              >
                Participate in Auction
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            {tabs.map((tab) => (
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
      <div className="max-w-7xl mx-auto px-4 py-8">{renderTabContent()}</div>
    </div>
  );
};

export default PropertyDetails;