import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiUsers, FiBookOpen, FiSettings, FiAlertCircle, FiCheck } from 'react-icons/fi';

// Configure axios base URL if needed (uncomment if your proxy isn't working)
// axios.defaults.baseURL = 'http://localhost:5000';

const RoleSelection = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [existingRole, setExistingRole] = useState(null);
  
  useEffect(() => {
    // If user already has a role stored locally, redirect them
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      navigate(userRole === 'admin' ? '/admin' : '/guest');
    }
    
    // Check if user already exists in database when component mounts
    const checkExistingUser = async () => {
      if (!isLoaded || !user) return;
      
      try {
        console.log('Checking for existing user with ID:', user.id);
        const response = await axios.get(`${API_URL}/users/get-role/${user.id}`);
        console.log('User check response:', response.data);
        
        if (response.data.success) {
          setUserExists(true);
          setExistingRole(response.data.role);
          localStorage.setItem('userRole', response.data.role);
          setTimeout(() => {
            navigate(response.data.role === 'admin' ? '/admin' : '/guest');
          }, 3000);
        }
      } catch (error) {
        console.log('User check error:', error);
        // User doesn't exist yet, which is fine in this case
        if (error.response && error.response.status !== 404) {
          setError('An error occurred while checking user status');
        }
      }
    };
    
    checkExistingUser();
  }, [isLoaded, user, navigate, API_URL]);
  
  const selectRole = async (role) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Selecting role:', role, 'for user:', user.id);
      const payload = {
        userId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        role
      };
      console.log('Request payload:', payload);

      const response = await axios.post(`${API_URL}/users/set-role`, payload);
      console.log('Role selection response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('userRole', role);
        navigate(role === 'admin' ? '/admin' : '/guest');
      }
    } catch (error) {
      console.error('Role selection error:', error);
      console.log('Error details:', error.response || 'No response data');
      
      if (error.response && error.response.status === 409) {
        // User already exists with a role
        setUserExists(true);
        setExistingRole(error.response.data.currentRole);
        localStorage.setItem('userRole', error.response.data.currentRole);
        setTimeout(() => {
          navigate(error.response.data.currentRole === 'admin' ? '/admin' : '/guest');
        }, 3000);
      } else {
        setError('Failed to set user role. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-t-lg p-6">
        <h2 className="text-2xl font-bold text-center">Welcome to BookKeep</h2>
        <p className="text-center mt-2 opacity-90">Please select your role to continue</p>
      </div>
      
      <div className="bg-white rounded-b-lg shadow-md p-8">
        {userExists && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 flex items-start">
            <FiAlertCircle className="text-yellow-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-yellow-800">Already Registered</h3>
              <p className="text-yellow-700">
                You already have a role assigned ({existingRole}). Redirecting to your dashboard...
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-start">
            <FiAlertCircle className="text-red-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div 
            className={`border rounded-lg p-6 ${
              loading || userExists 
                ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                : 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all'
            }`}
            onClick={() => !loading && !userExists && selectRole('admin')}
          >
            <div className="flex items-center justify-center bg-blue-100 text-blue-600 w-16 h-16 rounded-full mx-auto mb-4">
              <FiSettings size={28} />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Administrator</h3>
            <p className="text-gray-600 text-center mb-4">
              Manage book inventory, track borrowing, and maintain the library system.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li className="flex items-center">
                <FiCheck className="text-blue-500 mr-2" /> Full inventory management
              </li>
              <li className="flex items-center">
                <FiCheck className="text-blue-500 mr-2" /> Add and remove books
              </li>
              <li className="flex items-center">
                <FiCheck className="text-blue-500 mr-2" /> View borrower history
              </li>
              <li className="flex items-center">
                <FiCheck className="text-blue-500 mr-2" /> Generate reports
              </li>
            </ul>
            <button
              disabled={loading || userExists}
              className={`w-full py-3 rounded-lg ${
                loading || userExists 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white transition-colors'
              }`}
            >
              {loading ? 'Processing...' : 'Select Administrator Role'}
            </button>
          </div>
          
          <div 
            className={`border rounded-lg p-6 ${
              loading || userExists 
                ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                : 'border-green-200 bg-green-50 hover:border-green-300 hover:shadow-md cursor-pointer transition-all'
            }`}
            onClick={() => !loading && !userExists && selectRole('guest')}
          >
            <div className="flex items-center justify-center bg-green-100 text-green-600 w-16 h-16 rounded-full mx-auto mb-4">
              <FiBookOpen size={28} />
            </div>
            <h3 className="text-xl font-bold text-center mb-3">Guest</h3>
            <p className="text-gray-600 text-center mb-4">
              Browse the book collection, check availability, and find your next great read.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li className="flex items-center">
                <FiCheck className="text-green-500 mr-2" /> Browse full catalog
              </li>
              <li className="flex items-center">
                <FiCheck className="text-green-500 mr-2" /> Search for books
              </li>
              <li className="flex items-center">
                <FiCheck className="text-green-500 mr-2" /> Check availability
              </li>
              <li className="flex items-center">
                <FiCheck className="text-green-500 mr-2" /> View recommendations
              </li>
            </ul>
            <button
              disabled={loading || userExists}
              className={`w-full py-3 rounded-lg ${
                loading || userExists 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white transition-colors'
              }`}
            >
              {loading ? 'Processing...' : 'Select Guest Role'}
            </button>
          </div>
        </div>
        
        {userExists && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-gray-600">Redirecting to dashboard...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;
