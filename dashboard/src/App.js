import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotFound from './components/NotFound';
import CrisisPage from './pages/CrisisPage';
import Layout from './pages/Layout';

import 'leaflet/dist/leaflet.css';

// Mock Admin component (another protected route)
const Admin = () => {
  return (
    <div>
      <h1>Admin Area</h1>
      <p>Only authorized users can see this.</p>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(localStorage.getItem('userObj')||null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userObj');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (loggedInUser) => {
    console.log("Logged in user:", loggedInUser);
    setUser(loggedInUser);
    localStorage.setItem('userObj', JSON.stringify(loggedInUser));
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userObj');
  }
useEffect(() => {
  console.log("User state updated:", user);
},[user]  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
                <Layout user={user} handleLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<p>Public Home Page</p>} />
          <Route path="/login" element={<LoginPage handleLogin={handleLogin} user={user} />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path='/dashboard/*' element={<Dashboard user={user}/>} />
          <Route path='/crisis-report' element={<CrisisPage user={user}/>} />

          {/* Fallback route */}
          <Route path="*" element={<NotFound/>} />
        </Routes>
    </Router>
  );
}

export default App;