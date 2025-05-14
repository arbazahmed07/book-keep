import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GuestDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${API_URL}/forms`);
        setForms(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const filteredForms = forms.filter(form => 
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.pin.includes(searchTerm) ||
    form.phone.includes(searchTerm)
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Guest Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, address, PIN or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : !forms.length ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No form data available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredForms.map((form) => (
                  <tr key={form._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{form.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{form.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{form.pin}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{form.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredForms.length === 0 && (
              <p className="text-center py-4 text-gray-500">No matching records found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestDashboard;
