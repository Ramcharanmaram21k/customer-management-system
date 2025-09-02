import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { customerAPI } from '../services/api'

function SearchResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentQuery, setCurrentQuery] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('q')
    
    if (query) {
      setSearchTerm(query)
      setCurrentQuery(query)
      performSearch(query)
    }
  }, [location.search])

  const performSearch = async (query) => {
    setLoading(true)
    setError('')
    
    console.log('🔍 Searching for:', query) // DEBUG
    
    try {
      const response = await customerAPI.searchByLocation({
        search: query,
        page: 1,
        limit: 50
      })
      
      console.log('📊 Full API Response:', response) // DEBUG
      
      // FIX: Handle the correct response structure
      let customers = []
      if (response.data && response.data.customers) {
        customers = response.data.customers
      } else if (response.customers) {
        customers = response.customers
      } else if (Array.isArray(response.data)) {
        customers = response.data
      } else if (Array.isArray(response)) {
        customers = response
      }
      
      console.log('👥 Final customers:', customers) // DEBUG
      setResults(customers)
      
    } catch (error) {
      console.error('❌ Search error:', error)
      setError('Failed to search customers. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const query = searchTerm.trim()
    if (query) {
      setCurrentQuery(query)
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>
      
      <h1>Search Results</h1>
      {currentQuery && <p style={{ color: '#666', marginBottom: '20px' }}>Results for: "{currentQuery}"</p>}

      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search by city, state, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1, 
              padding: '10px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Search
          </button>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#666'
        }}>
          🔍 Searching...
        </div>
      )}
      
      {/* Results */}
      {!loading && currentQuery && (
        <>
          <div style={{ 
            marginBottom: '20px', 
            padding: '10px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px'
          }}>
            <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} found
          </div>
          
          {results.length > 0 ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              {results.map(customer => (
                <div
                  key={customer.id}
                  style={{
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ marginBottom: '15px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
                      {customer.first_name} {customer.last_name}
                    </h3>
                    <p style={{ margin: '0', color: '#666' }}>
                      📞 {customer.phone_number}
                    </p>
                    {customer.email && (
                      <p style={{ margin: '0', color: '#666' }}>
                        ✉️ {customer.email}
                      </p>
                    )}
                    <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                      📍 {customer.address_count || 0} address{customer.address_count !== 1 ? 'es' : ''}
                    </p>
                  </div>
                  
                  <Link
                    to={`/customers/${customer.id}`}
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              color: '#666'
            }}>
              <h3 style={{ marginBottom: '10px' }}>No Results Found</h3>
              <p>No customers found matching "{currentQuery}".</p>
              <p style={{ fontSize: '14px', marginTop: '15px' }}>
                Try searching for:
                <br />
                • City names (e.g., "Mumbai", "Delhi")
                <br />
                • State names (e.g., "Maharashtra", "Karnataka")
                <br />
                • Area names (e.g., "Andheri", "Koramangala")
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SearchResults
