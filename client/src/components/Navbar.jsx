import React, { useEffect, useState } from 'react';
import { useUser, useClerk, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUser, FiLogOut, FiBook, FiBarChart2 } from 'react-icons/fi';

const Navbar = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Menu */}
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <FiBook className="text-2xl" />
            <span className="text-xl font-bold">BookKeep</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <SignedIn>
              <div className="flex items-center space-x-6">
                {userRole && (
                  <>
                    <Link 
                      to={userRole === 'admin' ? '/admin' : '/guest'} 
                      className="flex items-center hover:text-blue-200 transition-colors"
                    >
                      <FiHome className="mr-2" />
                      Dashboard
                    </Link>
                    
                    {userRole === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="flex items-center hover:text-blue-200 transition-colors"
                      >
                        <FiBarChart2 className="mr-2" />
                        Reports
                      </Link>
                    )}
                  </>
                )}
                
                {user && (
                  <div className="flex items-center border-l border-blue-400 pl-6">
                    <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center mr-2">
                      {user.firstName?.charAt(0) || user.username?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {user.firstName || user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
                      </p>
                      {userRole && (
                        <p className="text-xs text-blue-200">{userRole === 'admin' ? 'Administrator' : 'Guest User'}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
                >
                  <FiLogOut className="mr-1" />
                  Sign Out
                </button>
              </div>
            </SignedIn>
            
            <SignedOut>
              <Link to="/" className="flex items-center bg-white text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors">
                <FiUser className="mr-2" />
                Sign In
              </Link>
            </SignedOut>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="p-2">
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 shadow-inner">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <SignedIn>
              {user && (
                <div className="flex items-center p-3 bg-blue-900 rounded">
                  <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center mr-3">
                    {user.firstName?.charAt(0) || user.username?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.firstName || user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
                    </p>
                    {userRole && (
                      <p className="text-xs text-blue-200">{userRole === 'admin' ? 'Administrator' : 'Guest User'}</p>
                    )}
                  </div>
                </div>
              )}
              
              {userRole && (
                <>
                  <Link 
                    to={userRole === 'admin' ? '/admin' : '/guest'} 
                    className="flex items-center p-3 hover:bg-blue-700 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiHome className="mr-3" />
                    Dashboard
                  </Link>
                  
                  {userRole === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center p-3 hover:bg-blue-700 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiBarChart2 className="mr-3" />
                      Reports
                    </Link>
                  )}
                </>
              )}
              
              <button 
                onClick={handleSignOut} 
                className="flex items-center w-full p-3 bg-red-600 hover:bg-red-700 rounded"
              >
                <FiLogOut className="mr-3" />
                Sign Out
              </button>
            </SignedIn>
            
            <SignedOut>
              <Link 
                to="/" 
                className="flex items-center p-3 bg-white text-blue-700 hover:bg-blue-100 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUser className="mr-3" />
                Sign In
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
