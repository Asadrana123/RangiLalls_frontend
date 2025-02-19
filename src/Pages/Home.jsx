import React from "react";
import AuctionCard from "../Components/HomePage/AuctionCard";
import StatsSection from "../Components/HomePage/StatsSection";
import FilterSection from "../Components/HomePage/FilterSection";
import { Loader } from "lucide-react";
import { fetchProperties } from "../redux/Slices/propertySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {ModernFilterSection} from '../Components/HomePage/CustomInput';
const Home = () => {
  const { properties, loading, error } = useSelector((state) => state.property);
  const handleSearch = (filters) => {
    console.log("Searching with filters:", filters);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <div className="container mx-auto p-4">
        {/* Stats Section */}
        {/* <div className="mb-8">
          <StatsSection />
        </div> */}

        {/* Filter Section */}
        <div className="mb-8">
          <ModernFilterSection onSearch={handleSearch} />
        </div>

        {/* Auction Listings */}
        <div className="space-y-6">
        {properties.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
