import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors.length > 0) setErrors([]);
  };

  const validateForm = () => {
    const tempErrors = [];
    if (!formData.email.trim()) {
      tempErrors.push('Email is required');
    }
    if (!formData.password) {
      tempErrors.push('Password is required');
    }
    setErrors(tempErrors);
    return tempErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);

      if (res.data.success) {
        localStorage.setItem('crm_token', res.data.data.token);
        localStorage.setItem('crm_user', JSON.stringify({
          _id: res.data.data._id,
          name: res.data.data.name,
          email: res.data.data.email,
        }));
        setUser(res.data.data);
        navigate('/customers');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else if (errorData.message) {
          setErrors([errorData.message]);
        } else {
          setErrors(['Login failed. Please verify credentials.']);
        }
      } else {
        setErrors(['Could not connect to the authentication server.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80svh] px-4">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 rounded-2xl shadow-xl shadow-slate-950/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold font-display bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Sign in to access your customer relations database
          </p>
        </div>

        {errors.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm space-y-1">
            {errors.map((err, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 font-semibold text-sm rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
