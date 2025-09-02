import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa'
import { addressAPI, customerAPI } from '../services/api'

const AddressListContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
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

const HeaderInfo = styled.div`
  flex: 1;
`

const PageTitle = styled.h1`
  color: #2c3e50;
  margin: 0 0 5px;
  font-size: 28px;
  font-weight: 600;
`

const CustomerName = styled.p`
  color: #7f8c8d;
  margin: 0;
  font-size: 16px;
`

const AddButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: #27ae60;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;

  &:hover {
    background: #229954;
  }

  svg {
    margin-right: 8px;
  }
`

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`

const AddressCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  border: ${props => props.isPrimary ? '2px solid #27ae60' : '1px solid #e9ecef'};
`

const AddressHeader = styled.div`
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const PrimaryBadge = styled.span`
  background: #27ae60;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`

const AddressActions = styled.div`
  display: flex;
  gap: 8px;
`

const ActionButton = styled(Link)`
  padding: 6px 8px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  
  &.edit {
    background: #f39c12;
    color: white;

    &:hover {
      background: #e67e22;
    }
  }
`

const DeleteButton = styled.button`
  padding: 6px 8px;
  border-radius: 4px;
  border: none;
  background: #e74c3c;
  color: white;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #c0392b;
  }
`

const AddressContent = styled.div`
  padding: 20px;
`

const AddressText = styled.p`
  color: #2c3e50;
  margin: 0;
  line-height: 1.6;
  font-size: 15px;
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 16px;
  color: #7f8c8d;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;

  svg {
    margin-bottom: 20px;
  }

  h3 {
    margin-bottom: 10px;
    color: #2c3e50;
  }

  p {
    margin-bottom: 30px;
  }
`

const AddressList = () => {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState([])
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [customerId])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch customer info and addresses in parallel
      const [customerResponse, addressResponse] = await Promise.all([
        customerAPI.getById(customerId),
        addressAPI.getByCustomerId(customerId)
      ])
      
      setCustomer(customerResponse.data)
      setAddresses(addressResponse.data)
      
    } catch (error) {
      console.error('Error fetching ', error)
      setError('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address? This action cannot be undone.')) {
      try {
        await addressAPI.delete(addressId)
        alert('Address deleted successfully!')
        fetchData() // Refresh the list
      } catch (error) {
        console.error('Error deleting address:', error)
        alert('Failed to delete address. Please try again.')
      }
    }
  }

  if (loading) {
    return <LoadingSpinner>Loading addresses...</LoadingSpinner>
  }

  if (error) {
    return (
      <AddressListContainer>
        <div style={{ color: 'red', marginBottom: '20px' }}>Error: {error}</div>
        <BackButton onClick={() => navigate('/customers')}>
          <FaArrowLeft />
          Back to Customers
        </BackButton>
      </AddressListContainer>
    )
  }

  return (
    <AddressListContainer>
      <Header>
        <BackButton onClick={() => navigate(`/customers/${customerId}`)}>
          <FaArrowLeft />
          Back to Customer
        </BackButton>
        
        <HeaderInfo>
          <PageTitle>Customer Addresses</PageTitle>
          {customer && (
            <CustomerName>
              {customer.first_name} {customer.last_name}
            </CustomerName>
          )}
        </HeaderInfo>
        
        <AddButton to={`/customers/${customerId}/addresses/create`}>
          <FaPlus />
          Add New Address
        </AddButton>
      </Header>

      {addresses.length > 0 ? (
        <AddressGrid>
          {addresses.map(address => (
            <AddressCard key={address.id} isPrimary={address.is_primary === 1}>
              <AddressHeader>
                {address.is_primary === 1 && <PrimaryBadge>Primary Address</PrimaryBadge>}
                <AddressActions>
                  <ActionButton to={`/addresses/${address.id}/edit`} className="edit">
                    <FaEdit />
                  </ActionButton>
                  <DeleteButton onClick={() => handleDeleteAddress(address.id)}>
                    <FaTrash />
                  </DeleteButton>
                </AddressActions>
              </AddressHeader>
              
              <AddressContent>
                <AddressText>
                  {address.address_line}<br />
                  {address.city}, {address.state}<br />
                  PIN: {address.pin_code}
                </AddressText>
              </AddressContent>
            </AddressCard>
          ))}
        </AddressGrid>
      ) : (
        <EmptyState>
          <FaMapMarkerAlt size={64} />
          <h3>No Addresses Found</h3>
          <p>This customer doesn't have any addresses yet.</p>
          <AddButton to={`/customers/${customerId}/addresses/create`}>
            <FaPlus />
            Add First Address
          </AddButton>
        </EmptyState>
      )}
    </AddressListContainer>
  )
}

export default AddressList
