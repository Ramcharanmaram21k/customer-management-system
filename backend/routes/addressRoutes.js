const express = require('express')
const {
  createAddress,
  getAddressesByCustomerId,
  getCustomersWithMultipleAddresses,
  updateAddress,
  deleteAddress
} = require('../controllers/addressController')

const router = express.Router()

// Address CRUD routes
router.post('/', createAddress)
router.get('/customer/:customerId', getAddressesByCustomerId)
router.get('/multiple', getCustomersWithMultipleAddresses)
router.put('/:id', updateAddress)
router.delete('/:id', deleteAddress)

module.exports = router
