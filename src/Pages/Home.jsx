import React from "react";
import AuctionCard from "../Components/HomePage/AuctionCard";
import StatsSection from "../Components/HomePage/StatsSection";
import FilterSection from "../Components/HomePage/FilterSection";
import { Loader } from "lucide-react";
import {  useSelector } from "react-redux";
import { useEffect } from "react";
import {ModernFilterSection} from '../Components/HomePage/CustomInput';
import SEO from "../Utils/SEO";
const Home = () => {
  const { properties,error } = useSelector((state) => state.property);
  const handleSearch = (filters) => {
    console.log("Searching with filters:", filters);
  }
  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }
  return (
    <>
    <SEO 
        title="Rangi Lalls - Premier Government Auctioneers – India’s Leading Property Auction Platform"
        description="Find and bid on property auctions across India with Rangi Lalls. Secure, transparent, and hassle-free online bidding. Register now!"
        keywords="property auction, e-auction platform, bank auction property, real estate bidding, online property auction India, buy auction property, industrial auction, foreclosure auction"
        url="https://www.rangilalls.com/"
      />
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
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
      </div>
    </div>
    </>
  );
};

export default Home;
