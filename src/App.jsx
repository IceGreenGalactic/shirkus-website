// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./styles/theme";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import OurDogs from "./pages/OurDogs";
import DogDetail from "./pages/DogDetail";
import Litters from "./pages/Litters";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dogs" element={<OurDogs />} />
            <Route path="/dogs/:id" element={<DogDetail />} /> 
            <Route path="/litters" element={<Litters />} />

          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
