import React from "react";
import {
  HeaderContainer,
  HeroText,
  NavContainer,
  MenueLineBottom,
} from "./Header.styled";
import backgroundImage from "../../assets/images/ShirkusHeader2.jpg";
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
        <HeroText className="col-12 m-auto text-center">
          Kennel Shirkus
        </HeroText>
      </HeaderContainer>
      <NavContainer>
        <Navbar
          expand="lg"
          className="navbar col-4 col-lg-12"
          style={{
            background: "transparent",
            position: "relative",
            zIndex: 2000,
          }}
        >
          <Container className="d-flex justify-content-between align-items-center ">
            <Navbar.Toggle aria-controls="navbar-nav" />

            <Navbar.Collapse id="navbar-nav">
              <Nav className="w-100 d-lg-flex justify-content-between fs-5 mb-5 ">
                <Nav.Link className="bottom-border" href="/">Hjem</Nav.Link>
                <Nav.Link className="bottom-border" href="/dogs">Våre hunder</Nav.Link>
                <Nav.Link className="bottom-border" href="/litters">Valpe kull</Nav.Link>
                <Nav.Link className="bottom-border" href="/about">Om oss</Nav.Link>
                <Nav.Link className="bottom-border" href="/contact">Kontakt</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* For mobile: Always visible links */}
        <MenueLineBottom className="d-lg-none fixed-bottom p-3 w-100 bg-none d-flex justify-content-around align-items-center navIcons">
          <Nav className="navIcons">
            <Nav.Link href="/">
              <FaHome className="nav-icon" />
            </Nav.Link>
            <Nav.Link href="/dogs">
              <FaDog className="nav-icon" />
            </Nav.Link>
          </Nav>
        </MenueLineBottom>
      </NavContainer>
    </>
  );
};

export default Header;
