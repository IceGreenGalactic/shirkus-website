// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from './styles/GlobalStyles'
import { theme } from './styles/theme'
import Layout from './components/layout/Layout'
import Home from './pages/Home'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Legg til flere ruter etter behov */}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
