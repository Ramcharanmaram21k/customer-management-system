import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FaSave, FaArrowLeft } from 'react-icons/fa'
import { customerAPI } from '../services/api'

const CreateCustomerContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    background: #7f8c8d;
  }

  svg {
    margin-right: 8px;
  }
`

const PageTitle = styled.h1`
  color: #2c3e50;
  margin: 0;
  font-size: 28px;
  font-weight: 600;
`

const FormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Section = styled.div`
  margin-bottom: 30px;
`

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ecf0f1;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
  font-size: 14px;
`

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  &.error {
    border-color: #e74c3c;
  }
`

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  &.error {
    border-color: #e74c3c;
  }
`

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
`

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background: #229954;
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }

  svg {
    margin-right: 8px;
  }
`

const CancelButton = styled.button`
  padding: 12px 24px;
  background: transparent;
  color: #7f8c8d;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f8f9fa;
  }
`

const CreateCustomer = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    address: {
      address_line: '',
      city: '',
      state: '',
      pin_code: ''
    }
  })

  const validateForm = () => {
    const newErrors = {}

    // Customer validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters'
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters'
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid 10-digit Indian mobile number'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Address validation (optional but if provided, must be valid)
    const hasAnyAddressField = formData.address.address_line || 
                              formData.address.city || 
                              formData.address.state || 
                              formData.address.pin_code

    if (hasAnyAddressField) {
      if (!formData.address.address_line.trim()) {
        newErrors.address_line = 'Address line is required'
      } else if (formData.address.address_line.trim().length < 5) {
        newErrors.address_line = 'Address must be at least 5 characters'
      }

      if (!formData.address.city.trim()) {
        newErrors.city = 'City is required'
      }

      if (!formData.address.state.trim()) {
        newErrors.state = 'State is required'
      }

      if (!formData.address.pin_code.trim()) {
        newErrors.pin_code = 'Pin code is required'
      } else if (!/^\d{6}$/.test(formData.address.pin_code)) {
        newErrors.pin_code = 'Pin code must be 6 digits'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value, isAddress = false) => {
    if (isAddress) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!validateForm()) return
  
  setLoading(true)

    const hasAddress = Object.values(formData.address).some(field => field.trim() !== '')
  
  try {
    const customerData = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone_number: formData.phone_number.trim(),
      email: formData.email.trim() || null,
      address: hasAddress ? {
        address_line: formData.address.address_line.trim(),
        city: formData.address.city.trim(),
        state: formData.address.state.trim(),
        pin_code: formData.address.pin_code.trim()
      } : null
    }

    console.log('Sending customer ', customerData) // Debug log
    
    const response = await customerAPI.create(customerData)
    
    alert('Customer created successfully!')
    navigate('/customers')
    
  } catch (error) {
    console.error('Complete error object:', error) // Full error logging
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      console.log('Error status:', error.response.status)
      console.log('Error ', error.response.data)
      
      if (error.response.data?.errors) {
        // Validation errors from backend
        const errorMessages = error.response.data.errors.join('\n')
        alert(`Validation failed:\n${errorMessages}`)
      } else if (error.response.data?.message) {
        // Specific error message from backend
        alert(`Server error: ${error.response.data.message}`)
      } else {
        // Generic server error with status code
        alert(`Server error ${error.response.status}: ${JSON.stringify(error.response.data)}`)
      }
    } else if (error.request) {
      // Network error - no response received
      alert('Network error: Cannot reach server. Please check if backend is running.')
    } else {
      // Other errors (e.g., request setup)
      alert(`Request error: ${error.message}`)
    }
  } finally {
    setLoading(false)
  }
}


  return (
    <CreateCustomerContainer>
      <Header>
        <BackButton onClick={() => navigate('/customers')}>
          <FaArrowLeft />
          Back to Customers
        </BackButton>
        <PageTitle>Add New Customer</PageTitle>
      </Header>

      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>Customer Information</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className={errors.first_name ? 'error' : ''}
                  placeholder="Enter first name"
                />
                {errors.first_name && <ErrorMessage>{errors.first_name}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className={errors.last_name ? 'error' : ''}
                  placeholder="Enter last name"
                />
                {errors.last_name && <ErrorMessage>{errors.last_name}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  className={errors.phone_number ? 'error' : ''}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                />
                {errors.phone_number && <ErrorMessage>{errors.phone_number}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter email address (optional)"
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </FormGroup>
            </FormRow>
          </Section>

          <Section>
            <SectionTitle>Address Information (Optional)</SectionTitle>
            <FormGroup>
              <Label htmlFor="address_line">Address Line</Label>
              <TextArea
                id="address_line"
                value={formData.address.address_line}
                onChange={(e) => handleInputChange('address_line', e.target.value, true)}
                className={errors.address_line ? 'error' : ''}
                placeholder="Enter complete address"
              />
              {errors.address_line && <ErrorMessage>{errors.address_line}</ErrorMessage>}
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('city', e.target.value, true)}
                  className={errors.city ? 'error' : ''}
                  placeholder="Enter city"
                />
                {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('state', e.target.value, true)}
                  className={errors.state ? 'error' : ''}
                  placeholder="Enter state"
                />
                {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="pin_code">Pin Code</Label>
                <Input
                  id="pin_code"
                  type="text"
                  value={formData.address.pin_code}
                  onChange={(e) => handleInputChange('pin_code', e.target.value, true)}
                  className={errors.pin_code ? 'error' : ''}
                  placeholder="6-digit pin code"
                  maxLength="6"
                />
                {errors.pin_code && <ErrorMessage>{errors.pin_code}</ErrorMessage>}
              </FormGroup>
            </FormRow>
          </Section>

          <ButtonGroup>
            <CancelButton type="button" onClick={() => navigate('/customers')}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              <FaSave />
              {loading ? 'Creating...' : 'Create Customer'}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </CreateCustomerContainer>
  )
}

export default CreateCustomer
