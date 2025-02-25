// src/components/Layout.jsx
import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { LayoutContainer } from './Layout.styled'

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <main>{children}</main>
      <Footer />
    </LayoutContainer>
  )
}

export default Layout
