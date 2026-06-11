import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Userdata from './pages/Userdata';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Restore session from localStorage on load
  useEffect(() => {
    const storedUser = localStorage.getItem('crm_user');
    const storedToken = localStorage.getItem('crm_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent"></div>
        <p className="text-slate-500 text-sm font-medium">Initializing workspace...</p>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user} setUser={setUser}>
        <Routes>
          {/* Public Authentication Routes */}
          <Route
            path="/login"
            element={
              user ? <Navigate to="/customers" replace /> : <Login setUser={setUser} />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/customers" replace /> : <Register setUser={setUser} />
            }
          />

          {/* Protected CRM Dashboard Route */}
          <Route
            path="/customers"
            element={
              user ? (
                <Userdata />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch-all Redirect */}
          <Route
            path="*"
            element={<Navigate to={user ? "/customers" : "/login"} replace />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
