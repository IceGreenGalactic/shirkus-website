import React from "react";
import { HeaderContainer, HeroText, NavContainer } from "./Header.styled";
import backgroundImage from "../../assets/images/poodleHero.jpg";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaHome, FaDog } from "react-icons/fa";

const Header = () => {
  return (
    <>
      <HeaderContainer>
        <img
          src={backgroundImage}
          alt="Hero Image of five poodles sitting in the grass"
          className="hero-image"
        />
        <HeroText>Kennel Shirkus</HeroText>
      </HeaderContainer>
      <NavContainer>
        <Navbar
          expand="lg"
          className="navbar col-7 col-lg-12"
          style={{
            background: "transparent",
            position: "relative",
            zIndex: 2000,
          }}
        >
          <Container className="d-flex justify-content-between align-items-center">
            <Navbar.Toggle aria-controls="navbar-nav" />

            <Navbar.Collapse id="navbar-nav">
              <Nav className="w-100 d-lg-flex justify-content-between">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/dogs">Our Dogs</Nav.Link>
                <Nav.Link href="/litters">Litters</Nav.Link>
                <Nav.Link href="/about">About Us</Nav.Link>
                <Nav.Link href="/contact">Contact</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* For mobile: Always visible links */}
        <div className="d-lg-none fixed-bottom w-100 bg-none d-flex justify-content-around align-items-center p-2">
          <Nav className="navIcons" >
            <Nav.Link href="/">
              <FaHome />
            </Nav.Link>
            <Nav.Link href="/dogs">
              <FaDog />
            </Nav.Link>
          </Nav>
        </div>
      </NavContainer>
    </>
  );
};

export default Header;
