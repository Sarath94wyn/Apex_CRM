const express = require('express');
const router = express.Router();
const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/CustomerController');
const { validateCustomer } = require('../middleware/Validation');
const { protect } = require('../middleware/Auth');

// All customer routes are protected
router.use(protect);

router
  .route('/')
  .get(getCustomers)
  .post(validateCustomer, createCustomer);

router
  .route('/:id')
  .put(validateCustomer, updateCustomer)
  .delete(deleteCustomer);

module.exports = router;
