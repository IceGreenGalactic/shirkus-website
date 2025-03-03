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
import LittersDetail from "./pages/LittersDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="hunder" element={<OurDogs />} />
            <Route path="hunder/:id" element={<DogDetail />} />
            <Route path="valper" element={<Litters />} />
            <Route path="valper/:id" element={<LittersDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;