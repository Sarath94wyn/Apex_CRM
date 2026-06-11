import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user types
    if (errors.length > 0) setErrors([]);
  };

  const validateForm = () => {
    const tempErrors = [];
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!formData.name.trim()) {
      tempErrors.push('Name is required');
    }
    if (!formData.email.trim()) {
      tempErrors.push('Email is required');
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.push('Invalid email format');
    }
    if (!formData.password) {
      tempErrors.push('Password is required');
    } else if (formData.password.length < 6) {
      tempErrors.push('Password must be at least 6 characters');
    }
    if (formData.password !== formData.confirmPassword) {
      tempErrors.push('Passwords do not match');
    }

    setErrors(tempErrors);
    return tempErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiBaseUrl}/api/users/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

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
          setErrors(['Registration failed. Please try again.']);
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
            Create Account
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Get started with your CRM customer database dashboard
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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
            {loading ? 'Registering Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
