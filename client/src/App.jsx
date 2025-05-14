import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { FiShield } from 'react-icons/fi'
import './App.css'
import Login from './components/Login'
import RoleSelection from './components/RoleSelection'
import AdminDashboard from './components/AdminDashboard'
import GuestDashboard from './components/GuestDashboard'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedOut>
                  <Login />
                </SignedOut>
                <SignedIn>
                  <AuthRedirect />
                </SignedIn>
              </>
            }
          />
          <Route
            path="/role-selection"
            element={
              <SignedIn>
                <RoleSelection />
              </SignedIn>
            }
          />
          <Route
            path="/admin"
            element={
              <SignedIn>
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              </SignedIn>
            }
          />
          <Route
            path="/guest"
            element={
              <SignedIn>
                <ProtectedRoute requiredRole="guest">
                  <GuestDashboard />
                </ProtectedRoute>
              </SignedIn>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

function AuthRedirect() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  
  useEffect(() => {
    if (userRole) {
      navigate(userRole === 'admin' ? '/admin' : '/guest');
    } else {
      navigate('/role-selection');
    }
  }, [userRole, navigate]);
  
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useUser();
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== requiredRole) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <FiShield className="text-red-500 text-5xl" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Access Denied</h2>
        <p className="text-gray-600 text-center mb-6">
          You don't have permission to access this page. You need to be a {requiredRole} to view this content.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/role-selection')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Change Role
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default App;
