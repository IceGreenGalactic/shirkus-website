import React, { useState } from "react";
import {
  HeaderContainer,
  HeroText,
  NavContainer,
  HeaderImg,
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
      <HeaderImg>
        <img
          src={backgroundImage}
          alt="Hero Image of five poodles sitting in the grass"
          className="hero-image"
        />
      </HeaderImg>
      <HeaderContainer className="d-flex flex-row-reverse d-lg-block">
        <HeroText className=" m-auto text-center ">Kennel Shirkus</HeroText>
        </HeaderContainer>
        <HeaderContainer>
        <NavContainer>
          <Navbar expand="lg" className="navbar col-12">
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
                      `${isActive ? "active" : ""} bottom-border nav-link`
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
                    Valpekull
                  </NavLink>

                  <NavLink
                    to="/gallery"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      isActive
                        ? "bottom-border active nav-link"
                        : "bottom-border nav-link"
                    }
                  >
                    Galleri
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
        </NavContainer>
      </HeaderContainer>
    </>
  );
};

export default Header;
