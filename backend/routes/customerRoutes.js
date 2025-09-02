const express = require('express')
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomersByLocation
} = require('../controllers/customerController')

const router = express.Router()

// Customer CRUD routes
router.post('/', createCustomer)
router.get('/', getAllCustomers)
router.get('/search', searchCustomersByLocation)
router.get('/:id', getCustomerById)
router.put('/:id', updateCustomer)
router.delete('/:id', deleteCustomer)

module.exports = router
