import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TenderPayment = () => {
  const { id } = useParams();
  const { properties } = useSelector((state) => state.property);

  // Find the selected property from store
  const selectedProperty = properties.find(property => property._id === id);
  console.log(selectedProperty)
  if (!selectedProperty) {
    return (
      <div className="text-center text-gray-500 p-4">
        Property not found
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href=`/property/${selectedProperty._id}/auction-registration`;
  };

  return (
    <div className="max-w-3xl mx-auto p-4 mt-20 min-h-[50vh]">
      <h1 className="text-2xl font-semibold mb-8">
        <span className="text-primary">Tender Payment</span> for E-Auction
      </h1>

      <div className="mb-8">
        <h2 className="text-xl">
          <span className="text-gray-600">AUCTION ID : </span>
          <span className="text-primary">{selectedProperty._id}</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">
            Tender Fees (In Rs)*
          </label>
          <input
            type="number"
            disabled
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 cursor-not-allowed"
            min="0"
            required
            value={0}
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          I ACCEPT, REGISTER ME
        </button>
      </form>
    </div>
  );
};

export default TenderPayment;