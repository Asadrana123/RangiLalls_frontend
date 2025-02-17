import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DonutChart = ({ data, colors }) => (
  <div className="h-48">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const Legend = ({ items, colors }) => (
  <div className="mt-4 space-y-2">
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        <div
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: colors[index] }}
        />
        <span className="text-sm text-gray-600">{item.name}</span>
      </div>
    ))}
  </div>
);

const StatCard = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center">
    <h3 className="text-orange-500 text-4xl font-bold mb-2">{value}</h3>
    <p className="text-gray-800 font-medium mb-1">{title}</p>
    {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
  </div>
);

const StatsSection = () => {
  const cityData = [
    { name: 'Surat', value: 30 },
    { name: 'Pune', value: 25 },
    { name: 'Ghaziabad', value: 20 },
    { name: 'Ahmedabad', value: 15 },
    { name: 'New Delhi', value: 10 }
  ];

  const bankData = [
    { name: 'Indiabulls Housing F.', value: 35 },
    { name: 'Cholamandalam', value: 30 },
    { name: 'SAMMAA', value: 20 },
    { name: 'Assets Ca...', value: 15 }
  ];

  const cityColors = ['#D97706', '#E88A14', '#F59E0B', '#FBBF24', '#FCD34D'];
  const bankColors = ['#D97706', '#E88A14', '#F59E0B', '#FBBF24'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* City Wise Auction */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">City Wise Auction</h3>
        <DonutChart data={cityData} colors={cityColors} />
        <Legend items={cityData} colors={cityColors} />
      </div>

      {/* Bank Wise Auction */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Wise Auction</h3>
        <DonutChart data={bankData} colors={bankColors} />
        <Legend items={bankData} colors={bankColors} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-rows-3 gap-4">
        <StatCard
          title="Today's Auction"
          value="8"
        />
        <StatCard
          title="Total Auction Value"
          value="16986.19 CR."
        />
        <StatCard
          title="Number of Cities"
          value="314"
        />
      </div>
    </div>
  );
};

export default StatsSection;