import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEye, FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa'
import { customerAPI } from '../services/api'

const CustomerList = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null) // Track which customer is being deleted

  useEffect(() => {
    fetchCustomers()
  }, [search, location.state?.refresh])

  const fetchCustomers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await customerAPI.getAll({ search })
      console.log('API Response:', response)
      
      // Handle different response formats
      let customerData = []
      if (response?.data?.customers) {
        customerData = response.data.customers
      } else if (response?.customers) {
        customerData = response.customers
      } else if (Array.isArray(response)) {
        customerData = response
      }
      
      setCustomers(customerData)
    } catch (e) {
      console.error('Error fetching customers:', e)
      setError('Failed to load customers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(e.target.search.value.trim())
  }

  const handleDelete = async (customerId, customerName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${customerName}"?\n\nThis action cannot be undone and will remove all customer data including addresses.`
    )
    
    if (!confirmed) return

    setDeleting(customerId)
    try {
      await customerAPI.delete(customerId)
      alert('Customer deleted successfully!')
      // Refresh the list
      fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
      if (error.response?.data?.message) {
        alert(`Failed to delete customer: ${error.response.data.message}`)
      } else {
        alert('Failed to delete customer. Please try again.')
      }
    } finally {
      setDeleting(null)
    }
  }

  const handleView = (customerId) => {
    navigate(`/customers/${customerId}`)
  }

  const handleEdit = (customerId) => {
    navigate(`/customers/${customerId}/edit`)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Customers</h1>
        <Link 
          to="/customers/create" 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            padding: '10px 20px', 
            backgroundColor: '#27ae60', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontWeight: '600'
          }}
        >
          <FaPlus style={{ marginRight: '8px' }} />
          Add Customer
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            name="search"
            type="text" 
            placeholder="Search customers by name or phone..." 
            style={{ 
              padding: '10px', 
              width: '300px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button 
            type="submit"
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? <FaSpinner className="spin" /> : 'Search'}
          </button>
          <button
            type="button"
            onClick={() => {
              document.querySelector('input[name="search"]').value = ''
              setSearch('')
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fadbd8', 
          color: '#e74c3c', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #e74c3c'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '40px',
          color: '#7f8c8d'
        }}>
          <FaSpinner className="spin" style={{ marginRight: '10px' }} />
          Loading customers...
        </div>
      )}

      {/* Customer Table */}
      {!loading && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>ID</th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>Name</th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>Phone</th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'left', 
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>Email</th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    color: '#7f8c8d',
                    fontSize: '16px'
                  }}>
                    {search ? 'No customers found matching your search.' : 'No customers found.'}
                    <br />
                    <Link to="/customers/create" style={{ color: '#27ae60', marginTop: '10px', display: 'inline-block' }}>
                      Add your first customer
                    </Link>
                  </td>
                </tr>
              ) : (
                customers.map(customer => (
                  <tr key={customer.id} style={{ 
                    borderBottom: '1px solid #e9ecef',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '15px' }}>{customer.id}</td>
                    <td style={{ padding: '15px', fontWeight: '500' }}>
                      {customer.first_name} {customer.last_name}
                    </td>
                    <td style={{ padding: '15px' }}>{customer.phone_number}</td>
                    <td style={{ padding: '15px' }}>{customer.email || 'N/A'}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {/* View Button */}
                        <button
                          onClick={() => handleView(customer.id)}
                          title="View Details"
                          style={{
                            padding: '6px 8px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <FaEye />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(customer.id)}
                          title="Edit Customer"
                          style={{
                            padding: '6px 8px',
                            backgroundColor: '#f39c12',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <FaEdit />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(customer.id, `${customer.first_name} ${customer.last_name}`)}
                          disabled={deleting === customer.id}
                          title="Delete Customer"
                          style={{
                            padding: '6px 8px',
                            backgroundColor: deleting === customer.id ? '#95a5a6' : '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: deleting === customer.id ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {deleting === customer.id ? <FaSpinner className="spin" /> : <FaTrash />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CSS for spinner animation */}
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default CustomerList
