import React from 'react';
import { Navigate } from 'react-router-dom';
import { getFirstAllowedRoute, hasPermission, isAdmin } from '../../utils/helper';

/**
 * ProtectedRoute component - Wraps routes to enforce role/permission-based access
 *
 * @param {Object} props
 * @param {React.Component} props.children - The component to render if access is granted
 * @param {boolean} props.requiresAdmin - If true, only admin users can access
 * @param {string} props.requiredPermission - If specified, user must have this permission (e.g., 'marriage', 'library')
 */
const ProtectedRoute = ({ children, requiresAdmin = false, requiredPermission = null }) => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // If no user or no role, redirect to login
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin-only route
  if (requiresAdmin) {
    if (!isAdmin(user)) {
      // Redirect to first allowed route
      const firstRoute = getFirstAllowedRoute(user);
      return <Navigate to={firstRoute} replace />;
    }
  }

  // Check if permission-based route
  if (requiredPermission) {
    if (!hasPermission(user, requiredPermission)) {
      // Redirect to first allowed route
      const firstRoute = getFirstAllowedRoute(user);
      return <Navigate to={firstRoute} replace />;
    }
  }

  // Access granted - render the protected component
  return children;
};

export default ProtectedRoute;
