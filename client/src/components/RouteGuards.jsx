import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

// ==========================================
// 1. PUBLIC ROUTE (Login, Signup)
// ==========================================
// Behavior: If user is ALREADY logged in, kick them to Dashboard immediately.
export const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// ==========================================
// 2. PROTECTED ROUTE (Dashboard, Create, etc.)
// ==========================================
// Behavior: If user is NOT logged in, kick them to Login immediately.
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};