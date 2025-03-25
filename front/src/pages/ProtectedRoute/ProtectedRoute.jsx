import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('accessToken');
  return token ? element : <Navigate to="/login/authorization" />;
};

export default ProtectedRoute;
