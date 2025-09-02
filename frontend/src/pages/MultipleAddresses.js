import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { addressAPI } from '../services/api'

function MultipleAddresses() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCustomersWithMultipleAddresses()
  }, [])

  const fetchCustomersWithMultipleAddresses = async () => {
    try {
      const response = await addressAPI.getMultipleAddresses()
      setCustomers(response.data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
      setError('Failed to load customers with multiple addresses')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Customers with Multiple Addresses</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Customers who have more than one registered address
      </p>

      {customers.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {customers.map(customer => (
            <div
              key={customer.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <h3>{customer.first_name} {customer.last_name}</h3>
              <p>Phone: {customer.phone_number}</p>
              <p>Total Addresses: <strong>{customer.address_count}</strong></p>
              
              <Link
                to={`/customers/${customer.id}`}
                style={{
                  display: 'inline-block',
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <h3>No customers found</h3>
          <p>No customers have multiple addresses yet.</p>
        </div>
      )}
    </div>
  )
}

export default MultipleAddresses
