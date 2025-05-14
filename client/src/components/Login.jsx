import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { FiBookOpen, FiUser, FiShield, FiBookmark } from 'react-icons/fi';

const Login = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen max-w-6xl mx-auto">
      {/* Left side - App information */}
      <div className="w-full md:w-1/2 bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 flex flex-col justify-center rounded-l-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <FiBookOpen size={40} className="mr-4" />
            <h1 className="text-3xl font-bold">BookKeep</h1>
          </div>
          
          <p className="text-xl mb-8">Your complete digital library management system</p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-600 p-2 rounded-full mr-4">
                <FiUser size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">User-friendly Interface</h3>
                <p className="text-blue-100">Intuitive design for easy navigation and management</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 p-2 rounded-full mr-4">
                <FiShield size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure Authentication</h3>
                <p className="text-blue-100">Role-based access control for administrators and guests</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 p-2 rounded-full mr-4">
                <FiBookmark size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Complete Book Management</h3>
                <p className="text-blue-100">Track inventory, borrowing status, and user activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Authentication */}
      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center rounded-r-lg">
        <div className="w-full max-w-md">
          {/* Custom header above Clerk component */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Sign in</h2>
            <p className="text-gray-600 mt-2">to continue to BookKeep</p>
          </div>
          
          {/* Clerk SignIn component with custom styling */}
          <div className="bg-white rounded-lg">
            <SignIn 
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full mx-auto",
                  card: "shadow-none p-0",
                  footer: "hidden",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: 
                    "border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all py-2",
                  formFieldInput: 
                    "border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500",
                  formButtonPrimary: 
                    "bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all",
                  dividerRow: "my-4",
                  dividerText: "bg-white text-gray-500 px-2",
                  footerAction: "mt-4 text-center",
                  footerActionLink: "text-blue-600 hover:text-blue-500",
                }
              }}
            />
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;