import React, { useState } from "react";
import {
  HeaderContainer,
  HeroText,
  NavContainer,
  MenueLineBottom,
} from "./Header.styled";
import backgroundImage from "../../assets/images/ShirkusHeader2.jpg";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaHome, FaDog } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLinkClick = () => {
    if (isNavOpen) {
      setIsNavOpen(false);
    }
  };

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
          <Container className="d-flex justify-content-between align-items-center">
            <Navbar.Toggle
              aria-controls="navbar-nav"
              onClick={() => setIsNavOpen(!isNavOpen)}
            />

            <Navbar.Collapse id="navbar-nav" in={isNavOpen}>
              <Nav className="w-100 d-lg-flex justify-content-between fs-5 mb-5 mb-lg-1">
                <NavLink
                  to="/"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "bottom-border active nav-link"
                      : "bottom-border nav-link"
                  }
                >
                  Hjem
                </NavLink>
                <NavLink
                  to="/dogs"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "bottom-border active nav-link"
                      : "bottom-border nav-link"
                  }
                >
                  Våre hunder
                </NavLink>
                <NavLink
                  to="/litters"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "bottom-border active nav-link"
                      : "bottom-border nav-link"
                  }
                >
                  Valpe kull
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "bottom-border active nav-link"
                      : "bottom-border nav-link"
                  }
                >
                  Om oss
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "bottom-border active nav-link"
                      : "bottom-border nav-link"
                  }
                >
                  Kontakt
                </NavLink>
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
