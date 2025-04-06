import React from 'react';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
    const navigate = useNavigate(); // Use the navigate hook for routing
  const handleLogout = () => {
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/path/to/logo.png" alt="Logo" className="w-12 h-12" />
          <h1 className="text-xl font-semibold">Climatic Crisis Admin</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>

      {/* Sidebar / Content Area */}
      <div className="flex">
        <div className="w-64 bg-blue-200 p-6">
          <h2 className="text-2xl font-bold text-blue-800">Crisis Management</h2>
          <div className="mt-6 space-y-4">
            <button
              onClick={() => navigate('/create-crisis')}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Create Crisis
            </button>
            <button
              onClick={() => navigate('/pre-crisis-analysis')}
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Pre-Crisis Analysis
            </button>
            <button
              onClick={() => navigate('/post-crisis-analysis')}
              className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              Post-Crisis Analysis
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <h2 className="text-3xl font-bold text-blue-900">Welcome to the Admin Dashboard</h2>
          <p className="mt-4 text-lg text-gray-700">
            Use the sidebar to create new crises or view pre- and post-crisis analysis.
          </p>

          {/* Example content, could be dynamic */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-blue-800">Recent Updates</h3>
            <p className="mt-2 text-gray-600">No recent updates yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
