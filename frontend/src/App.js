import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'

// Components
import Header from './pages/Header'
import Sidebar from './pages/Sidebar'

// Pages
import AddressList from './pages/AddressList'
import CustomerList from './pages/CustomerList'
import CreateCustomer from './pages/CreateCustomer'
import Dashboard from './pages/Dashboard'
import CustomerDetails from './pages/CustomerDetails'
import EditCustomer from './pages/EditCustomer'

import CreateAddress from './pages/CreateAddress'
import EditAddress from './pages/EditAddress'
import MultipleAddresses from './pages/MultipleAddresses'
import SearchResults from './pages/SearchResults'

// Global styles
import './App.css'

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  margin-top: 60px;

  @media (max-width: 768px) {
    padding: 15px;
  }
`

function App() {
  return (
    <Router>
      <AppContainer>
        <Sidebar />
        <MainContent>
          <Header />
          <ContentArea>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/create" element={<CreateCustomer />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
              <Route path="/customers/:id/edit" element={<EditCustomer />} />
              <Route path="/customers/:customerId/addresses" element={<AddressList />} />
              <Route path="/customers/:customerId/addresses/create" element={<CreateAddress />} />
              <Route path="/addresses/:id/edit" element={<EditAddress />} />
              <Route path="/multiple-addresses" element={<MultipleAddresses />} />
              <Route path="/search" element={<SearchResults />} />
            </Routes>
          </ContentArea>
        </MainContent>
      </AppContainer>
    </Router>
  )
}

export default App
