const Customer = require('../models/Customer');
const Address = require('../models/Address');

const validateCustomerData = (data) => {
  const errors = [];

  if (!data.first_name || data.first_name.trim().length < 2) {
    errors.push('First name must be at least 2 characters long');
  }

  if (!data.last_name || data.last_name.trim().length < 2) {
    errors.push('Last name must be at least 2 characters long');
  }

  if (!data.phone_number || !/^[6-9]\d{9}$/.test(data.phone_number)) {
    errors.push('Phone number must be a valid 10-digit Indian mobile number');
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }

  return errors;
};

const createCustomer = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email, address } = req.body;

    const customerData = { first_name, last_name, phone_number, email };
    const errors = validateCustomerData(customerData);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const customer = await Customer.create(customerData);

    if (address) {
      const addressErrors = [];

      if (!address.address_line || address.address_line.trim().length < 5) {
        addressErrors.push('Address line must be at least 5 characters long');
      }

      if (!address.city || address.city.trim().length < 2) {
        addressErrors.push('City must be at least 2 characters long');
      }

      if (!address.state || address.state.trim().length < 2) {
        addressErrors.push('State must be at least 2 characters long');
      }

      if (!address.pin_code || !/^\d{6}$/.test(address.pin_code)) {
        addressErrors.push('Pin code must be a valid 6-digit number');
      }

      if (addressErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Address validation failed',
          errors: addressErrors
        });
      }

      await Address.create({
        customer_id: customer.id,
        ...address,
        is_primary: 1
      });
    }

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: { // Corrected syntax here
        customer
      }
    });

  } catch (error) {
    console.error('Create customer error:', error);

    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        success: false,
        message: 'Phone number or email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const result = await Customer.getAll(parseInt(page), parseInt(limit), search);
    
    console.log('Backend result:', result);

    res.json({
      success: true,
      message: 'Customers fetched successfully',
      data: { // Corrected syntax here
        customers: result.customers || result,
        total: result.total || (result.customers ? result.customers.length : result.length),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.getById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const addresses = await Address.getByCustomerId(id);

    res.json({
      success: true,
      message: 'Customer details fetched successfully',
      data: { // Corrected syntax here
        ...customer,
        addresses
      }
    });

  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone_number, email } = req.body;

    const existingCustomer = await Customer.getById(id);
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const customerData = { first_name, last_name, phone_number, email };
    const errors = validateCustomerData(customerData);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const updatedCustomer = await Customer.update(id, customerData);

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: { // Corrected syntax here
        customer: updatedCustomer
      }
    });

  } catch (error) {
    console.error('Update customer error:', error);

    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        success: false,
        message: 'Phone number or email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCustomer = await Customer.getById(id);
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const result = await Customer.delete(id);

    if (result.deleted) {
      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const searchCustomersByLocation = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    if (!search) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const customers = await Customer.searchByLocation(search, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      message: 'Search results fetched successfully',
      data: { // Corrected syntax here
        customers: customers.customers || customers,
        total: customers.total || customers.length
      }
    });

  } catch (error) {
    console.error('Search customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomersByLocation
};