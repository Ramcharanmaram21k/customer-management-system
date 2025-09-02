import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FaSave, FaArrowLeft } from 'react-icons/fa'
import { customerAPI } from '../services/api'

const EditCustomerContainer = styled.div`
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
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #e67e22;
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 16px;
  color: #7f8c8d;
`

const EditCustomer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: ''
  })

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const fetchCustomer = async () => {
    try {
      setLoading(true)
      const response = await customerAPI.getById(id)
      const customer = response.data
      setFormData({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        phone_number: customer.phone_number || '',
        email: customer.email || ''
      })
    } catch (error) {
      console.error('Error fetching customer:', error)
      alert('Failed to load customer data')
      navigate('/customers')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      const customerData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: formData.phone_number.trim(),
        email: formData.email.trim() || null
      }

      await customerAPI.update(id, customerData)
      
      alert('Customer updated successfully!')
      navigate(`/customers/${id}`)
      
    } catch (error) {
      console.error('Error updating customer:', error)
      
      if (error.errors) {
        const serverErrors = {}
        error.errors.forEach(err => {
          if (err.includes('phone number')) {
            serverErrors.phone_number = err
          } else if (err.includes('email')) {
            serverErrors.email = err
          }
        })
        setErrors(prev => ({ ...prev, ...serverErrors }))
      } else if (error.message.includes('already exists')) {
        setErrors(prev => ({
          ...prev,
          phone_number: 'Phone number or email already exists'
        }))
      } else {
        alert('Failed to update customer. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner>Loading customer data...</LoadingSpinner>
  }

  return (
    <EditCustomerContainer>
      <Header>
        <BackButton onClick={() => navigate(`/customers/${id}`)}>
          <FaArrowLeft />
          Back to Customer
        </BackButton>
        <PageTitle>Edit Customer</PageTitle>
      </Header>

      <FormContainer>
        <Form onSubmit={handleSubmit}>
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

          <ButtonGroup>
            <CancelButton type="button" onClick={() => navigate(`/customers/${id}`)}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={saving}>
              <FaSave />
              {saving ? 'Updating...' : 'Update Customer'}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </EditCustomerContainer>
  )
}

export default EditCustomer
