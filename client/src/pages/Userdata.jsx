import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Userdata = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  
  // Customer Form State
  const [formErrors, setFormErrors] = useState([]);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Lead',
    notes: '',
  });

  // Fetch all customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('crm_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/customers', getAuthHeader());
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setErrors(['Failed to retrieve customer data. Please try again later.']);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for Form Change
  const handleFormChange = (e) => {
    setCustomerForm({
      ...customerForm,
      [e.target.name]: e.target.value,
    });
    if (formErrors.length > 0) setFormErrors([]);
  };

  // Opening Modals
  const openAddModal = () => {
    setModalMode('add');
    setSelectedCustomerId(null);
    setCustomerForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'Lead',
      notes: '',
    });
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setModalMode('edit');
    setSelectedCustomerId(customer._id);
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company || '',
      status: customer.status || 'Lead',
      notes: customer.notes || '',
    });
    setFormErrors([]);
    setIsModalOpen(true);
  };

  const validateCustomerForm = () => {
    const tempErrors = [];
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!customerForm.name.trim()) {
      tempErrors.push('Name is required');
    }
    if (!customerForm.email.trim()) {
      tempErrors.push('Email is required');
    } else if (!emailRegex.test(customerForm.email)) {
      tempErrors.push('Please enter a valid email');
    }
    if (!customerForm.phone.trim()) {
      tempErrors.push('Phone number is required');
    }

    setFormErrors(tempErrors);
    return tempErrors.length === 0;
  };

  // Submit Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCustomerForm()) return;

    try {
      if (modalMode === 'add') {
        const res = await axios.post(
          'http://localhost:5000/api/customers',
          customerForm,
          getAuthHeader()
        );
        if (res.data.success) {
          setCustomers([res.data.data, ...customers]);
          setIsModalOpen(false);
        }
      } else {
        const res = await axios.put(
          `http://localhost:5000/api/customers/${selectedCustomerId}`,
          customerForm,
          getAuthHeader()
        );
        if (res.data.success) {
          setCustomers(
            customers.map((c) => (c._id === selectedCustomerId ? res.data.data : c))
          );
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setFormErrors(err.response.data.errors || [err.response.data.message]);
      } else {
        setFormErrors(['An unexpected error occurred.']);
      }
    }
  };

  // Delete Customer
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer record?')) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/customers/${id}`,
        getAuthHeader()
      );
      if (res.data.success) {
        setCustomers(customers.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete customer record.');
    }
  };

  // Filter customers by search term
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics calculation
  const totalCount = customers.length;
  const leadCount = customers.filter((c) => c.status === 'Lead').length;
  const contactCount = customers.filter((c) => c.status === 'Contact').length;
  const prospectCount = customers.filter((c) => c.status === 'Prospect').length;
  const customerCount = customers.filter((c) => c.status === 'Customer').length;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Lead':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Contact':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Prospect':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Customer':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Relationship Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Maintain your user network, track pipelines, and manage client relations.
          </p>
        </div>
        <div>
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add New Client
          </button>
        </div>
      </div>

      {/* CRM Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 shadow-md">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Clients</p>
          <p className="text-2xl font-bold font-display text-slate-100 mt-1">{totalCount}</p>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leads</p>
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
          </div>
          <p className="text-2xl font-bold font-display text-blue-400 mt-1">{leadCount}</p>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacts</p>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-2xl font-bold font-display text-emerald-400 mt-1">{contactCount}</p>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prospects</p>
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
          </div>
          <p className="text-2xl font-bold font-display text-amber-400 mt-1">{prospectCount}</p>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 shadow-md col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customers</p>
            <span className="h-2 w-2 rounded-full bg-purple-500"></span>
          </div>
          <p className="text-2xl font-bold font-display text-purple-400 mt-1">{customerCount}</p>
        </div>
      </div>

      {/* Main CRM Grid Actions */}
      <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden">
        {/* Search Header */}
        <div className="p-5 border-b border-slate-800/60 bg-slate-900/10 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4.5 w-4.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Global errors banner */}
        {errors.length > 0 && (
          <div className="p-4 mx-5 mt-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {errors.join(', ')}
          </div>
        )}

        {/* Table/Cards Body */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent"></div>
            <p className="text-slate-500 text-sm font-medium">Fetching client catalog...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-16 w-16 rounded-full bg-slate-900/80 border border-slate-800/60 flex items-center justify-center text-slate-600 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-300">No client records found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">
              {searchTerm ? "No results match your search parameters. Try adjusting your query." : "Build your connection catalog! Add your very first customer to get started."}
            </p>
            {!searchTerm && (
              <button
                onClick={openAddModal}
                className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Add Your First Client
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/20 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-800/50">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Company</th>
                    <th className="py-4 px-6">Contact Info</th>
                    <th className="py-4 px-6">Pipeline Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-slate-900/10 transition-colors group">
                      <td className="py-4 px-6 font-medium text-slate-200">
                        <div className="flex flex-col">
                          <span>{customer.name}</span>
                          {customer.notes && (
                            <span className="text-xs text-slate-500 font-normal line-clamp-1 mt-0.5">
                              {customer.notes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-sm">
                        {customer.company || '—'}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <div className="flex flex-col">
                          <span className="text-slate-300">{customer.email}</span>
                          <span className="text-slate-500 text-xs mt-0.5">{customer.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(customer)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                            title="Edit Client"
                          >
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                            title="Delete Client"
                          >
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-800/40">
              {filteredCustomers.map((customer) => (
                <div key={customer._id} className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-100 text-base">{customer.name}</h4>
                      <p className="text-slate-500 text-xs mt-0.5">{customer.company || 'No Company'}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(customer.status)}`}>
                      {customer.status}
                    </span>
                  </div>

                  <div className="text-sm space-y-1.5 text-slate-400">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{customer.phone}</span>
                    </div>
                  </div>

                  {customer.notes && (
                    <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-900/60 text-xs text-slate-500">
                      <strong>Notes:</strong> {customer.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-900/40">
                    <button
                      onClick={() => openEditModal(customer)}
                      className="px-3.5 py-1.5 border border-slate-800 hover:border-slate-700 text-xs font-semibold rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Edit details
                    </button>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="px-3.5 py-1.5 border border-red-500/10 text-red-500 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform scale-100 transition-transform">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-slate-100">
                {modalMode === 'add' ? 'Add Customer Record' : 'Edit Customer Record'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formErrors.length > 0 && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm space-y-1">
                  {formErrors.map((err, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={customerForm.name}
                    onChange={handleFormChange}
                    placeholder="Jane Smith"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={customerForm.company}
                    onChange={handleFormChange}
                    placeholder="Acme Corp"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={customerForm.email}
                    onChange={handleFormChange}
                    placeholder="jane@company.com"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={customerForm.phone}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Pipeline Status
                </label>
                <select
                  name="status"
                  value={customerForm.status}
                  onChange={handleFormChange}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Lead">Lead</option>
                  <option value="Contact">Contact</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Interaction Notes
                </label>
                <textarea
                  name="notes"
                  value={customerForm.notes}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Details from call or meeting minutes..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-800 text-sm font-semibold rounded-xl text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  {modalMode === 'add' ? 'Save Client' : 'Update Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userdata;
