import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { SignIn, SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import './App.css'
import RoleSelection from './components/RoleSelection'
import AdminDashboard from './components/AdminDashboard'
import GuestDashboard from './components/GuestDashboard'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedOut>
                  <div className="flex justify-center items-center min-h-[80vh]">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                      <h1 className="text-3xl font-bold text-center mb-6">Welcome to BookKeep</h1>
                      <SignIn redirectUrl="/role-selection" />
                    </div>
                  </div>
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
  
  return null;
}

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useUser();
  const userRole = localStorage.getItem('userRole');

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/role-selection" replace />;
  }

  return children;
}

export default App;
