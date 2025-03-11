import React, { useState } from 'react';
import { Search, Calendar, MapPin, Building2, BadgeDollarSign, Landmark } from 'lucide-react';

// Custom Select Input Component
const CustomSelect = ({ label, value, onChange, options, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
      <div 
        className="w-full flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {Icon && <Icon className="w-5 h-5 text-gray-500" />}
        <span className="flex-1 text-gray-700">
          {value ? options.find(opt => opt.value === value)?.label : `Select ${label}`}
        </span>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Modern Filter Section
const ModernFilterSection = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    propertyType: '',
    price: '',
    dateFrom: '',
    dateTo: '',
    city: '',
    bank: ''
  });

  // In CustomInput.jsx, update the ModernFilterSection component
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear().toString().substring(2)}`;
  };
// Update the property types to match your actual data
const propertyTypes = [
  { value: 'RESIDENTIAL HOUSE', label: 'Residential House' },
  { value: 'COMMERCIAL', label: 'Commercial Space' },
  { value: 'INDUSTRIAL', label: 'Industrial Property' },
  { value: 'LAND', label: 'Land/Plot' }
];

// Update cities based on your data
const cities = [
  { value: 'LUDHIANA', label: 'Ludhiana' },
  { value: 'DELHI', label: 'Delhi' },
  { value: 'MUMBAI', label: 'Mumbai' },
  { value: 'BANGALORE', label: 'Bangalore' }
];
  const banks = [
    { value: 'Cholamandalam Investment and Finance Company Limited (CIFCL)', label: 'Cholamandalam Investment and Finance Company Limited (CIFCL)' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Property Auctions
          <span className="ml-2 text-sm text-primary bg-purple-50 px-3 py-1 rounded-full">
            215 Active
          </span>
        </h2>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CustomSelect
          label="Property Type"
          value={filters.propertyType}
          onChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}
          options={propertyTypes}
          icon={Building2}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Reserve Price</label>
          <div className="relative">
            <BadgeDollarSign className="absolute left-3 top-3 text-gray-500" />
            <input
              type="number"
              className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
              placeholder="Maximum price"
              value={filters.price}
              onChange={(e) => setFilters(prev => ({ ...prev, price: e.target.value }))}
            />
          </div>
        </div>

        <CustomSelect
          label="Location"
          value={filters.city}
          onChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
          options={cities}
          icon={MapPin}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Auction Date From</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-500" />
            <input
              type="date"
              className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Auction Date To</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-500" />
            <input
              type="date"
              className="w-full pl-10 p-3 bg-white border border-gray-200 rounded-lg focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            />
          </div>
        </div>

        <CustomSelect
          label="Bank"
          value={filters.bank}
          onChange={(value) => setFilters(prev => ({ ...prev, bank: value }))}
          options={banks}
          icon={Landmark}
        />
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={() => setFilters({
            propertyType: '',
            price: '',
            dateFrom: '',
            dateTo: '',
            city: '',
            bank: ''
          })}
          className="px-6 py-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Reset Filters
        </button>
        <button
          onClick={() => onSearch(filters)}
          className="px-6 py-2.5 text-white bg-primary hover:bg-primary-dark rounded-lg flex items-center gap-2 transition-colors"
        >
          <Search className="w-4 h-4" />
          Search Properties
        </button>
      </div>
    </div>
  );
};

export {ModernFilterSection,CustomSelect}