import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotFound from './components/NotFound';


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
  const [user, setUser] = useState(null);
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
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<p>Public Home Page</p>} />
          <Route path="/login" element={<LoginPage handleLogin={handleLogin} user={user} />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path='/dashboard/*' element={<Dashboard/>} />

          {/* Fallback route */}
          <Route path="*" element={<NotFound/>} />
        </Routes>
    </Router>
  );
}

export default App;