import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaMapMarkedAlt, 
  FaPlus,
  FaSearch,
  FaHome
} from 'react-icons/fa'

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
  overflow-y: auto;
  z-index: 1001;

  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
`

const Logo = styled.div`
  padding: 0 20px 30px;
  border-bottom: 1px solid #34495e;
  margin-bottom: 20px;
`

const LogoText = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: #3498db;
  margin: 0;
`

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const MenuItem = styled.li`
  margin-bottom: 5px;
`

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: ${props => props.$isActive ? '#3498db' : '#bdc3c7'};
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: ${props => props.$isActive ? '3px solid #3498db' : '3px solid transparent'};
  background-color: ${props => props.$isActive ? 'rgba(52, 152, 219, 0.1)' : 'transparent'};

  &:hover {
    color: #3498db;
    background-color: rgba(52, 152, 219, 0.1);
  }

  svg {
    margin-right: 12px;
    font-size: 16px;
  }
`

const MenuText = styled.span`
  font-size: 14px;
  font-weight: 500;
`

const MenuSection = styled.div`
  margin-bottom: 30px;
`

const SectionTitle = styled.h3`
  font-size: 12px;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 20px;
  margin-bottom: 15px;
  font-weight: 600;
`

const Sidebar = () => {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true
    }
    return false
  }

  return (
    <SidebarContainer>
      <Logo>
        <LogoText>Customer CRM</LogoText>
      </Logo>
      
      <MenuSection>
        <SectionTitle>Main</SectionTitle>
        <MenuList>
          <MenuItem>
            <MenuLink to="/" $isActive={isActive('/')}>
              <FaTachometerAlt />
              <MenuText>Dashboard</MenuText>
            </MenuLink>
          </MenuItem>
        </MenuList>
      </MenuSection>

      <MenuSection>
        <SectionTitle>Customers</SectionTitle>
        <MenuList>
          <MenuItem>
            <MenuLink to="/customers" $isActive={isActive('/customers')}>
              <FaUsers />
              <MenuText>All Customers</MenuText>
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/customers/create" $isActive={isActive('/customers/create')}>
              <FaPlus />
              <MenuText>Add Customer</MenuText>
            </MenuLink>
          </MenuItem>
        </MenuList>
      </MenuSection>

      <MenuSection>
        <SectionTitle>Addresses</SectionTitle>
        <MenuList>
          <MenuItem>
            <MenuLink to="/multiple-addresses" $isActive={isActive('/multiple-addresses')}>
              <FaMapMarkedAlt />
              <MenuText>Multiple Addresses</MenuText>
            </MenuLink>
          </MenuItem>
        </MenuList>
      </MenuSection>

      <MenuSection>
        <SectionTitle>Search</SectionTitle>
        <MenuList>
          <MenuItem>
            <MenuLink to="/search" $isActive={isActive('/search')}>
              <FaSearch />
              <MenuText>Search by Location</MenuText>
            </MenuLink>
          </MenuItem>
        </MenuList>
      </MenuSection>
    </SidebarContainer>
  )
}

export default Sidebar
