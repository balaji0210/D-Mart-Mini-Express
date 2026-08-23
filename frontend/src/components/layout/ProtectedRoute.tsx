import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  requiredRole?: UserRole | UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user || (!roles.includes(user.role) && user.role !== 'ADMIN')) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-md w-full dmart-card p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">403 — Unauthorized Access</h2>
            <p className="text-slate-600 text-xs leading-relaxed">
              You do not have the required permission ({Array.isArray(requiredRole) ? requiredRole.join(' / ') : requiredRole}) to access this portal page.
            </p>
            <a
              href="/"
              className="btn-primary inline-flex py-2 px-5 text-xs"
            >
              Return to Homepage
            </a>
          </div>
        </div>
      );
    }
  }


  return <Outlet />;
};
