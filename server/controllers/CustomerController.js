const Customer = require('../models/CustomerModel');

// @desc    Get all customers for the logged-in user
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error('Fetch customers error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving customers' });
  }
};

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    const customer = await Customer.create({
      name,
      email,
      phone,
      company: company || '',
      status: status || 'Lead',
      notes: notes || '',
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ success: false, message: 'Server error creating customer' });
  }
};

// @desc    Update customer details
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    // Find the customer
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Check ownership
    if (customer.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this customer' });
    }

    // Update details
    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        company: company !== undefined ? company : customer.company,
        status: status !== undefined ? status : customer.status,
        notes: notes !== undefined ? notes : customer.notes,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ success: false, message: 'Server error updating customer' });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Check ownership
    if (customer.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this customer' });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting customer' });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
