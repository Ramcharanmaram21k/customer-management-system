const Address = require('../models/Address')
const Customer = require('../models/Customer')

// Validation helper
const validateAddressData = (data) => {
  const errors = []
  
  if (!data.address_line || data.address_line.trim().length < 5) {
    errors.push('Address line must be at least 5 characters long')
  }
  
  if (!data.city || data.city.trim().length < 2) {
    errors.push('City must be at least 2 characters long')
  }
  
  if (!data.state || data.state.trim().length < 2) {
    errors.push('State must be at least 2 characters long')
  }
  
  if (!data.pin_code || !/^\d{6}$/.test(data.pin_code)) {
    errors.push('Pin code must be a valid 6-digit number')
  }
  
  return errors
}

// Create new address
const createAddress = async (req, res) => {
  try {
    const { customer_id, address_line, city, state, pin_code, is_primary } = req.body
    
    // Check if customer exists
    const customer = await Customer.getById(customer_id)
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      })
    }
    
    // Validate address data
    const addressData = { address_line, city, state, pin_code }
    const errors = validateAddressData(addressData)
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      })
    }
    
    const address = await Address.create({
      customer_id,
      address_line,
      city,
      state,
      pin_code,
      is_primary: is_primary || 0
    })
    
    res.status(201).json({
      success: true,
      message: 'Address created successfully',
       address  // Fixed: Added ""
    })
    
  } catch (error) {
    console.error('Create address error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get addresses by customer ID
const getAddressesByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params
    
    const addresses = await Address.getByCustomerId(customerId)
    
    res.json({
      success: true,
      message: 'Addresses fetched successfully',
       addresses  // Fixed: Added ""
    })
    
  } catch (error) {
    console.error('Get addresses error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get customers with multiple addresses
const getCustomersWithMultipleAddresses = async (req, res) => {
  try {
    const customers = await Address.getCustomersWithMultipleAddresses()
    
    res.json({
      success: true,
      message: 'Customers with multiple addresses fetched successfully',
       customers  // Fixed: Added ""
    })
    
  } catch (error) {
    console.error('Get customers with multiple addresses error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Update address
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params
    const { address_line, city, state, pin_code, is_primary } = req.body
    
    // Check if address exists
    const existingAddress = await Address.getById(id)
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      })
    }
    
    // Validate address data
    const addressData = { address_line, city, state, pin_code }
    const errors = validateAddressData(addressData)
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      })
    }
    
    const updatedAddress = await Address.update(id, {
      address_line,
      city,
      state,
      pin_code,
      is_primary: is_primary || 0
    })
    
    res.json({
      success: true,
      message: 'Address updated successfully',
       updatedAddress  // Fixed: Added ""
    })
    
  } catch (error) {
    console.error('Update address error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if address exists
    const existingAddress = await Address.getById(id)
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      })
    }
    
    const result = await Address.delete(id)
    
    if (result.deleted) {
      res.json({
        success: true,
        message: 'Address deleted successfully'
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Address not found'
      })
    }
    
  } catch (error) {
    console.error('Delete address error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

module.exports = {
  createAddress,
  getAddressesByCustomerId,
  getCustomersWithMultipleAddresses,
  updateAddress,
  deleteAddress
}
