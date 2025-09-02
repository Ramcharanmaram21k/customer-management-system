import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addressAPI } from '../services/api'

function CreateAddress() {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    address_line: '',
    city: '',
    state: '',
    pin_code: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.address_line) newErrors.address_line = 'Address is required'
    if (!form.city) newErrors.city = 'City is required'
    if (!form.state) newErrors.state = 'State is required'
    if (!form.pin_code) newErrors.pin_code = 'Pin code is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await addressAPI.create({
        customer_id: parseInt(customerId),
        ...form
      })
      alert('Address created successfully!')
      navigate(`/customers/${customerId}`)
    } catch (error) {
      alert('Failed to create address')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Back
      </button>
      <h2>Add New Address</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            name="address_line"
            placeholder="Address Line"
            value={form.address_line}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.address_line && <p style={{ color: 'red' }}>{errors.address_line}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.state && <p style={{ color: 'red' }}>{errors.state}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            name="pin_code"
            placeholder="Pin Code"
            value={form.pin_code}
            onChange={handleChange}
            maxLength="6"
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.pin_code && <p style={{ color: 'red' }}>{errors.pin_code}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Create Address'}
        </button>
      </form>
    </div>
  )
}

export default CreateAddress
