import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaUser, FaHeart, FaHistory, FaChevronRight } from 'react-icons/fa';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.firstName} {user?.lastName}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Dashboard Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Dashboard Menu</h2>
              <ul className="space-y-2">
                <li>
                  <NavLink 
                    to="/dashboard/profile" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <FaUser className="mr-3" />
                    <span>Profile Settings</span>
                    <FaChevronRight className="ml-auto" />
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/interested-properties" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <FaHeart className="mr-3" />
                    <span>Interested Properties</span>
                    <FaChevronRight className="ml-auto" />
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/dashboard/bidding-history" 
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <FaHistory className="mr-3" />
                    <span>Bidding History</span>
                    <FaChevronRight className="ml-auto" />
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mt-4">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Account Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-800 font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Organization:</span>
                  <span className="text-gray-800 font-medium">{user?.organizationName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;