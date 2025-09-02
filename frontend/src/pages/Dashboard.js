import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { customerAPI } from '../services/api'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5001/api/dashboard')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError('Failed to load dashboard data')
      }
    } catch (err) {
      console.error('Dashboard error:', err)
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading Dashboard...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Dashboard</h2>
        <div style={{ color: 'red', marginBottom: '20px' }}>
          Error: {error}
        </div>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Customer CRM Dashboard</h1>
      
      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#3498db', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Customers</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{data.totalCustomers}</div>
        </div>
        
        <div style={{ backgroundColor: '#27ae60', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>New This Month</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{data.thisMonthCustomers}</div>
        </div>
        
        <div style={{ backgroundColor: '#e67e22', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Multiple Addresses</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{data.multipleAddresses || 0}</div>
        </div>
      </div>

      {/* Top Locations */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Top Customer Locations</h2>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {data.locationStats?.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '10px' }}>City</th>
                  <th style={{ textAlign: 'right', padding: '10px' }}>Customers</th>
                </tr>
              </thead>
              <tbody>
                {data.locationStats.map((location, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{location.city}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                      {location.customer_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No location data available</p>
          )}
        </div>
      </div>

      {/* Recent Customers */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Recent Customers</h2>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {data.recentCustomers?.length > 0 ? (
            <div>
              {data.recentCustomers.map(customer => (
                <div key={customer.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{customer.first_name} {customer.last_name}</strong>
                    <br />
                    <small>{customer.phone_number}</small>
                  </div>
                  <Link 
                    to={`/customers/${customer.id}`}
                    style={{ padding: '5px 10px', backgroundColor: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '12px' }}
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent customers</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link 
            to="/customers/create"
            style={{ padding: '12px 24px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: '600' }}
          >
            ➕ Add New Customer
          </Link>
          
          <Link 
            to="/customers"
            style={{ padding: '12px 24px', backgroundColor: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: '600' }}
          >
            📋 View All Customers
          </Link>
          
          <Link 
            to="/search"
            style={{ padding: '12px 24px', backgroundColor: '#9b59b6', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: '600' }}
          >
            🔍 Search by Location
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
