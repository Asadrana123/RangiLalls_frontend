// src/components/PrivateAdminRoute.js
import React from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
const PrivateAdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }
  
  return <Outlet/>;
};

export default PrivateAdminRoute;