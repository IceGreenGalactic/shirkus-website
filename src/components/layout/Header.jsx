import React, { useState, useEffect, useRef } from "react";
import { HeaderContainer, HeroText, NavContainer } from "./Header.styled";
import backgroundImage from "../../assets/images/ShirkusHeader2.jpg";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navbarRef = useRef(null);

  const handleLinkClick = () => {
    if (isNavOpen) {
      setIsNavOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Hero Image Section */}
      <HeaderContainer>
        <img
          src={backgroundImage}
          alt="Hero Image of five poodles sitting in the grass"
          className="hero-image"
        />
        <HeroText className="col-12 m-auto text-center d-none d-lg-block ">
          Kennel Shirkus
        </HeroText>
      </HeaderContainer>

      {/* Navbar */}
      <NavContainer>
        <Navbar expand="lg" className="navbar " ref={navbarRef}>
          <Container className="d-flex justify-content-between align-items-center col-lg-10">
            {/* Mobil: Logo + Hamburgermeny */}
            <div className="mobile-header d-lg-none d-flex flex-row-reverse  align-items-center justify-content-center  w-100">
              <HeroText className="m-0 justify-content-center m-auto">
                Kennel Shirkus
              </HeroText>
              <Navbar.Toggle
                aria-controls="navbar-nav"
                onClick={() => setIsNavOpen(!isNavOpen)}
              />
            </div>

            {/* Desktop: Navbar meny */}
            <Navbar.Collapse id="navbar-nav" in={isNavOpen}>
              <Nav className="w-100 d-lg-flex justify-content-between fs-5 mb-lg-1">
                <NavLink
                  to="/"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `${isActive ? "active" : ""} bottom-border nav-link`
                  }
                >
                  <span>Hjem</span>
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
                  <span>Våre hunder</span>
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
                  <span>Valpekull</span>
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
                  <span>Om oss</span>
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
                  <span>Kontakt</span>
                </NavLink>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </NavContainer>
    </>
  );
};

export default Header;
