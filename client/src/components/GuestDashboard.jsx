import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiBook, FiUsers, FiBookmark, FiClock } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GuestDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy data for statistics
  const stats = [
    { label: 'Books Available', value: 152, icon: <FiBook className="text-blue-500" size={24} /> },
    { label: 'Active Readers', value: 48, icon: <FiUsers className="text-green-500" size={24} /> },
    { label: 'Borrowed', value: 23, icon: <FiBookmark className="text-amber-500" size={24} /> },
    { label: 'Reserved', value: 12, icon: <FiClock className="text-purple-500" size={24} /> }
  ];

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${API_URL}/forms`);
        // Add dummy book data if the API returns empty data
        if (response.data.length === 0) {
          const dummyData = generateDummyBookData();
          setForms(dummyData);
        } else {
          setForms(response.data);
        }
        setError('');
      } catch (err) {
        // Use dummy data if the API fails
        setForms(generateDummyBookData());
        setError('Using demo data - API connection failed');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const generateDummyBookData = () => {
    return [
      { _id: '1', name: 'The Great Gatsby', address: 'Fiction Section A-12', pin: 'A123', phone: '9876543210', status: 'Available', cover: 'https://source.unsplash.com/random/100x150?book=1' },
      { _id: '2', name: 'To Kill a Mockingbird', address: 'Fiction Section B-05', pin: 'B234', phone: '8765432109', status: 'Borrowed', cover: 'https://source.unsplash.com/random/100x150?book=2' },
      { _id: '3', name: 'The Catcher in the Rye', address: 'Fiction Section C-08', pin: 'C345', phone: '7654321098', status: 'Available', cover: 'https://source.unsplash.com/random/100x150?book=3' },
      { _id: '4', name: 'Pride and Prejudice', address: 'Classics Section A-03', pin: 'D456', phone: '6543210987', status: 'Reserved', cover: 'https://source.unsplash.com/random/100x150?book=4' },
      { _id: '5', name: 'The Hobbit', address: 'Fantasy Section F-01', pin: 'E567', phone: '5432109876', status: 'Available', cover: 'https://source.unsplash.com/random/100x150?book=5' },
      { _id: '6', name: 'Moby Dick', address: 'Classics Section B-09', pin: 'F678', phone: '4321098765', status: 'Available', cover: 'https://source.unsplash.com/random/100x150?book=6' },
    ];
  };

  const filteredForms = forms.filter(form => 
    form.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.pin?.includes(searchTerm) ||
    form.phone?.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-lg p-6 shadow-lg mb-8">
        <h1 className="text-3xl font-bold">Welcome to the Library Dashboard</h1>
        <p className="mt-2 opacity-90">Browse our collection and discover your next favorite book</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-5 transition-all hover:shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, location, PIN or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading collection...</p>
          </div>
        ) : !forms.length ? (
          <div className="text-center py-12">
            <FiBook className="text-gray-400 text-6xl mx-auto" />
            <p className="text-gray-500 mt-4">No books available in the collection.</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Book Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((book) => (
                <div key={book._id} className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <div className="flex">
                    <div className="w-1/3 flex-shrink-0">
                      <img src={book.cover || `https://source.unsplash.com/random/100x150?book=${book._id}`} alt={book.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-semibold text-lg mb-1 truncate">{book.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">Location: {book.address}</p>
                      <p className="text-sm text-gray-600 mb-1">PIN: {book.pin}</p>
                      <p className="text-sm text-gray-600 mb-3">ID: {book.phone}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        book.status === 'Available' ? 'bg-green-100 text-green-800' :
                        book.status === 'Borrowed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {book.status || 'Available'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredForms.length === 0 && (
              <div className="text-center py-8">
                <FiSearch className="text-gray-400 text-5xl mx-auto" />
                <p className="text-gray-500 mt-4">No matching books found.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Featured Section */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6 shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Featured Recommendation</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img 
            src="https://source.unsplash.com/random/200x300?book" 
            alt="Featured Book" 
            className="w-40 rounded-md shadow-md"
          />
          <div>
            <h3 className="text-xl font-bold mb-2">Atomic Habits</h3>
            <p className="text-gray-700 mb-4">
              An easy and proven way to build good habits and break bad ones. 
              This breakthrough book from James Clear is the most comprehensive guide 
              on how to change your habits and get 1% better every day.
            </p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Reserve Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
