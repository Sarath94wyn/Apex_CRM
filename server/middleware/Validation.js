const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

const validateCustomer = (req, res, next) => {
  const { name, email, phone, status } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Customer name is required');
  }

  if (!email || email.trim() === '') {
    errors.push('Customer email is required');
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }

  if (!phone || phone.trim() === '') {
    errors.push('Customer phone number is required');
  }

  if (status) {
    const allowedStatuses = ['Lead', 'Contact', 'Prospect', 'Customer'];
    if (!allowedStatuses.includes(status)) {
      errors.push(`Status must be one of: ${allowedStatuses.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateCustomer,
};
