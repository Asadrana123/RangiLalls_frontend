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
  FileSpreadsheet,
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
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, loading, error } = useSelector((state) => state.property);
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
    { id: "overview", label: "Overview", icon: Home },
    { id: "details", label: "Property Details", icon: Info },
    { id: "documents", label: "Documents", icon: FileSpreadsheet },
  ];

  // Extract customer name without property number if present
  const customerName = property["CUSTOMER NAME"]
    ? property["CUSTOMER NAME"].split("(Property")[0].trim()
    : "";
  
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
                value={`₹${property["Reserve Price (Rs.)"]?.toLocaleString()}`}
                variant="highlight"
              />
              <InfoCard
                icon={Timer}
                label="Auction Date"
                value={property["Auction Date"]}
              />
              <InfoCard
                icon={Users}
                label="Vendor"
                value={property["Vendor"]}
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
                    <p className="font-medium">{property["Property Type"]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">
                      {property["Property Location (City)"]},{" "}
                      {property["State"]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Zone</p>
                    <p className="font-medium">{property["ZONE"]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Region</p>
                    <p className="font-medium">{property["REGION"]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Possession Type</p>
                    <p className="font-medium">
                      {property["Types of  Possession"]}
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
                        {property[" EMD Submission"]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#d12b3f]" />
                    <div>
                      <p className="text-sm text-gray-500">Auction Date</p>
                      <p className="font-medium">{property["Auction Date"]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#d12b3f]" />
                    <div>
                      <p className="text-sm text-gray-500">Auction ID</p>
                      <p className="font-medium">{property["Auction ID"]}</p>
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
                    <p className="font-medium">{property["Loan Account No"]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CIF ID</p>
                    <p className="font-medium">{property["CIF ID"]}</p>
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
                      ₹{property["Reserve Price (Rs.)"]?.toLocaleString()}
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
                  address={`${property["Property Location (City)"]}, ${property["State"]}`}
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
                  <p className="font-medium">{property["CIF ID"]}</p>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                Detailed Description
              </h3>
              <p className="text-gray-600">{property["Property Schedule"]}</p>
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
  const propertyTitle = property["CUSTOMER NAME"]
    ? `${property["Property Type"]} - ${customerName}`
    : `${property["Property Type"]} in ${property["Property Location (City)"]}`;

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
                  {property["Property Location (City)"]}, {property["State"]}
                </span>
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
