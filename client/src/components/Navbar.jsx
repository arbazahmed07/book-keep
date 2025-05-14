import React, { useEffect } from 'react';
import { useUser, useClerk, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  
  useEffect(() => {
    // If user is signed in but on root path and has a role, redirect to their dashboard
    if (userLoaded && user && location.pathname === '/' && userRole) {
      navigate(userRole === 'admin' ? '/admin' : '/guest');
    }
    // If signed in but no role yet, and not on role selection
    else if (userLoaded && user && !userRole && location.pathname !== '/role-selection') {
      navigate('/role-selection');
    }
  }, [userLoaded, user, location.pathname, userRole, navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('userRole');
    signOut(() => navigate('/'));
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">BookKeep</Link>
        
        <SignedIn>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm hidden md:inline-block">
                Hello, {user.firstName || user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
                {userRole && <span className="ml-1">({userRole})</span>}
              </span>
            )}
            {userRole && (
              <Link 
                to={userRole === 'admin' ? '/admin' : '/guest'} 
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm"
              >
                Dashboard
              </Link>
            )}
            <button 
              onClick={handleSignOut} 
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Sign Out
            </button>
          </div>
        </SignedIn>
        
        <SignedOut>
          <div className="flex items-center gap-2">
            <Link to="/" className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm">
              Sign In
            </Link>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
