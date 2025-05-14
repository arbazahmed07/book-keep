import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Configure axios base URL if needed (uncomment if your proxy isn't working)
// axios.defaults.baseURL = 'http://localhost:5000';


const RoleSelection = () => {
  const API_URL = import.meta.env.VITE_API_URL ;
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
        const response = await axios.get(`${API_URL }/users/get-role/${user.id}`);
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
    return <div className="text-center py-10">Loading...</div>;
  }
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Select Your Role</h2>
      
      {userExists && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          You already have a role assigned ({existingRole}). Redirecting to your dashboard...
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <button
          onClick={() => selectRole('admin')}
          disabled={loading || userExists}
          className={`w-full py-3 rounded-lg ${
            loading || userExists ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          I am an Admin
        </button>
        
        <button
          onClick={() => selectRole('guest')}
          disabled={loading || userExists}
          className={`w-full py-3 rounded-lg ${
            loading || userExists ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          I am a Guest
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
