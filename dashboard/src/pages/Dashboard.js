import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Dashboard = ({user}) => {

    const navigate = useNavigate(); // Use the navigate hook for routing
  const handleLogout = () => {
    navigate('/login'); // Redirect to login page after logout
  };
  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if user is not authenticated
    }
  }
  , [user, navigate]); // Dependency array to avoid infinite loop
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      

      {/* Sidebar / Content Area */}
      <div className="flex">


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
