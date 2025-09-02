import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { FaArrowLeft, FaEdit, FaPlus, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa'
import { customerAPI, addressAPI } from '../services/api'

const CustomerDetailsContainer = styled.div`
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
  text-decoration: none;
  font-size: 14px;

  &:hover {
    background: #7f8c8d;
  }

  svg {
    margin-right: 8px;
  }
`

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`

const EditButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    background: #e67e22;
  }

  svg {
    margin-right: 8px;
  }
`

const CustomerInfo = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
`

const CustomerName = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: 600;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || '#3498db'};
  color: white;
  font-size: 16px;
`

const InfoText = styled.div`
  flex: 1;
`

const InfoLabel = styled.div`
  font-size: 12px;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`

const InfoValue = styled.div`
  font-size: 16px;
  color: #2c3e50;
  font-weight: 500;
`

const AddressesSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
`

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`

const AddButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    background: #229954;
  }

  svg {
    margin-right: 8px;
  }
`

const AddressList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`

const AddressCard = styled.div`
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: ${props => props.isPrimary ? '#e8f5e8' : '#ffffff'};
`

const AddressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`

const PrimaryBadge = styled.span`
  background: #27ae60;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const AddressText = styled.p`
  color: #2c3e50;
  margin: 0;
  line-height: 1.5;
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 16px;
  color: #7f8c8d;
`

const ErrorMessage = styled.div`
  color: #e74c3c;
  background-color: #fadbd8;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
`

const CustomerDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCustomerDetails()
  }, [id])

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true)
      const response = await customerAPI.getById(id)
      setCustomer(response.data)
      setAddresses(response.data.addresses || [])
    } catch (error) {
      console.error('Error fetching customer details:', error)
      setError('Failed to load customer details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner>Loading customer details...</LoadingSpinner>
  }

  if (error) {
    return (
      <CustomerDetailsContainer>
        <ErrorMessage>Error: {error}</ErrorMessage>
        <BackButton onClick={() => navigate('/customers')}>
          <FaArrowLeft />
          Back to Customers
        </BackButton>
      </CustomerDetailsContainer>
    )
  }

  if (!customer) {
    return (
      <CustomerDetailsContainer>
        <ErrorMessage>Customer not found</ErrorMessage>
        <BackButton onClick={() => navigate('/customers')}>
          <FaArrowLeft />
          Back to Customers
        </BackButton>
      </CustomerDetailsContainer>
    )
  }

  return (
    <CustomerDetailsContainer>
      <Header>
        <BackButton onClick={() => navigate('/customers')}>
          <FaArrowLeft />
          Back to Customers
        </BackButton>
        <HeaderActions>
          <EditButton to={`/customers/${id}/edit`}>
            <FaEdit />
            Edit Customer
          </EditButton>
        </HeaderActions>
      </Header>

      <CustomerInfo>
        <CustomerName>{customer.first_name} {customer.last_name}</CustomerName>
        <InfoGrid>
          <InfoItem>
            <InfoIcon color="#3498db">
              <FaUser />
            </InfoIcon>
            <InfoText>
              <InfoLabel>Customer ID</InfoLabel>
              <InfoValue>#{customer.id}</InfoValue>
            </InfoText>
          </InfoItem>

          <InfoItem>
            <InfoIcon color="#e74c3c">
              <FaPhone />
            </InfoIcon>
            <InfoText>
              <InfoLabel>Phone Number</InfoLabel>
              <InfoValue>{customer.phone_number}</InfoValue>
            </InfoText>
          </InfoItem>

          <InfoItem>
            <InfoIcon color="#f39c12">
              <FaEnvelope />
            </InfoIcon>
            <InfoText>
              <InfoLabel>Email Address</InfoLabel>
              <InfoValue>{customer.email || 'Not provided'}</InfoValue>
            </InfoText>
          </InfoItem>

          <InfoItem>
            <InfoIcon color="#27ae60">
              <FaMapMarkerAlt />
            </InfoIcon>
            <InfoText>
              <InfoLabel>Total Addresses</InfoLabel>
              <InfoValue>{addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}</InfoValue>
            </InfoText>
          </InfoItem>
        </InfoGrid>
      </CustomerInfo>

      <AddressesSection>
        <SectionHeader>
          <SectionTitle>Addresses</SectionTitle>
          <AddButton to={`/customers/${id}/addresses/create`}>
            <FaPlus />
            Add New Address
          </AddButton>
        </SectionHeader>

        {addresses.length > 0 ? (
          <AddressList>
            {addresses.map(address => (
              <AddressCard key={address.id} isPrimary={address.is_primary === 1}>
                <AddressHeader>
                  {address.is_primary === 1 && <PrimaryBadge>Primary</PrimaryBadge>}
                </AddressHeader>
                <AddressText>
                  {address.address_line}<br />
                  {address.city}, {address.state} - {address.pin_code}
                </AddressText>
              </AddressCard>
            ))}
          </AddressList>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
            <FaMapMarkerAlt size={48} style={{ marginBottom: '20px' }} />
            <p>No addresses found for this customer.</p>
            <AddButton to={`/customers/${id}/addresses/create`}>
              <FaPlus />
              Add First Address
            </AddButton>
          </div>
        )}
      </AddressesSection>
    </CustomerDetailsContainer>
  )
}

export default CustomerDetails
