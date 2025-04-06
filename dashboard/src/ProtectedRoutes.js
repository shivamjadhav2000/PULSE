import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ user }) => {
    console.log("ProtectedRoutes user:", user); // Debugging line
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
