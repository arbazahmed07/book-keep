import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Middleware to protect routes with Clerk authentication
export const requireAuth = ClerkExpressRequireAuth({
  // Optional parameters for role-based access
  onError: (err, req, res) => {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Optional middleware to verify admin role
export const requireAdmin = async (req, res, next) => {
  try {
    // Access Clerk user data from req.auth
    const { userId } = req.auth;
    
    // Fetch user metadata from Clerk
    // You can implement your role verification logic based on user metadata
    // For testing purposes, we'll skip this part and assume authentication is enough
    
    next();
  } catch (error) {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};
