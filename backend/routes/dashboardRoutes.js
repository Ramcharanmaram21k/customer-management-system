const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Address = require('../models/Address');

// Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // Get total customers count
    const totalCustomers = await Customer.getCount();
    
    // Get customers added this month
    const thisMonthCustomers = await Customer.getThisMonth();
    
    // Get customers by location
    const locationStats = await Customer.getLocationStats();
    
    // Get customers with multiple addresses
    const multipleAddresses = await Address.getMultipleAddressCustomers();
    
    // Get recent customers (last 5)
    const recentCustomers = await Customer.getRecent(5);

    res.json({
      success: true,
      data: { // Corrected syntax here
        totalCustomers,
        thisMonthCustomers,
        locationStats,
        multipleAddresses,
        recentCustomers,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
});

module.exports = router;