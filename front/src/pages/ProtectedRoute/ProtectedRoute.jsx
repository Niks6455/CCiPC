import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const user = useSelector(state => state.user.user.data.email);
  // const token = localStorage.getItem('accessToken');
  return user ? element : <Navigate to="/login/authorization" />;
};

export default ProtectedRoute;
