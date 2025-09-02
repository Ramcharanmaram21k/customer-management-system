import React from 'react'
import styled from 'styled-components'
import { FaSearch, FaBell, FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 250px;
  height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    left: 0;
  }
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 25px;
  padding: 8px 16px;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: 200px;
  }
`

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  margin-left: 10px;
  flex: 1;
  font-size: 14px;
  color: #333;

  &::placeholder {
    color: #6c757d;
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #6c757d;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
    color: #007bff;
  }
`

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px;
  border-radius: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`

const UserName = styled.span`
  font-weight: 500;
  color: #333;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const Header = () => {
  const navigate = useNavigate()

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const searchTerm = e.target.value.trim()
      if (searchTerm) {
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      }
    }
  }

  return (
    <HeaderContainer>
      <SearchContainer>
        <FaSearch color="#6c757d" />
        <SearchInput
          type="text"
          placeholder="Search customers, addresses, city, state..."
          onKeyPress={handleSearch}
        />
      </SearchContainer>
      
      <RightSection>
        <IconButton>
          <FaBell />
        </IconButton>
        
        <UserProfile>
          <FaUser />
          <UserName>Admin User</UserName>
        </UserProfile>
      </RightSection>
    </HeaderContainer>
  )
}

export default Header
