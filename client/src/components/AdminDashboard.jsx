import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiUsers, FiBook, FiBarChart2, FiTrendingUp, FiEdit2, FiTrash2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [forms, setForms] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pin: '',
    phone: '',
    status: 'Available'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('books');

  // Sample dashboard stats
  const dashboardStats = {
    totalBooks: 152,
    booksAdded: 12,
    totalBorrowed: 23,
    activeUsers: 48,
    growthRate: 8.2
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/forms`);
      if (response.data.length === 0) {
        // If no data, use dummy data
        setForms(generateDummyBookData());
      } else {
        setForms(response.data);
      }
      setError('');
    } catch (err) {
      setForms(generateDummyBookData());
      setError('Using demo data - API connection failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateDummyBookData = () => {
    return [
      { _id: '1', name: 'The Great Gatsby', address: 'Fiction Section A-12', pin: 'A123', phone: '9876543210', status: 'Available' },
      { _id: '2', name: 'To Kill a Mockingbird', address: 'Fiction Section B-05', pin: 'B234', phone: '8765432109', status: 'Borrowed' },
      { _id: '3', name: 'The Catcher in the Rye', address: 'Fiction Section C-08', pin: 'C345', phone: '7654321098', status: 'Available' },
      { _id: '4', name: 'Pride and Prejudice', address: 'Classics Section A-03', pin: 'D456', phone: '6543210987', status: 'Reserved' },
      { _id: '5', name: 'The Hobbit', address: 'Fantasy Section F-01', pin: 'E567', phone: '5432109876', status: 'Available' },
    ];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', pin: '', phone: '', status: 'Available' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    
    try {
      if (editingId) {
        await axios.put(`${API_URL}/forms/${editingId}`, formData);
        setSuccess('Book updated successfully!');
      } else {
        await axios.post(`${API_URL}/forms`, formData);
        setSuccess('New book added successfully!');
      }
      resetForm();
      fetchForms();
      setError('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(editingId ? 'Failed to update book' : 'Failed to add new book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (form) => {
    setFormData({
      name: form.name,
      address: form.address,
      pin: form.pin,
      phone: form.phone,
      status: form.status || 'Available'
    });
    setEditingId(form._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/forms/${id}`);
      fetchForms();
      setSuccess('Book deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setError('');
    } catch (err) {
      setError('Failed to delete book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-lg p-6 shadow-lg mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 opacity-90">Manage your book inventory and track activity</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => {
                resetForm();
                setActiveTab('addBook');
              }}
              className="bg-white text-blue-700 flex items-center px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              <FiPlus className="mr-2" /> Add New Book
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FiBook className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Books</p>
            <p className="text-2xl font-bold">{dashboardStats.totalBooks}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FiPlus className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Recently Added</p>
            <p className="text-2xl font-bold">{dashboardStats.booksAdded}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
          <div className="bg-amber-100 p-3 rounded-full mr-4">
            <FiBarChart2 className="text-amber-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Borrowed</p>
            <p className="text-2xl font-bold">{dashboardStats.totalBorrowed}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FiUsers className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Users</p>
            <p className="text-2xl font-bold">{dashboardStats.activeUsers}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <FiTrendingUp className="text-indigo-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Growth</p>
            <p className="text-2xl font-bold">{dashboardStats.growthRate}%</p>
          </div>
        </div>
      </div>
      
      {/* Notifications */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 mb-6 flex items-center">
          <FiAlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-600 text-green-700 p-4 mb-6 flex items-center">
          <FiCheckCircle className="mr-2" size={20} />
          {success}
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('books')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'books'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Book Inventory
            </button>
            <button
              onClick={() => setActiveTab('addBook')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'addBook'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {editingId ? 'Edit Book' : 'Add Book'}
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'books' ? (
            <>
              {loading && !forms.length ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading books...</p>
                </div>
              ) : !forms.length ? (
                <div className="text-center py-12">
                  <FiBook className="text-gray-400 text-6xl mx-auto" />
                  <p className="text-gray-500 mt-4">No books available yet.</p>
                  <button
                    onClick={() => setActiveTab('addBook')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <FiPlus className="mr-2" /> Add Your First Book
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIN</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {forms.map((form) => (
                        <tr key={form._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{form.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{form.address}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{form.pin}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{form.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              form.status === 'Available' ? 'bg-green-100 text-green-800' :
                              form.status === 'Borrowed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {form.status || 'Available'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => {
                                handleEdit(form);
                                setActiveTab('addBook');
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(form._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">
                {editingId ? 'Update Book Information' : 'Add New Book to Inventory'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Book Title</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter book title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Location</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Section and shelf number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">PIN</label>
                    <input
                      type="text"
                      name="pin"
                      value={formData.pin}
                      onChange={handleInputChange}
                      required
                      placeholder="Book PIN"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Book ID</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Unique book ID"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="Available">Available</option>
                    <option value="Borrowed">Borrowed</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                        {editingId ? <FiEdit2 className="mr-2" /> : <FiPlus className="mr-2" />}
                        {editingId ? 'Update Book' : 'Add Book'}
                      </>
                    )}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                  </form>
                </div>
              )}
            </div>
          </div>
      
      {/* Quick Stats Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Popular Books</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>The Great Gatsby</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">12 borrows</span>
              </li>
              <li className="flex items-center justify-between">
                <span>To Kill a Mockingbird</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">9 borrows</span>
              </li>
              <li className="flex items-center justify-between">
                <span>The Hobbit</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">7 borrows</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Recent Returns</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>Jane Eyre</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Today</span>
              </li>
              <li className="flex items-center justify-between">
                <span>1984</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Yesterday</span>
              </li>
              <li className="flex items-center justify-between">
                <span>War and Peace</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">3 days ago</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium text-purple-800 mb-2">Active Borrowers</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>John Smith</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">4 books</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Maria Garcia</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">3 books</span>
              </li>
              <li className="flex items-center justify-between">
                <span>David Lee</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">2 books</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
