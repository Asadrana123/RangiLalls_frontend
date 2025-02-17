import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SelectInput = ({ label, value, onChange, options, placeholder }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const FilterSection = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    propertyType: '',
    price: '',
    dateFrom: '',
    dateTo: '',
    city: '',
    bank: ''
  });

  const propertyTypes = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'plot', label: 'Plot' },
    { value: 'agricultural', label: 'Agricultural' }
  ];

  const cities = [
    { value: 'indore', label: 'Indore' },
    { value: 'shajapur', label: 'Shajapur' },
    { value: 'dewas', label: 'Dewas' },
    { value: 'bhopal', label: 'Bhopal' }
  ];

  const banks = [
    { value: 'chola', label: 'Cholamandalam' },
    { value: 'hdfc', label: 'HDFC Bank' },
    { value: 'sbi', label: 'State Bank of India' },
    { value: 'icici', label: 'ICICI Bank' }
  ];

  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      propertyType: '',
      price: '',
      dateFrom: '',
      dateTo: '',
      city: '',
      bank: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Upcoming Auctions <span className="text-orange-500">(102)</span>
        </h2>
        <button className="text-orange-500 hover:text-orange-600 font-medium">
          View All Auctions
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <SelectInput
          label="Type of Property"
          value={filters.propertyType}
          onChange={(value) => handleChange('propertyType', value)}
          options={propertyTypes}
          placeholder="All Types"
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Reserve Price Upto
          </label>
          <input
            type="number"
            value={filters.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="Enter amount"
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Auction Date From
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleChange('dateFrom', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Auction Date To
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleChange('dateTo', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <SelectInput
          label="Select City"
          value={filters.city}
          onChange={(value) => handleChange('city', value)}
          options={cities}
          placeholder="-- Any --"
        />

        <SelectInput
          label="Select Bank"
          value={filters.bank}
          onChange={(value) => handleChange('bank', value)}
          options={banks}
          placeholder="-- Select Bank --"
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
        >
          <FaTimes className="text-gray-600" />
          Clear
        </button>
        <button
          onClick={() => onSearch(filters)}
          className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 flex items-center gap-2"
        >
          <FaSearch />
          Search
        </button>
      </div>
    </div>
  );
};

export default FilterSection;